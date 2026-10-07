/**
 * Storage layer for the Bihar Got Talent artist registration + admin export.
 *
 * Primary store: a Cloudflare KV namespace bound as `KS_KV` on the Pages
 * project (Settings → Functions → KV namespace binding). Every value is
 * JSON-encoded under a flat key so a future move to D1/CRM needs no
 * migration of the callers.
 *
 *   artist:email:{email}          → full artist record (dedupe index)
 *   artist:phone:{digits}         → the email it belongs to (dedupe index)
 *   artist:id:{id}                → full artist record
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

/**
 * All roster records, keyed by `artist:email:…`. The dedupe index stores the
 * full artist object, so this is complete without a second lookup.
 */
export async function listArtists(env) {
  const prefix = "artist:email:";
  const keys = await keysWithPrefix(env, prefix);
  const artists = [];
  for (const key of keys) {
    const record = await get(env, key);
    if (record && typeof record === "object") artists.push(record);
  }
  return artists;
}
