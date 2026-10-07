/**
 * GET /api/admin/artists/export?key=…[,format=csv]
 *
 * Downloads every artist lead collected by the Bihar Got Talent registration
 * form as a CSV (opens directly in Google Sheets / Excel).
 *
 * Guarded by the `NOTIFY_ADMIN_KEY` env var — pass its value as `?key=…`.
 * When the var is not set on the project the route is disabled entirely.
 *
 * Sample:   /api/admin/artists/export?key=your_secret
 *           /api/admin/artists/export?key=your_secret&format=csv
 */

import { listArtists } from "../../../_lib/store.js";

const HEADERS = [
  ["timestamp", "Registered At"],
  ["fullName", "Name"],
  ["email", "Email"],
  ["phone", "Phone"],
  ["genre", "Category"],
  ["city", "City"],
  ["portfolio", "Portfolio Link"],
  ["bio", "Bio"],
];

function csvCell(value) {
  let s = String(value ?? "")
    .replace(/\u0000/g, "")
    .replace(/\r?\n/g, " ")
    .trim();
  // Formula injection guard — "=", "+", "-", "@" cells load as text with a
  // leading apostrophe so sheets never evaluate them as formulas.
  if (/^[=+\-@]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export async function onRequestGet({ request, env }) {
  if (!env || !env.NOTIFY_ADMIN_KEY) {
    return Response.json(
      { ok: false, message: 'Export is disabled — set NOTIFY_ADMIN_KEY on the project.' },
      { status: 503 }
    );
  }

  const url = new URL(request.url);
  if (url.searchParams.get("key") !== env.NOTIFY_ADMIN_KEY) {
    return Response.json({ ok: false, message: "Invalid admin key." }, { status: 403 });
  }

  const format = (url.searchParams.get("format") || "csv").toLowerCase();
  if (format !== "csv") {
    return Response.json(
      { ok: false, message: "Only format=csv is supported." },
      { status: 400 }
    );
  }

  const artists = await listArtists(env);
  artists.sort(
    (a, b) => new Date(b.registeredAt ?? 0).getTime() - new Date(a.registeredAt ?? 0).getTime()
  );

  const rows = [HEADERS.map(([, label]) => csvCell(label))];
  for (const artist of artists) {
    rows.push(HEADERS.map(([key]) => csvCell(artist[key])));
  }
  const csv = rows.map((row) => row.join(",")).join("\r\n");

  const date = new Date().toISOString().slice(0, 10);
  return new Response(`\uFEFF${csv}`, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="artist-registrations-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}