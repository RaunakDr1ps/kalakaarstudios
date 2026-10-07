/**
 * Outbound email for artist registrations, sent through the Resend HTTP API.
 *
 * Resend is used rather than Nodemailer because Pages Functions run in the
 * Workers runtime, which has no raw SMTP sockets — the HTTP API works from
 * any runtime and needs only `RESEND_API_KEY`.
 *
 * Environment (set on the Cloudflare Pages project, not in .env.local):
 *   RESEND_API_KEY  – required to actually send; without it every call
 *                     returns { sent: false, reason: "not_configured" } and
 *                     the registration still succeeds.
 *   RESEND_FROM     – verified sender, e.g. "Kalakaar Studios <hello@kalakaarstudios.co.in>"
 *   ARTIST_INBOX    – studio address that receives the per-registration alert
 */

const YELLOW = "#F2EE07";
const BLACK = "#000000";
const WHITE = "#FFFFFF";

function shell({ preheader, title, body }) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:${BLACK};font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BLACK};padding:24px 12px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${WHITE};border:2px solid ${BLACK};">
          <tr>
            <td style="background:${YELLOW};padding:16px 24px;border-bottom:2px solid ${BLACK};">
              <span style="font-size:13px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:${BLACK};">Kalakaar Studios</span>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 24px;">
              <h1 style="margin:0 0 16px;font-size:22px;line-height:1.25;text-transform:uppercase;color:${BLACK};">${title}</h1>
              ${body}
            </td>
          </tr>
          <tr>
            <td style="background:${BLACK};padding:16px 24px;">
              <p style="margin:0;font-size:12px;line-height:1.6;color:${WHITE};">
                Kalakaar Studios &middot; Bhub, Maurya Lok, Block A, Fifth Floor, Patna, Bihar<br/>
                You are receiving this because you registered for Bihar Got Talent.
              </p>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

const paragraph = (text) =>
  `<p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:#111827;">${text}</p>`;

const button = (href, label) =>
  `<p style="margin:22px 0 6px;">
     <a href="${href}" style="display:inline-block;background:${YELLOW};border:2px solid ${BLACK};padding:12px 22px;font-size:14px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;color:${BLACK};text-decoration:none;">${label}</a>
   </p>`;

const list = (items) =>
  `<ul style="margin:0 0 14px;padding-left:20px;font-size:15px;line-height:1.75;color:#111827;">${items
    .map((i) => `<li>${i}</li>`)
    .join("")}</ul>`;

export function welcomeEmailHtml(artist) {
  return shell({
    preheader: "Welcome to the Kalakaar Studios Artist Network — Bihar Got Talent auditions.",
    title: "Welcome to the Kalakaar Studios Artist Network",
    body:
      paragraph(`Hi ${artist.fullName},`) +
      paragraph(
        `Your registration for <strong>Bihar Got Talent — Perform, Partner &amp; Showcase</strong> is confirmed. You are now on the Kalakaar Studios Artist Network roster.`
      ) +
      list([
        `<strong>Category:</strong> ${artist.genre}`,
        `<strong>City:</strong> ${artist.city}`,
        `<strong>Registration ID:</strong> ${artist.id}`,
        `<strong>Registered:</strong> ${new Date(artist.registeredAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`,
      ]) +
      paragraph("Here's what happens next:") +
      list([
        "Our curators shortlist entries against the audition slate.",
        "If you're shortlisted, our team reaches out on the phone number and email you registered with.",
        "Shortlisted performers move to the live showcase round.",
      ]) +
      button("https://kalakaarstudios.co.in/events/bihar-got-talent", "About Bihar Got Talent") +
      paragraph(
        `Keep building your profile — reply with an updated portfolio link any time at Kalakaarstudios@ssociopro.com.`
      ),
  });
}

export function studioAlertHtml(artist) {
  return shell({
    preheader: `New Bihar Got Talent registration from ${artist.fullName} (${artist.city}).`,
    title: "New artist registration",
    body:
      paragraph(
        `<strong>${artist.fullName}</strong> just joined the roster for <strong>Bihar Got Talent</strong>.`
      ) +
      list([
        `<strong>Email:</strong> ${artist.email}`,
        `<strong>Phone (WhatsApp):</strong> ${artist.phone}`,
        `<strong>Category:</strong> ${artist.genre}`,
        `<strong>City:</strong> ${artist.city}`,
        `<strong>Portfolio:</strong> ${artist.portfolio || "—"}`,
        `<strong>Registration ID:</strong> ${artist.id}`,
      ]) +
      paragraph(`<strong>Bio / past achievements</strong><br/>${artist.bio}`) +
      paragraph("Review and shortlist at your end — the artist expects a call or email if they make the cut."),
  });
}

async function sendOne(env, { from, to, subject, html, replyTo }) {
  const key = env.RESEND_API_KEY;
  if (!key) return { sent: false, reason: "not_configured" };

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return { sent: false, reason: `resend_${res.status}: ${detail.slice(0, 200)}` };
    }
    return { sent: true };
  } catch (err) {
    return { sent: false, reason: `network: ${err instanceof Error ? err.message : "unknown"}` };
  }
}

/**
 * Sends the artist-facing welcome mail and the studio alert in parallel.
 * Never throws: a mail failure is reported, not raised, because the
 * registration itself has already been stored.
 */
export async function sendRegistrationEmails(env, artist) {
  const from = env.RESEND_FROM || "Kalakaar Studios <onboarding@resend.dev>";
  const inbox = env.ARTIST_INBOX || "Kalakaarstudios@ssociopro.com";

  const [artistResult, studioResult] = await Promise.all([
    sendOne(env, {
      from,
      to: artist.email,
      subject: "Welcome to Kalakaar Studios Artist Network — Bihar Got Talent Auditions",
      html: welcomeEmailHtml(artist),
      replyTo: inbox,
    }),
    sendOne(env, {
      from,
      to: inbox,
      subject: `New Bihar Got Talent registration — ${artist.fullName} (${artist.city})`,
      html: studioAlertHtml(artist),
      replyTo: artist.email,
    }),
  ]);

  if (!artistResult.sent) {
    console.warn(`[artist-registration] welcome email not sent: ${artistResult.reason}`);
  }
  if (!studioResult.sent) {
    console.warn(`[artist-registration] studio alert not sent: ${studioResult.reason}`);
  }

  return { sent: artistResult.sent, artistResult, studioResult };
}
