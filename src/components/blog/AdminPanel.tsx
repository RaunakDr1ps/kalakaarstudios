"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  ExternalLink,
  Inbox,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import BlogDashboard from "@/components/blog/BlogDashboard";
import {
  ADMIN_SESSION_KEY,
  fetchPendingBlogs,
  getStoredAdminKey,
  moderateBlog,
  triggerDeployWebhook,
  type Blog,
} from "@/lib/blog";

const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY ?? "";

const inputCls =
  "mt-2 w-full border-2 border-ink bg-cream px-4 py-3 text-sm font-medium outline-none transition-shadow focus:shadow-[3px_3px_0px_0px_var(--color-ink)]";

type RowState = {
  saving: boolean;
  error: string | null;
  notice: string | null;
};

type Tab = "queue" | "published";

export default function AdminPanel() {
  const [unlocked, setUnlocked] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<Blog[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [rows, setRows] = useState<Record<string, RowState>>({});
  const [gateError, setGateError] = useState<string | null>(null);
  const [queueError, setQueueError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("queue");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = window.sessionStorage.getItem(ADMIN_SESSION_KEY);
      if (saved && saved === ADMIN_KEY) setUnlocked(true);
    }
  }, []);

  function handleUnlock(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!ADMIN_KEY) {
      setGateError(
        "NEXT_PUBLIC_ADMIN_KEY is not set. Add it to your environment."
      );
      return;
    }
    if (keyInput === ADMIN_KEY) {
      window.sessionStorage.setItem(ADMIN_SESSION_KEY, keyInput);
      setUnlocked(true);
      setGateError(null);
    } else {
      setGateError("That key doesn't match. Try again.");
    }
  }

  const loadPending = useCallback(async () => {
    setLoading(true);
    setQueueError(null);
    try {
      const pending = await fetchPendingBlogs();
      setPosts(pending);
      setDrafts(
        Object.fromEntries(pending.map((p) => [p.id, p.meta_description]))
      );
    } catch (err) {
      setQueueError(
        err instanceof Error ? err.message : "Failed to load the queue."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (unlocked) void loadPending();
  }, [unlocked, loadPending]);

  async function act(post: Blog, status: "published" | "rejected") {
    if (!ADMIN_KEY) {
      setGateError("NEXT_PUBLIC_ADMIN_KEY is not set in the environment.");
      return;
    }
    const adminKey = getStoredAdminKey();

    setRows((prev) => ({
      ...prev,
      [post.id]: { saving: true, error: null, notice: null },
    }));
    try {
      await moderateBlog({
        id: post.id,
        status,
        metaDescription: status === "published" ? drafts[post.id] : undefined,
        adminKey,
      });
      if (status === "published") await triggerDeployWebhook();
      await loadPending();
      setRows((prev) => ({
        ...prev,
        [post.id]: {
          saving: false,
          error: null,
          notice:
            status === "published"
              ? "Approved — live redeploy triggered."
              : "Rejected.",
        },
      }));
    } catch (err) {
      setRows((prev) => ({
        ...prev,
        [post.id]: {
          saving: false,
          error: err instanceof Error ? err.message : "Moderation failed.",
          notice: null,
        },
      }));
    }
  }

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-md border-2 border-ink bg-cream p-8 shadow-[8px_8px_0px_0px_var(--color-ink)]">
        <span className="flex h-14 w-14 -rotate-3 items-center justify-center border-2 border-ink bg-sun shadow-[4px_4px_0px_0px_var(--color-ink)]">
          <LockKeyhole className="h-6 w-6" strokeWidth={2.25} />
        </span>
        <h2 className="mt-6 font-blocky text-2xl font-bold uppercase tracking-tight">
          Editorial access
        </h2>
        <p className="mt-2 text-sm font-medium text-ink/60">
          Enter the shared admin key to open the blog admin panel.
        </p>

        <form onSubmit={handleUnlock} className="mt-6 space-y-4">
          {gateError && (
            <div className="border-2 border-ink bg-[#fecaca] px-4 py-3 text-sm font-bold">
              {gateError}
            </div>
          )}
          <div>
            <label
              htmlFor="admin-key"
              className="block text-xs font-bold uppercase tracking-widest"
            >
              Admin key
            </label>
            <input
              type="password"
              id="admin-key"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              className={inputCls}
            />
          </div>
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-ink bg-red px-6 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-[4px_4px_0px_0px_var(--color-ink)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_var(--color-ink)]"
          >
            <ShieldCheck className="h-4 w-4" strokeWidth={2.5} />
            Unlock
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="inline-flex flex-wrap items-center gap-1 border-2 border-ink bg-cream p-1.5 shadow-[3px_3px_0px_0px_var(--color-ink)]">
        <button
          type="button"
          onClick={() => setTab("queue")}
          className={`inline-flex items-center gap-2 border-2 px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all ${
            tab === "queue"
              ? "border-ink bg-sun shadow-[3px_3px_0px_0px_var(--color-ink)]"
              : "border-transparent text-ink/60 hover:text-ink"
          }`}
        >
          <Inbox className="h-3.5 w-3.5" strokeWidth={2.5} />
          Pending review
        </button>
        <button
          type="button"
          onClick={() => setTab("published")}
          className={`inline-flex items-center gap-2 border-2 px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all ${
            tab === "published"
              ? "border-ink bg-sun shadow-[3px_3px_0px_0px_var(--color-ink)]"
              : "border-transparent text-ink/60 hover:text-ink"
          }`}
        >
          <BarChart3 className="h-3.5 w-3.5" strokeWidth={2.5} />
          Published & analytics
        </button>
      </div>

      {tab === "published" ? (
        <BlogDashboard />
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-ink/50">
              {loading
                ? "Loading queue…"
                : `${posts.length} submission${posts.length === 1 ? "" : "s"} pending review`}
            </p>
            <button
              type="button"
              onClick={() => void loadPending()}
              className="inline-flex items-center gap-2 border-2 border-ink bg-sun px-4 py-2 text-xs font-bold uppercase tracking-wide shadow-[3px_3px_0px_0px_var(--color-ink)] transition-all hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_var(--color-ink)]"
            >
              <LoaderCircle
                className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
                strokeWidth={2.5}
              />
              Refresh
            </button>
          </div>

          {queueError && (
            <div className="border-2 border-ink bg-[#fecaca] px-4 py-3 text-sm font-bold">
              {queueError}
            </div>
          )}

          {!loading && posts.length === 0 && !queueError && (
            <div className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-ink py-16 text-center">
              <CheckCircle2 className="h-10 w-10 text-ink/30" strokeWidth={1.5} />
              <p className="font-blocky text-2xl font-bold uppercase tracking-tight">
                All caught up
              </p>
              <p className="max-w-sm text-sm font-medium text-ink/60">
                No posts waiting for review. New submissions appear here as
                they come in.
              </p>
            </div>
          )}

          {posts.map((post, i) => {
            const row = rows[post.id];
            return (
              <article
                key={post.id}
                className={`border-2 border-ink bg-cream p-6 shadow-[6px_6px_0px_0px_var(--color-ink)] sm:p-8 ${
                  i % 2 === 0 ? "rotate-[0.2deg]" : "-rotate-[0.2deg]"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="font-blocky text-xl font-bold uppercase tracking-tight sm:text-2xl">
                      {post.title}
                    </h2>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-ink/50">
                      By {post.author_name} ·{" "}
                      {new Date(post.created_at ?? Date.now()).toLocaleString(
                        "en-IN",
                        { dateStyle: "medium", timeStyle: "short" }
                      )}
                    </p>
                  </div>
                  <span className="inline-flex -rotate-1 items-center gap-1.5 border-2 border-ink bg-sun px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest shadow-[2px_2px_0px_0px_var(--color-ink)]">
                    {post.status}
                  </span>
                </div>

                <div className="mt-5 grid gap-5 lg:grid-cols-2">
                  <div>
                    <label
                      htmlFor={`meta-${post.id}`}
                      className="block text-xs font-bold uppercase tracking-widest"
                    >
                      Meta description
                    </label>
                    <textarea
                      id={`meta-${post.id}`}
                      rows={2}
                      value={drafts[post.id] ?? ""}
                      onChange={(e) =>
                        setDrafts((prev) => ({
                          ...prev,
                          [post.id]: e.target.value,
                        }))
                      }
                      className={`${inputCls} resize-y text-xs`}
                      placeholder="SEO snippet shown on social and search."
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest">
                      Backlink URL
                    </p>
                    <div className="mt-2 flex min-h-[42px] items-center gap-2 border-2 border-ink bg-cream px-4 py-3 text-xs font-medium">
                      {post.backlink_url ? (
                        <>
                          <ExternalLink
                            className="h-3.5 w-3.5 shrink-0 text-ink/50"
                            strokeWidth={2.5}
                          />
                          <a
                            href={post.backlink_url}
                            target="_blank"
                            rel="nofollow ugc noopener noreferrer"
                            className="break-all underline decoration-sun decoration-4 underline-offset-4 hover:decoration-red"
                          >
                            {post.backlink_url}
                          </a>
                        </>
                      ) : (
                        <span className="text-ink/40">No backlink supplied</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-xs font-bold uppercase tracking-widest">
                    Body preview
                  </p>
                  <p className="mt-2 max-h-40 overflow-y-auto whitespace-pre-wrap border-2 border-ink bg-white px-4 py-3 text-xs font-medium leading-relaxed text-ink/70">
                    {post.body}
                  </p>
                </div>

                {(row?.error || row?.notice) && (
                  <div
                    className={`mt-4 border-2 border-ink px-4 py-3 text-sm font-bold ${
                      row?.error ? "bg-[#fecaca]" : "bg-mint"
                    }`}
                  >
                    {row?.error ?? row?.notice}
                  </div>
                )}

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    disabled={row?.saving}
                    onClick={() => act(post, "published")}
                    className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-mint px-6 py-3 text-sm font-bold uppercase tracking-wide shadow-[4px_4px_0px_0px_var(--color-ink)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <CheckCircle2 className="h-4 w-4" strokeWidth={2.5} />
                    Approve
                  </button>
                  <button
                    type="button"
                    disabled={row?.saving}
                    onClick={() => act(post, "rejected")}
                    className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-cream px-6 py-3 text-sm font-bold uppercase tracking-wide shadow-[4px_4px_0px_0px_var(--color-ink)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <XCircle className="h-4 w-4" strokeWidth={2.5} />
                    Reject
                  </button>
                  {row?.saving && (
                    <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ink/50">
                      <LoaderCircle
                        className="h-3.5 w-3.5 animate-spin"
                        strokeWidth={2.5}
                      />
                      Updating…
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </>
      )}
    </div>
  );
}