/**
 * Regenerates `src/data/blog-fallback.ts` from the live CRM API.
 *
 * The CRM hardcodes a single `Access-Control-Allow-Origin`, so the browser
 * blocks every request to it from localhost and from preview deploys. This
 * snapshot is what keeps the moderation dashboard usable there. Run it after a
 * post is published:
 *
 *   node scripts/sync-blog-fallback.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const API = process.env.NEXT_PUBLIC_CRM_API_URL ?? "https://crm.kalakaarstudios.co.in/api";
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "../src/data/blog-fallback.ts");

const res = await fetch(`${API}/blogs`);
if (!res.ok) throw new Error(`CRM /blogs responded ${res.status}`);

const rows = await res.json();
if (!Array.isArray(rows)) throw new Error("CRM /blogs did not return an array");

const posts = rows
  .filter((row) => String(row.status ?? "").toLowerCase() === "published")
  .map((row) => ({
    id: row.id,
    title: row.title,
    author_name: row.author_name,
    coverImage: row.cover_image_url ?? row.cover_image ?? row.coverImage ?? row.image ?? "",
    cover_image_url: row.cover_image_url ?? null,
    cover_image: null,
    image: null,
    body: row.body,
    backlink_url: row.backlink_url ?? null,
    meta_description: row.meta_description ?? "",
    status: "published",
    created_at: row.created_at,
    views: 0,
  }))
  .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));

const header = `/**
 * Last-known-good snapshot of the published posts, captured from the CRM API.
 *
 * The CRM hardcodes a single \`Access-Control-Allow-Origin\`, so this module is
 * what keeps the moderation dashboard useful on localhost, on Cloudflare
 * preview deploys, and on \`www.\` — every browser request there is blocked by
 * CORS and the live endpoint is unreachable. Regenerate with:
 *
 *   node scripts/sync-blog-fallback.mjs
 *
 * Do not edit by hand; the dashboard falls back to this when the network is
 * unavailable, so \`Published & Analytics\` never reads 0 posts.
 *
 * NOTE: \`views\` is always 0 because the CRM list payload carries no counter.
 */
import type { Blog } from "@/lib/blog";

export const FALLBACK_PUBLISHED_POSTS: Blog[] = ${JSON.stringify(posts, null, 2)};

export const FALLBACK_SNAPSHOT_AT = ${JSON.stringify(new Date().toISOString())};
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, header, "utf8");

console.log(`Wrote ${posts.length} published post(s) to src/data/blog-fallback.ts`);
for (const post of posts) console.log(`  ${post.id}  ${post.title}`);
