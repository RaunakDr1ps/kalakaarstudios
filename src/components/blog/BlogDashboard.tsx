"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Eye,
  FilePenLine,
  LoaderCircle,
  NotebookPen,
  RefreshCw,
  Save,
  X,
} from "lucide-react";
import {
  fetchPublishedBlogs,
  getStoredAdminKey,
  triggerDeployWebhook,
  updateBlog,
  type Blog,
  type BlogUpdate,
} from "@/lib/blog";

const inputCls =
  "mt-2 w-full border-2 border-ink bg-cream px-4 py-3 text-sm font-medium outline-none transition-shadow focus:shadow-[3px_3px_0px_0px_var(--color-ink)]";
const labelCls = "block text-xs font-bold uppercase tracking-widest";

export default function BlogDashboard() {
  const [posts, setPosts] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState<Blog | null>(null);
  const [draft, setDraft] = useState<BlogUpdate>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deployNotice, setDeployNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const published = await fetchPublishedBlogs();
      setPosts(published);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load published posts."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const published = await fetchPublishedBlogs();
        if (!cancelled) setPosts(published);
      } catch (err) {
        if (!cancelled)
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load published posts."
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalViews = useMemo(
    () => posts.reduce((sum, post) => sum + (post.views ?? 0), 0),
    [posts]
  );

  function openEdit(post: Blog) {
    setEditing(post);
    setDraft({
      title: post.title,
      cover_image_url: post.cover_image_url ?? "",
      body: post.body,
      meta_description: post.meta_description,
      backlink_url: post.backlink_url ?? "",
    });
    setSaveError(null);
    setDeployNotice(null);
  }

  function closeEdit() {
    if (saving) return;
    setEditing(null);
  }

  function setField(field: keyof BlogUpdate, value: string) {
    setDraft((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setSaveError(null);
    setDeployNotice(null);
    try {
      const adminKey = getStoredAdminKey();
      await updateBlog({
        id: editing.id,
        adminKey,
        patch: {
          title: (draft.title ?? "").trim(),
          cover_image_url: (draft.cover_image_url ?? "").trim() || null,
          body: (draft.body ?? "").trim(),
          meta_description: (draft.meta_description ?? "").trim(),
          backlink_url: (draft.backlink_url ?? "").trim() || null,
        },
      });
      const deployed = await triggerDeployWebhook();
      setDeployNotice(
        deployed
          ? "Changes saved — live redeploy triggered."
          : "Changes saved. Deploy hook not configured (set NEXT_PUBLIC_CLOUDFLARE_DEPLOY_HOOK_URL in the environment to auto-refresh the live site)."
      );
      await load();
      setEditing(null);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Failed to save changes."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-ink/50">
          {loading
            ? "Loading dashboard…"
            : `${posts.length} live post${posts.length === 1 ? "" : "s"} · ${totalViews.toLocaleString("en-IN")} total views`}
        </p>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex items-center gap-2 border-2 border-ink bg-sun px-4 py-2 text-xs font-bold uppercase tracking-wide shadow-[3px_3px_0px_0px_var(--color-ink)] transition-all hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_var(--color-ink)]"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
            strokeWidth={2.5}
          />
          Refresh
        </button>
      </div>

      {error && (
        <div className="border-2 border-ink bg-[#fecaca] px-4 py-3 text-sm font-bold">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-4 border-2 border-ink bg-cream p-5 shadow-[5px_5px_0px_0px_var(--color-ink)]">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-ink bg-sun shadow-[3px_3px_0px_0px_var(--color-ink)]">
            <Eye className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50">
              Total Views
            </p>
            <p className="font-blocky text-3xl font-bold tracking-tight">
              {totalViews.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 border-2 border-ink bg-cream p-5 shadow-[5px_5px_0px_0px_var(--color-ink)]">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-ink bg-mint shadow-[3px_3px_0px_0px_var(--color-ink)]">
            <NotebookPen className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50">
              Live Posts
            </p>
            <p className="font-blocky text-3xl font-bold tracking-tight">
              {posts.length}
            </p>
          </div>
        </div>
      </div>

      {!loading && !error && posts.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-ink py-16 text-center">
          <NotebookPen className="h-10 w-10 text-ink/30" strokeWidth={1.5} />
          <p className="font-blocky text-2xl font-bold uppercase tracking-tight">
            Nothing live yet
          </p>
          <p className="max-w-sm text-sm font-medium text-ink/60">
            Approve posts in the pending queue and they&apos;ll show up here
            with view tracking.
          </p>
        </div>
      )}

      {posts.length > 0 && (
        <div className="overflow-x-auto border-2 border-ink bg-cream shadow-[6px_6px_0px_0px_var(--color-ink)]">
          <table className="w-full min-w-[680px] border-collapse text-left">
            <thead>
              <tr className="border-b-2 border-ink bg-sun/30 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/70">
                <th className="px-4 py-3">Post</th>
                <th className="px-4 py-3">Author</th>
                <th className="px-4 py-3 text-right">Views</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-ink/10 last:border-b-0"
                >
                  <td className="px-4 py-3">
                    <p className="text-sm font-bold uppercase tracking-tight">
                      {post.title}
                    </p>
                    <Link
                      href={`/blog/${post.id}`}
                      className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-ink/50 transition-colors hover:text-red"
                    >
                      <Eye className="h-3 w-3" strokeWidth={2.5} />
                      View live
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-xs font-semibold text-ink/60">
                    {post.author_name}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex items-center gap-1.5 border-2 border-ink bg-cream px-2.5 py-1 text-xs font-bold shadow-[2px_2px_0px_0px_var(--color-ink)]">
                      <Eye className="h-3.5 w-3.5" strokeWidth={2.5} />
                      {(post.views ?? 0).toLocaleString("en-IN")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => openEdit(post)}
                      className="inline-flex items-center gap-1.5 border-2 border-ink bg-sun px-3 py-1.5 text-xs font-bold uppercase tracking-wide shadow-[2px_2px_0px_0px_var(--color-ink)] transition-all hover:-translate-y-0.5"
                    >
                      <FilePenLine className="h-3.5 w-3.5" strokeWidth={2.5} />
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-ink/60 p-4 sm:p-8">
          <div className="w-full max-w-2xl border-2 border-ink bg-cream p-6 shadow-[8px_8px_0px_0px_var(--color-ink)] sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-blocky text-xl font-bold uppercase tracking-tight">
                  Edit post
                </h3>
                <p className="mt-1 text-xs font-medium text-ink/50">
                  Changes save to the CRM and trigger a live redeploy.
                </p>
              </div>
              <button
                type="button"
                onClick={closeEdit}
                disabled={saving}
                aria-label="Close"
                className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-ink bg-cream text-ink transition-colors hover:bg-[#fecaca] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <X className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>

            <form onSubmit={(e) => void handleSave(e)} className="mt-6 space-y-4">
              {saveError && (
                <div className="border-2 border-ink bg-[#fecaca] px-4 py-3 text-sm font-bold">
                  Couldn&apos;t save: {saveError}
                </div>
              )}

              <div>
                <label htmlFor="edit-title" className={labelCls}>
                  Title *
                </label>
                <input
                  id="edit-title"
                  type="text"
                  required
                  value={draft.title ?? ""}
                  onChange={(e) => setField("title", e.target.value)}
                  className={inputCls}
                />
              </div>

              <div>
                <label htmlFor="edit-cover" className={labelCls}>
                  Cover image URL
                </label>
                <input
                  id="edit-cover"
                  type="url"
                  value={draft.cover_image_url ?? ""}
                  onChange={(e) => setField("cover_image_url", e.target.value)}
                  placeholder="https://…"
                  className={inputCls}
                />
              </div>

              <div>
                <label htmlFor="edit-meta" className={labelCls}>
                  Meta description *
                </label>
                <input
                  id="edit-meta"
                  type="text"
                  required
                  value={draft.meta_description ?? ""}
                  onChange={(e) => setField("meta_description", e.target.value)}
                  className={inputCls}
                />
              </div>

              <div>
                <label htmlFor="edit-body" className={labelCls}>
                  Rich-text content (markdown) *
                </label>
                <textarea
                  id="edit-body"
                  rows={12}
                  required
                  value={draft.body ?? ""}
                  onChange={(e) => setField("body", e.target.value)}
                  className={`${inputCls} resize-y font-mono text-xs leading-relaxed`}
                />
              </div>

              <div>
                <label htmlFor="edit-backlink" className={labelCls}>
                  Backlink URL (optional)
                </label>
                <input
                  id="edit-backlink"
                  type="url"
                  value={draft.backlink_url ?? ""}
                  onChange={(e) => setField("backlink_url", e.target.value)}
                  placeholder="https://your-site.com"
                  className={inputCls}
                />
              </div>

              {deployNotice && (
                <div className="border-2 border-ink bg-mint px-4 py-3 text-sm font-bold">
                  {deployNotice}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-red px-6 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-[4px_4px_0px_0px_var(--color-ink)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <LoaderCircle
                        className="h-4 w-4 animate-spin"
                        strokeWidth={2.5}
                      />
                      Saving…
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" strokeWidth={2.5} />
                      Save changes
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={closeEdit}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-cream px-6 py-3 text-sm font-bold uppercase tracking-wide shadow-[4px_4px_0px_0px_var(--color-ink)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}