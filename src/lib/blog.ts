export const CRM_API_URL =
  process.env.NEXT_PUBLIC_CRM_API_URL ?? "https://crm.kalakaarstudios.co.in/api";

export type BlogStatus = "pending" | "published" | "rejected";

export type Blog = {
  id: string;
  title: string;
  author_name: string;
  /** Canonical cover URL. `normalizeBlog` folds every historical field name
   *  (`coverImage`, `cover_image`, `cover_image_url`, `image`) into this one,
   *  defaulting to an empty string when none is present. */
  coverImage: string;
  /** Raw alias fields the CRM has historically returned, kept as-is for
   *  debugging/pass-through. Prefer `coverImage` in the UI. */
  cover_image_url?: string | null;
  cover_image?: string | null;
  image?: string | null;
  body: string;
  backlink_url: string | null;
  meta_description: string;
  status: BlogStatus;
  created_at: string;
  /** Read counter. May be absent until the CRM reports it — treat as 0. */
  views?: number;
};

function firstCover(...candidates: Array<string | null | undefined>): string {
  const found = candidates.find(
    (c): c is string => typeof c === "string" && c.trim().length > 0
  );
  return found ? found.trim() : "";
}

/** Resolve a post's cover URL. `coverImage` is already canonical, but this
 *  also falls back to the raw per-post alias fields for safety. */
export function getCoverUrl(
  post: Pick<Blog, "coverImage"> &
    Partial<Pick<Blog, "cover_image_url" | "cover_image" | "image">>
): string {
  return firstCover(
    post.coverImage,
    post.cover_image_url,
    post.cover_image,
    post.image
  );
}

export type BlogUpdate = {
  title?: string;
  coverImage?: string;
  cover_image?: string;
  cover_image_url?: string | null;
  excerpt?: string;
  content?: string;
  body?: string;
  meta_description?: string;
  backlink_url?: string | null;
  status?: BlogStatus;
};

export type BlogSubmission = {
  title: string;
  author_name: string;
  cover_image_url?: string;
  body: string;
  meta_description: string;
  backlink_url?: string;
};

/**
 * Shape the CRM actually returns. The backend historically used several
 * different cover field names (`cover_image`, `coverImage`,
 * `cover_image_url`) and counters (`views`, `view_count`), so every fetch is
 * normalized through `normalizeBlog` before it reaches the UI.
 */
type RawBlog = {
  id: string;
  title: string;
  author_name: string;
  cover_image_url?: string | null;
  cover_image?: string | null;
  coverImage?: string | null;
  image?: string | null;
  body: string;
  backlink_url?: string | null;
  meta_description?: string;
  status?: BlogStatus;
  created_at?: string;
  views?: number;
  view_count?: number;
};

function normalizeBlog(raw: RawBlog): Blog {
  return {
    id: raw.id,
    title: raw.title,
    author_name: raw.author_name,
    coverImage:
      firstCover(
        raw.coverImage,
        raw.cover_image,
        raw.cover_image_url,
        raw.image
      ) || "",
    cover_image_url: raw.cover_image_url ?? null,
    cover_image: raw.cover_image ?? null,
    image: raw.image ?? null,
    body: raw.body,
    backlink_url: raw.backlink_url ?? null,
    meta_description: raw.meta_description ?? "",
    status: raw.status ?? "pending",
    created_at: raw.created_at ?? new Date().toISOString(),
    views: raw.views ?? raw.view_count ?? 0,
  };
}

