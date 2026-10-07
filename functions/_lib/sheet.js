/**
 * Pushes a registration row to the team's Google Sheet.
 *
 * Setup in Google Sheets → Extensions → Apps Script:
 *   1. Create a script with `doPost(e)` that reads
 *      `JSON.parse(e.postData.contents)` and writes the row to the sheet.
 *   2. Deploy → New deployment → Web app → "Anyone" → copy the web URL.
 *   3. Set that URL as the `GOOGLE_SHEET_WEBHOOK_URL` env var on the
 *      Cloudflare Pages project.
 *
 * The POST is best-effort: a sheet hiccup must never fail a registration.
 * When the env var is missing, the call is skipped silently (only the KV
 * store + admin CSV export remain active).
 *
 * Environment (Cloudflare Pages, not .env.local):
 *   GOOGLE_SHEET_WEBHOOK_URL     — required to push rows
 *   GOOGLE_SHEET_WEBHOOK_SECRET  — optional; forwarded as `x-webhook-secret`
 *                                  so the Apps Script can reject strangers
 */

export async function pushRowToSheet(env, artist) {
  const url = env && env.GOOGLE_SHEET_WEBHOOK_URL;
  if (!url || typeof url !== "string" || !/^https:\/\//.test(url)) return;

  const headers = { "Content-Type": "application/json" };
  if (env.GOOGLE_SHEET_WEBHOOK_SECRET) {
    headers["x-webhook-secret"] = String(env.GOOGLE_SHEET_WEBHOOK_SECRET);
  }

  const row = {
    id: artist.id,
    fullName: artist.fullName,
    email: artist.email,
    phone: artist.phone,
    genre: artist.genre,
    city: artist.city,
    portfolio: artist.portfolio,
    bio: artist.bio,
    status: artist.status,
    source: artist.source,
    timestamp: artist.registeredAt,
  };

  try {
    const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(row) });
    if (!res.ok) {
      console.error(
        `[artist-registration] sheet webhook responded ${res.status}: ${await res.text()}`
      );
    }
  } catch (err) {
    console.error(
      `[artist-registration] sheet webhook failed: ${err instanceof Error ? err.message : "unknown"}`
    );
  }
}