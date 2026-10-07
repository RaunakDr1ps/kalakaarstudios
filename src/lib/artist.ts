/**
 * Shared contract for the "Bihar Got Talent" artist registration flow and the
 * on-site Notification Center.
 *
 * The site is a static export served by Cloudflare Pages, so the server side
 * of this contract lives in `functions/api/*` (Pages Functions), not in Next
 * route handlers. Everything here is client-safe: it only talks to those
 * endpoints over same-origin fetches and to `localStorage` for the local
 * "signed in" artist session.
 */

/** CRM / roster tag applied to every registration from this campaign. */
export const EVENT_SOURCE = "Bihar Got Talent";

export const GENRES = [
  "Music / Singing",
  "Dance",
  "Comedy",
  "Acting / Theatre",
  "Visual Art",
  "Poetry / Storytelling",
  "Other",
] as const;

export type Genre = (typeof GENRES)[number];

/** Suggested cities for the datalist — artists can type any other town. */
export const BIHAR_CITIES = [
  "Patna",
  "Muzaffarpur",
  "Gaya",
  "Darbhanga",
  "Bhagalpur",
  "Purnia",
  "Arrah",
  "Begusarai",
  "Chhapra",
  "Katihar",
  "Saharsa",
  "Motihari",
  "Samastipur",
  "Bihar Sharif",
  "Hajipur",
  "Jamui",
  "Supaul",
  "Araria",
  "Kishanganj",
  "Sitamarhi",
];

export type ArtistRegistration = {
  fullName: string;
  email: string;
  phone: string;
  genre: string;
  city: string;
  portfolio: string;
  bio: string;
  consent: boolean;
  /** Honeypot — real visitors never see or fill this field. */
  company?: string;
};

export type RegisterResponse = {
  ok: boolean;
  artistId?: string;
  /** True when the confirmation email was accepted by Resend. */
  emailSent?: boolean;
  duplicate?: "email" | "phone";
  /** Server-side field errors, keyed by field name. */
  errors?: Record<string, string>;
  message?: string;
  /** True when the API was unreachable and the Formspree fallback handled it. */
  fallback?: boolean;
};

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  link?: string;
  type?: string;
  read: boolean;
  createdAt: string;
};

/**
 * The local artist session — there is no account system on this site, so a
 * successful registration stores the artist's email here. The Notification
 * Bell and /notifications read it to decide which inbox to fetch.
 */
export type ArtistSession = {
  email: string;
  name: string;
  genre: string;
  city: string;
  registeredAt: string;
};

const SESSION_KEY = "ks-artist-session";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const URL_RE = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}
/** Digits only, with a leading 91/0 country or trunk code stripped. */
export function normalizePhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits;
}

/**
 * Client-side validation. Mirrors the Pages Function rules exactly so the
 * usual case never costs a round trip; the API re-checks everything anyway.
 * Returns `{}` when the form is valid.
 */
export function validateRegistration(
  form: ArtistRegistration
): Record<string, string> {
  const errors: Record<string, string> = {};
  const name = form.fullName.trim();
  const email = normalizeEmail(form.email);
  const phone = normalizePhone(form.phone);
  const city = form.city.trim();
  const portfolio = form.portfolio.trim();
  const bio = form.bio.trim();

  if (name.length < 2 || name.length > 80) {
    errors.fullName = "Enter your full name (2–80 characters).";
  }
  if (!EMAIL_RE.test(email)) {
    errors.email = "Enter a valid email address.";
  }
  if (phone.length < 10 || phone.length > 15) {
    errors.phone = "Enter a valid 10-digit mobile number.";
  }
  if (!GENRES.includes(form.genre as Genre)) {
    errors.genre = "Pick the category that fits you best.";
  }
  if (city.length < 2 || city.length > 60) {
    errors.city = "Which city are you performing from?";
  }
  if (portfolio && !URL_RE.test(portfolio)) {
    errors.portfolio = "Use a full link, e.g. https://instagram.com/…";
  }
  if (bio.length < 20) {
    errors.bio = "Tell us a little more — at least 20 characters.";
  } else if (bio.length > 1000) {
    errors.bio = "Keep it under 1000 characters.";
  }
  if (!form.consent) {
    errors.consent = "We need your permission to send audition updates.";
  }
  return errors;
}

/* ─── Local artist session ─────────────────────────────────────────── */

const sessionSubscribers = new Set<() => void>();

function notifySessionSubscribers() {
  sessionSubscribers.forEach((notify) => notify());
}

