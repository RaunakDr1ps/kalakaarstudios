/**
 * /api/notifications — the on-site Notification Center's read/write API.
 *
 *   GET  /api/notifications?email=…      → { notifications, unread }
 *   POST { action: "mark-read", email, id }
 *   POST { action: "mark-all-read", email }
 *   POST { action: "broadcast", title, body, link?, adminKey? }
 *
 * A broadcast fans a single announcement out to every registered artist, so
 * it is gated on the optional `NOTIFY_ADMIN_KEY` Pages environment variable —
 * if that variable is unset the action is refused entirely rather than left
 * open to the public.
 */

import {
  normalizeEmail,
  isValidEmail,
  newId,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  notifyAllArtists,
} from "../_lib/store.js";

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const email = normalizeEmail(url.searchParams.get("email"));
  if (!isValidEmail(email)) {
    return Response.json(
      { ok: false, message: "A valid email query parameter is required." },
      { status: 400 }
    );
  }

  const notifications = await getNotifications(env, email);
  const unread = notifications.filter((n) => !n.read).length;
  return Response.json({ ok: true, notifications, unread });
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

  const action = String(payload?.action ?? "");
  const email = normalizeEmail(payload?.email);

  if (action === "mark-read") {
    if (!isValidEmail(email) || typeof payload.id !== "string") {
      return Response.json(
        { ok: false, message: "email and id are required." },
        { status: 400 }
      );
    }
    const notifications = await markNotificationRead(env, email, payload.id);
    const unread = notifications.filter((n) => !n.read).length;
    return Response.json({ ok: true, notifications, unread });
  }

  if (action === "mark-all-read") {
    if (!isValidEmail(email)) {
      return Response.json(
        { ok: false, message: "email is required." },
        { status: 400 }
      );
    }
    const notifications = await markAllNotificationsRead(env, email);
    return Response.json({ ok: true, notifications, unread: 0 });
  }

  if (action === "broadcast") {
    const key = env.NOTIFY_ADMIN_KEY;
    if (!key) {
      return Response.json(
        { ok: false, message: "Broadcasting is disabled (NOTIFY_ADMIN_KEY unset)." },
        { status: 503 }
      );
    }
    if (payload.adminKey !== key) {
      return Response.json({ ok: false, message: "Invalid admin key." }, { status: 403 });
    }

    const title = String(payload.title ?? "").trim();
    const body = String(payload.body ?? "").trim();
    if (!title || title.length > 120 || !body || body.length > 600) {
      return Response.json(
        { ok: false, message: "title (≤120) and body (≤600) are required." },
        { status: 400 }
      );
    }

    const recipients = await notifyAllArtists(env, {
      id: newId(),
      type: String(payload.type ?? "announcement").slice(0, 40),
      title,
      body,
      link: typeof payload.link === "string" ? payload.link.slice(0, 200) : undefined,
      read: false,
      createdAt: new Date().toISOString(),
    });

    return Response.json({ ok: true, recipients }, { status: 201 });
  }

  return Response.json(
    { ok: false, message: "Unknown action. Use mark-read, mark-all-read, or broadcast." },
    { status: 400 }
  );
}
