/**
 * Storage layer for the Bihar Got Talent registration + notification APIs.
 *
 * Primary store: a Cloudflare KV namespace bound as `KS_KV` on the Pages
 * project (Settings → Functions → KV namespace binding). Every value is
 * JSON-encoded under a flat key so a future move to D1/CRM needs no
 * migration of the callers.
 *
 *   artist:email:{email}          → full artist record (dedupe index)
 *   artist:phone:{digits}         → the email it belongs to (dedupe index)
 *   artist:id:{id}                → full artist record
 *   artist:notifications:{email}  → NotificationItem[] (newest first)
 *
 * Without the binding (local `wrangler pages dev`, or a project that has not
 * wired KV up yet) the helpers fall back to one process-wide in-memory Map so
 * the API still behaves correctly inside a single isolate. That fallback is
 * ephemeral — it exists so the endpoint degrades to "works until restart"
 * instead of failing outright.
 */

const MEMORY_STORE = "__ksArtistStore";

function memory() {
  const g = globalThis;
  if (!g[MEMORY_STORE]) g[MEMORY_STORE] = new Map();
  return g[MEMORY_STORE];
}

function hasKV(env) {
  return Boolean(env && env.KS_KV && typeof env.KS_KV.get === "function");
}

async function get(env, key) {
  if (hasKV(env)) {
    const raw = await env.KS_KV.get(key);
    if (raw === null || raw === undefined) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  return memory().get(key) ?? null;
}

async function set(env, key, value) {
  if (hasKV(env)) {
    await env.KS_KV.put(key, JSON.stringify(value));
    return;
  }
  memory().set(key, value);
}

async function keysWithPrefix(env, prefix) {
  if (hasKV(env)) {
    // 1000 keys per page — enough for a district-sized roster, and the call
    // site only needs emails for a fan-out write.
    const page = await env.KS_KV.list({ prefix });
    return page.keys.map((k) => k.name);
  }
  return [...memory().keys()].filter((k) => k.startsWith(prefix));
}

export function normalizeEmail(value) {
  return String(value ?? "").trim().toLowerCase();
}

/** Digits only, dropping a leading 91/0 country or trunk code. */
export function normalizePhone(value) {
  const digits = String(value ?? "").replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits;
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

export function newId() {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/* ─── Artists ──────────────────────────────────────────────────────── */

/**
 * Returns `"email"`, `"phone"`, or `null` — which index (if any) already
 * holds this registration.
 */
export async function findConflictingArtist(env, { email, phone }) {
  const byEmail = await get(env, `artist:email:${email}`);
  if (byEmail) return "email";
  if (phone) {
    const byPhone = await get(env, `artist:phone:${phone}`);
    if (byPhone) return "phone";
  }
  return null;
}

export async function saveArtist(env, artist) {
  await set(env, `artist:email:${artist.email}`, artist);
  if (artist.phone) await set(env, `artist:phone:${artist.phone}`, artist.email);
  await set(env, `artist:id:${artist.id}`, artist);
}

export async function getArtist(env, email) {
  return get(env, `artist:email:${normalizeEmail(email)}`);
}

export async function listArtistEmails(env) {
  const prefix = "artist:email:";
  const keys = await keysWithPrefix(env, prefix);
  return keys.map((k) => k.slice(prefix.length)).filter(Boolean);
}

/* ─── Notifications ────────────────────────────────────────────────── */

/** Older entries beyond this count are trimmed on write. */
const NOTIFICATION_LIMIT = 50;

function notificationsKey(email) {
  return `artist:notifications:${normalizeEmail(email)}`;
}

export async function getNotifications(env, email) {
  const items = await get(env, notificationsKey(email));
  return Array.isArray(items) ? items : [];
}

/** Prepends new items (newest-first list) and trims the tail. */
export async function addNotifications(env, email, items) {
  const existing = await getNotifications(env, email);
  const merged = [...items, ...existing].slice(0, NOTIFICATION_LIMIT);
  await set(env, notificationsKey(email), merged);
  return merged;
}

export async function markNotificationRead(env, email, id) {
  const items = await getNotifications(env, email);
  const next = items.map((item) => (item.id === id ? { ...item, read: true } : item));
  await set(env, notificationsKey(email), next);
  return next;
}

export async function markAllNotificationsRead(env, email) {
  const items = await getNotifications(env, email);
  const next = items.map((item) => ({ ...item, read: true }));
  await set(env, notificationsKey(email), next);
  return next;
}

/** Fan-out used by the admin `broadcast` action. */
export async function notifyAllArtists(env, item) {
  const emails = await listArtistEmails(env);
  await Promise.all(emails.map((email) => addNotifications(env, email, [item])));
  return emails.length;
}
