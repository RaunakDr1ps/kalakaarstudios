import {
  FALLBACK_PUBLISHED_POSTS,
  FALLBACK_SNAPSHOT_AT,
} from "@/data/blog-fallback";
import {
  fetchAllBlogs,
  fetchPublishedBlogsStrict,
  splitByStatus,
  type Blog,
} from "@/lib/blog";

export type DashboardDataSource = "live" | "cached" | "unavailable";

export type DashboardBlogsResult = {
  /** Every post we could obtain, whatever the source. */
  posts: Blog[];
  source: DashboardDataSource;
  /** Human-readable explanation, set whenever `source` is not `"live"`. */
  notice?: string;
};

function describe(err: unknown): string {
  return err instanceof Error ? err.message : "unknown error";
}

function snapshotAge(): string {
  const captured = new Date(FALLBACK_SNAPSHOT_AT);
  if (Number.isNaN(captured.getTime())) return "an earlier capture";
  return captured.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/**
 * Loads posts for the moderation dashboard without ever rejecting.
 *
 * Three tiers, because the CRM answers every request with a hardcoded
 * `Access-Control-Allow-Origin: https://kalakaarstudios.co.in`. From localhost,
 * `www.`, or a Cloudflare preview URL the browser blocks the response outright,
 * which surfaces as `TypeError: Failed to fetch` no matter which endpoint is
 * called — so falling back to "another published endpoint" alone cannot help.
 * The bundled snapshot is what actually fills the table:
 *
 *   1. the unfiltered listing, which includes the pending queue
 *   2. the published listing, in case only the unfiltered call is rejected
 *   3. the snapshot of published posts compiled into the bundle
 *
 * A tier that *answers* — even with zero rows — is authoritative and returned
 * as-is, so a CMS with everything deleted correctly shows the empty state
 * instead of resurrecting the snapshot. Only a tier that actually throws
 * advances to the next one, so stale posts can never overwrite live data.
 */
export async function fetchDashboardBlogs(): Promise<DashboardBlogsResult> {
  const failures: string[] = [];

  const tiers: Array<{ label: string; run: () => Promise<Blog[]> }> = [
    { label: "all-status listing", run: fetchAllBlogs },
    { label: "published listing", run: fetchPublishedBlogsStrict },
  ];

  for (const tier of tiers) {
    try {
      return { posts: await tier.run(), source: "live" };
    } catch (err) {
      failures.push(`${tier.label}: ${describe(err)}`);
    }
  }

  if (FALLBACK_PUBLISHED_POSTS.length > 0) {
    // The usual cause is no longer a blocked CORS preflight — the CRM allows
    // every origin now — but a session gate that redirects to /login. Name the
    // real reason instead of claiming the API is unreachable.
    const authBlocked = failures.some((line) =>
      /login|session/i.test(line)
    );
    return {
      posts: FALLBACK_PUBLISHED_POSTS,
      source: "cached",
      notice:
        (authBlocked
          ? `The CRM blog API needs an authenticated session, so this panel can't read live data. `
          : `The CRM blog API could not be reached. `) +
        `Showing the last snapshot from ${snapshotAge()}; the pending queue is empty until live access is restored. ` +
        `Cause: ${failures[0] ?? "unknown error"}`,
    };
  }

  return {
    posts: [],
    source: "unavailable",
    notice: `Could not load any posts. ${failures.join(" · ")}`,
  };
}

/** Convenience wrapper for the two dashboard tabs. */
export async function fetchDashboardTabs(): Promise<
  DashboardBlogsResult & { published: Blog[]; pending: Blog[] }
> {
  const result = await fetchDashboardBlogs();
  return { ...result, ...splitByStatus(result.posts) };
}