async function crmFetch<T>(path: string, init?: RequestInit): Promise<T> {
  // No `cache: "no-store"`: with `output: export`, a no-store fetch is
  // treated as revalidate:0 and cannot be rendered statically. Cloudflare
  // Pages builds from a fresh checkout, so this build-time fetch always
  // reflects the current database values.
  const res = await fetch(`${CRM_API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const body = (await res.json()) as {
        message?: string;
        error?: string;
      };
      detail = body?.message ?? body?.error ?? detail;
    } catch {
      // non-JSON error body; fall back to the status text
    }
    // Log the exact status so empty/failed static builds are diagnosable.
    console.error(
      `[blog] CRM ${init?.method?.toUpperCase() ?? "GET"} ${path} → status ${res.status}: ${detail}`
    );
    throw new Error(detail);
  }

  return res.json() as Promise<T>;
}

export async function fetchPublishedBlogs(): Promise<Blog[]> {
  try {
    const rows = await crmFetch<RawBlog[]>("/blogs?status=published");
    if (!Array.isArray(rows)) {
      console.error(
        "[blog] CRM /blogs?status=published returned a non-array payload"
      );
      return [];
    }
    if (rows.length === 0 && typeof window === "undefined") {
      // Log lightweight warning during builds: a static export with zero
      // posts will show the empty state but the client feed refreshes it.
      console.warn(
        "[blog] CRM returned 0 published posts — static /blog output may be empty"
      );
    }
    return rows.map(normalizeBlog);
  } catch (err) {
    // Degrade gracefully during static builds / when the API is down.
    console.error(
      `[blog] Failed to fetch published posts: ${
        err instanceof Error ? err.message : "unknown error"
      }`
    );
    return [];
  }
}

export async function fetchPublishedBlog(id: string): Promise<Blog | null> {
  try {
    const raw = await crmFetch<RawBlog>(`/blogs/${encodeURIComponent(id)}`);
    return raw ? normalizeBlog(raw) : null;
  } catch (err) {
    console.error(
      `[blog] Failed to fetch post ${id}: ${
        err instanceof Error ? err.message : "unknown error"
      }`
    );
    return null;
  }
}

export async function fetchPendingBlogs(): Promise<Blog[]> {
  const rows = await crmFetch<RawBlog[]>("/blogs?status=pending");
  return Array.isArray(rows) ? rows.map(normalizeBlog) : [];
}

export async function submitBlog(input: BlogSubmission): Promise<Blog> {
  const raw = await crmFetch<RawBlog>("/blogs/submit", {
    method: "POST",
    body: JSON.stringify({
      title: input.title,
      author_name: input.author_name,
      cover_image_url: input.cover_image_url?.trim() || null,
      body: input.body,
      backlink_url: input.backlink_url?.trim() || null,
      meta_description: input.meta_description,
      status: "pending",
    }),
  });
  return normalizeBlog(raw);
}

export async function moderateBlog(opts: {
  id: string;
  status: BlogStatus;
  metaDescription?: string;
  adminKey: string;
}): Promise<boolean> {
  // The CRM authenticates the moderator via the shared admin key.
  // Adjust the header/field name here if your API expects it differently.
  await crmFetch<{ ok?: boolean }>(`/blogs/${encodeURIComponent(opts.id)}`, {
    method: "PATCH",
    headers: { "x-admin-key": opts.adminKey },
    body: JSON.stringify({
      status: opts.status,
      meta_description: opts.metaDescription ?? undefined,
    }),
  });
  return true;
}

/** Increment a published post's view counter in the CRM backend. */
export async function incrementBlogViews(id: string): Promise<boolean> {
  try {
    await crmFetch<{ ok?: boolean }>(`/blogs/${encodeURIComponent(id)}/views`, {
      method: "POST",
      body: JSON.stringify({}),
    });
    return true;
  } catch {
    // Fire-and-forget: a failed view ping must never break the page.
    return false;
  }
}

/** Shared secret the CRM validates for blog writes. When an editor has no
 *  admin key stored in the session, updates authenticate with this value. */
export const DEFAULT_ADMIN_KEY = "kalakaar_super_secret_key_2026_xyz";

/** Cloudflare Pages deploy hook that rebuilds the live site after a DB
 *  change. Kept exactly as-is: Cloudflare webhooks reject requests that
 *  carry unsupported headers, so the POST body and headers stay empty. */
export const CLOUDFLARE_DEPLOY_HOOK_URL =
  process.env.NEXT_PUBLIC_CLOUDFLARE_DEPLOY_HOOK_URL ??
  "https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/3baf262e-475c-4c5b-98d4-1155ff5bae59";

/** Save content edits on an existing post back to the CRM backend.
 *  PATCHes {NEXT_PUBLIC_CRM_API_URL}/blogs/:id with the `x-admin-key` header
 *  set to the known admin secret (fallback to any key stored in the session).
 *  Throws (with the HTTP status in the message) on any non-2xx response. */
export async function updateBlog(opts: {
  id: string;
  patch: BlogUpdate;
  adminKey?: string;
}): Promise<boolean> {
  const adminKey = DEFAULT_ADMIN_KEY || opts.adminKey;
  await crmFetch<{ ok?: boolean }>(`/blogs/${encodeURIComponent(opts.id)}`, {
    method: "PATCH",
    headers: { "x-admin-key": adminKey },
    body: JSON.stringify(opts.patch),
  });
  return true;
}

/**
 * Upload an image to Supabase Storage (bucket `blog-images`) through the CRM
 * backend upload API and return the public HTTP URL to embed as the cover.
 * The backend owns the Supabase credentials; it stores the file and hands
 * back the public URL. Expected contract: POST {CRM_API_URL}/blogs/upload
 * with multipart field "file" -> { url: "https://…/blog-images/…" }.
 */
export async function uploadBlogImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${CRM_API_URL}/blogs/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const body = (await res.json()) as {
        message?: string;
        error?: string;
      };
      detail = body?.message ?? body?.error ?? detail;
    } catch {
      // non-JSON error body; fall back to the status text
    }
    throw new Error(detail);
  }

  const data = (await res.json()) as {
    url?: string;
    public_url?: string;
    path?: string;
  };
  const candidate = data.url ?? data.public_url ?? data.path ?? "";
  if (/^https?:\/\//i.test(candidate.trim())) return candidate.trim();
  throw new Error("Image upload didn't return a public URL.");
}

/** Trigger a Cloudflare Pages rebuild so edits go live.
 *  Sends a bare empty POST (no auth / Content-Type headers — Cloudflare
 *  webhooks fail on unnecessary headers). Only HTTP 200/202 counts as
 *  success; any other status or network error is caught gracefully and falls
 *  back to the CRM `/blogs/rebuild` endpoint. Never throws. */
export async function triggerDeployWebhook(): Promise<boolean> {
  try {
    const res = await fetch(CLOUDFLARE_DEPLOY_HOOK_URL, { method: "POST" });
    if (res.status === 200 || res.status === 202) return true;
  } catch {
    // network hiccup — fall through to the CRM rebuild endpoint below
  }

  const adminKey = getStoredAdminKey() || DEFAULT_ADMIN_KEY;
  try {
    await crmFetch<{ ok?: boolean }>("/blogs/rebuild", {
      method: "POST",
      headers: { "x-admin-key": adminKey },
    });
    return true;
  } catch {
    return false;
  }
}

export const ADMIN_SESSION_KEY = "ks-blog-admin-key";

/** Read the admin key the editor stored when unlocking the panel. */
export function getStoredAdminKey(): string {
  if (typeof window === "undefined") return "";
  return window.sessionStorage.getItem(ADMIN_SESSION_KEY) ?? "";
}

export function excerpt(body: string, length = 160): string {
  const cleaned = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*`~\[\]()!-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (cleaned.length <= length) return cleaned;
  return `${cleaned.slice(0, length).trimEnd()}…`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}