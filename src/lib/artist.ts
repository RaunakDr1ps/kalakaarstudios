/**
 * Shared contract for the "Bihar Got Talent" artist registration flow.
 *
 * The site is a static export served by Cloudflare Pages, so the server side
 * of this contract lives in `functions/api/*` (Pages Functions), not in Next
 * route handlers. Everything here is client-safe: it only talks to those
 * endpoints over same-origin fetches.
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

/* ─── Registration API ─────────────────────────────────────────────── */

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
