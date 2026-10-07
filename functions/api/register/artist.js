/**
 * POST /api/register/artist — Bihar Got Talent artist registration.
 *
 * Validates the payload, refuses duplicate email/phone entries, stores the
 * artist on the roster (source tagged "Bihar Got Talent"), inserts the
 * Notification Center records, mirrors the row to the CRM when
 * `ARTIST_CRM_URL` is configured, and fires the Resend confirmation mail.
 *
 * Runs as a Cloudflare Pages Function (the site is a static export, so Next
 * route handlers cannot serve dynamic POSTs here).
 */

import {
  normalizeEmail,
  normalizePhone,
  isValidEmail,
  newId,
  findConflictingArtist,
  saveArtist,
  addNotifications,
} from "../../_lib/store.js";
import { sendRegistrationEmails } from "../../_lib/email.js";

const SOURCE = "Bihar Got Talent";

const GENRES = [
  "Music / Singing",
  "Dance",
  "Comedy",
  "Acting / Theatre",
  "Visual Art",
  "Poetry / Storytelling",
  "Other",
];

const badRequest = (errors) =>
  Response.json({ ok: false, errors }, { status: 400 });

function validate(payload) {
  const errors = {};

  const fullName = String(payload.fullName ?? "").trim();
  if (fullName.length < 2 || fullName.length > 80) {
    errors.fullName = "Enter your full name (2–80 characters).";
  }

  const email = normalizeEmail(payload.email);
  if (!isValidEmail(email)) {
    errors.email = "Enter a valid email address.";
  }

  const phone = normalizePhone(payload.phone);
  if (phone.length < 10 || phone.length > 15) {
    errors.phone = "Enter a valid 10-digit mobile number.";
  }

  const genre = String(payload.genre ?? "").trim();
  if (!GENRES.includes(genre)) {
    errors.genre = "Pick one of the listed categories.";
  }

  const city = String(payload.city ?? "").trim();
  if (city.length < 2 || city.length > 60) {
    errors.city = "Enter your city (2–60 characters).";
  }

  const portfolio = String(payload.portfolio ?? "").trim();
  if (portfolio && !/^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(portfolio)) {
    errors.portfolio = "Portfolio must be a full link starting with https://";
  }
  if (portfolio.length > 300) {
    errors.portfolio = "Portfolio link is too long.";
  }

  const bio = String(payload.bio ?? "").trim();
  if (bio.length < 20 || bio.length > 1000) {
    errors.bio = "Bio should be 20–1000 characters.";
  }

  if (payload.consent !== true) {
    errors.consent = "Consent is required to receive audition updates.";
  }

  return {
    errors,
    value: { fullName, email, phone, genre, city, portfolio, bio },
  };
}

/** Best-effort CRM mirror — a CRM hiccup must never fail a registration. */
async function mirrorToCrm(env, artist) {
  if (!env.ARTIST_CRM_URL) return;
  try {
    const headers = { "Content-Type": "application/json" };
    if (env.CRM_ADMIN_KEY) headers["x-admin-key"] = env.CRM_ADMIN_KEY;
    await fetch(env.ARTIST_CRM_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(artist),
    });
  } catch (err) {
    console.error(
      `[artist-registration] CRM mirror failed: ${err instanceof Error ? err.message : "unknown"}`
    );
  }
}

export async function onRequestPost({ request, env }) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return Response.json(
      { ok: false, message: "Request body must be JSON." },
      { status: 400 }
    );
  }
  if (!payload || typeof payload !== "object") {
    return Response.json(
      { ok: false, message: "Request body must be a JSON object." },
      { status: 400 }
    );
  }

  // Honeypot: real visitors never see this field. Answer with a normal
  // success so bots cannot tell they were filtered out.
  if (typeof payload.company === "string" && payload.company.trim() !== "") {
    return Response.json({ ok: true, honeypot: true, artistId: null }, { status: 201 });
  }

  // The client may tag a different source later; default to this campaign.
  const source =
    typeof payload.source === "string" && payload.source.trim()
      ? payload.source.trim().slice(0, 60)
      : SOURCE;

  const { errors, value } = validate(payload);
  if (Object.keys(errors).length > 0) return badRequest(errors);

  const conflict = await findConflictingArtist(env, {
    email: value.email,
    phone: value.phone,
  });
  if (conflict) {
    return Response.json(
      {
        ok: false,
        duplicate: conflict,
        message:
          conflict === "email"
            ? "This email is already registered for Bihar Got Talent. Check your inbox and the Notification Center for updates."
            : "This phone number is already registered for Bihar Got Talent. Use your registered email to see updates.",
      },
      { status: 409 }
    );
  }

  const artist = {
    id: newId(),
    ...value,
    source,
    status: "registered",
    registeredAt: new Date().toISOString(),
  };

  await saveArtist(env, artist);

  // Notification Center records created alongside the registration.
  await addNotifications(env, artist.email, [
    {
      id: newId(),
      type: "audition_updates",
      title: "Audition updates for Bihar Got Talent",
      body: "Shortlisting is underway. Your audition slot, venue and call time will appear here and land in your inbox — keep the bell handy.",
      link: "/events/bihar-got-talent",
      read: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: newId(),
      type: "registration_confirmed",
      title: "Registration confirmed — Bihar Got Talent",
      body: `Welcome to the Kalakaar Studios Artist Network, ${artist.fullName}. Your entry under ${artist.genre} from ${artist.city} is on the roster.`,
      link: "/notifications",
      read: false,
      createdAt: new Date().toISOString(),
    },
  ]);

  await mirrorToCrm(env, artist);
  const emailResult = await sendRegistrationEmails(env, artist);

  return Response.json(
    {
      ok: true,
      artistId: artist.id,
      emailSent: emailResult.sent,
      notifications: 2,
    },
    { status: 201 }
  );
}

/** GET /api/register/artist?email=… → duplicate check helper for the form. */
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const email = normalizeEmail(url.searchParams.get("email"));
  if (!isValidEmail(email)) {
    return Response.json(
      { ok: false, message: "A valid email query parameter is required." },
      { status: 400 }
    );
  }
  const conflict = await findConflictingArtist(env, { email, phone: "" });
  return Response.json({ ok: true, registered: Boolean(conflict) });
}
