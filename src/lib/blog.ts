const CRM_API_URL =
  process.env.NEXT_PUBLIC_CRM_API_URL ?? "https://crm.kalakaarstudios.co.in/api";

export type BlogStatus = "pending" | "published" | "rejected";

export type Blog = {
  id: string;
  title: string;
  author_name: string;
  cover_image_url: string | null;
  body: string;
  backlink_url: string | null;
  meta_description: string;
  status: BlogStatus;
  created_at: string;
  /** Read counter. May be absent until the CRM reports it — treat as 0. */
  views?: number;
};

export type BlogUpdate = {
  title?: string;
  cover_image_url?: string | null;
  body?: string;
  meta_description?: string;
  backlink_url?: string | null;
};

export type BlogSubmission = {
  title: string;
  author_name: string;
  cover_image_url?: string;
  body: string;
  meta_description: string;
  backlink_url?: string;
};

async function crmFetch<T>(path: string, init?: RequestInit): Promise<T> {
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
    throw new Error(detail);
  }

  return res.json() as Promise<T>;
}

export async function fetchPublishedBlogs(): Promise<Blog[]> {
  try {
    const rows = await crmFetch<Blog[]>("/blogs?status=published");
    return Array.isArray(rows) ? rows : [];
  } catch {
    // Degrade gracefully during static builds / when the API is down.
    return [];
  }
}

export async function fetchPublishedBlog(id: string): Promise<Blog | null> {
  try {
    return await crmFetch<Blog>(`/blogs/${encodeURIComponent(id)}`);
  } catch {
    return null;
  }
}

export async function fetchPendingBlogs(): Promise<Blog[]> {
  const rows = await crmFetch<Blog[]>("/blogs?status=pending");
  return Array.isArray(rows) ? rows : [];
}

export async function submitBlog(input: BlogSubmission): Promise<Blog> {
  return crmFetch<Blog>("/blogs/submit", {
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

/** Save content edits on an existing post back to the CRM backend. */
export async function updateBlog(opts: {
  id: string;
  patch: BlogUpdate;
  adminKey: string;
}): Promise<boolean> {
  await crmFetch<{ ok?: boolean }>(`/blogs/${encodeURIComponent(opts.id)}`, {
    method: "PATCH",
    headers: { "x-admin-key": opts.adminKey },
    body: JSON.stringify(opts.patch),
  });
  return true;
}

/** Trigger a Cloudflare rebuild so edits go live.
 *  Prefers the direct deploy hook; when that isn't configured on this
 *  client, it asks the CRM backend to run the rebuild instead. */
export async function triggerDeployWebhook(): Promise<boolean> {
  const url = process.env.NEXT_PUBLIC_CLOUDFLARE_DEPLOY_HOOK_URL;
  if (url) {
    try {
      await fetch(url, { method: "POST" });
      return true;
    } catch {
      // fall through to the CRM rebuild endpoint below
    }
  }

  const adminKey = getStoredAdminKey();
  try {
    await crmFetch<{ ok?: boolean }>("/blogs/rebuild", {
      method: "POST",
      headers: adminKey ? { "x-admin-key": adminKey } : undefined,
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