function readSessionRaw(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

function parseSession(raw: string | null): ArtistSession | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<ArtistSession>;
    if (typeof parsed?.email !== "string") return null;
    return {
      email: parsed.email,
      name: parsed.name ?? "",
      genre: parsed.genre ?? "",
      city: parsed.city ?? "",
      registeredAt: parsed.registeredAt ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

// `useSyncExternalStore` calls getSnapshot on every render and bails out of
// re-rendering only when the reference is unchanged, so the parsed value is
// memoized against the raw string.
let cachedRaw: string | null | undefined;
let cachedSession: ArtistSession | null = null;

/**
 * Snapshot for `useSyncExternalStore`. Returns the same object instance for
 * the same stored JSON, and `null` during SSR / static export.
 */
export function getArtistSessionSnapshot(): ArtistSession | null {
  const raw = readSessionRaw();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedSession = parseSession(raw);
  }
  return cachedSession;
}

/** Notifies React subscribers about session writes (same tab or another). */
export function subscribeArtistSession(onChange: () => void): () => void {
  sessionSubscribers.add(onChange);
  const onStorage = (event: StorageEvent) => {
    if (event.key === SESSION_KEY || event.key === null) onChange();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    sessionSubscribers.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

export function getArtistSession(): ArtistSession | null {
  return getArtistSessionSnapshot();
}

export function saveArtistSession(session: ArtistSession): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    notifySessionSubscribers();
  } catch {
    // Private browsing / storage quota — the bell simply stays hidden.
  }
}

export function clearArtistSession(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(SESSION_KEY);
    notifySessionSubscribers();
  } catch {
    // ignore
  }
}

/* ─── Registration API ─────────────────────────────────────────────── */

async function formSpreeFallback(
  form: ArtistRegistration,
  reason: string
): Promise<RegisterResponse> {
  const id = process.env.NEXT_PUBLIC_FORMSPREE_ID;
  if (!id) {
    return {
      ok: false,
      message: `${reason} Email us at Kalakaarstudios@ssociopro.com and we'll add you manually.`,
    };
  }
  try {
    const data = new FormData();
    data.set("_subject", `New artist registration — ${EVENT_SOURCE}`);
    data.set("_captcha", "false");
    data.set("source", EVENT_SOURCE);
    data.set("fullName", form.fullName);
    data.set("email", form.email);
    data.set("phone", form.phone);
    data.set("genre", form.genre);
    data.set("city", form.city);
    data.set("portfolio", form.portfolio);
    data.set("bio", form.bio);

    const res = await fetch(`https://formspree.io/f/${id}`, {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      return {
        ok: true,
        fallback: true,
        emailSent: false,
        message:
          "Registration received. Confirmation emails resume once the API is back online.",
      };
    }
    return { ok: false, message: `${reason} Please try again in a moment.` };
  } catch {
    return { ok: false, message: `${reason} Please try again in a moment.` };
  }
}

/**
 * POSTs a registration to the Pages Function at `/api/register/artist`.
 *
 * When the endpoint is missing (running under `next dev`, where `functions/`
 * is not executed) or unreachable, the submission degrades to the existing
 * Formspree inbox so entries are never silently dropped.
 */
export async function registerArtist(
  form: ArtistRegistration
): Promise<RegisterResponse> {
  const payload = {
    fullName: form.fullName.trim(),
    email: normalizeEmail(form.email),
    phone: form.phone.trim(),
    genre: form.genre,
    city: form.city.trim(),
    portfolio: form.portfolio.trim(),
    bio: form.bio.trim(),
    consent: form.consent,
    company: form.company ?? "",
    source: EVENT_SOURCE,
  };

  let res: Response;
  try {
    res = await fetch("/api/register/artist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    return formSpreeFallback(form, "The registration API is unreachable.");
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    // Static 404 HTML = the Pages Function is not running here.
    return formSpreeFallback(form, `The registration API is offline (HTTP ${res.status}).`);
  }

  let data: RegisterResponse;
  try {
    data = (await res.json()) as RegisterResponse;
  } catch {
    return formSpreeFallback(form, "The registration API returned an unreadable response.");
  }
  return { ...data, ok: res.ok && data.ok !== false };
}

/* ─── Notifications API ────────────────────────────────────────────── */

export async function fetchNotifications(
  email: string
): Promise<{ notifications: NotificationItem[]; unread: number }> {
  const res = await fetch(
    `/api/notifications?email=${encodeURIComponent(normalizeEmail(email))}`,
    { headers: { Accept: "application/json" } }
  );
  if (!res.ok) {
    const detail = res.status === 404 ? "Notification API unavailable" : `HTTP ${res.status}`;
    throw new Error(detail);
  }
  const data = (await res.json()) as {
    notifications?: NotificationItem[];
    unread?: number;
  };
  const notifications = Array.isArray(data.notifications) ? data.notifications : [];
  return {
    notifications,
    unread:
      typeof data.unread === "number"
        ? data.unread
        : notifications.filter((n) => !n.read).length,
  };
}

export async function postNotificationAction(body: Record<string, unknown>): Promise<void> {
  const res = await fetch("/api/notifications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok && res.status !== 404) {
    throw new Error(`HTTP ${res.status}`);
  }
}

/* ─── Formatting ───────────────────────────────────────────────────── */

export function formatTimeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const seconds = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
