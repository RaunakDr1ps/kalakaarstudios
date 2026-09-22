"use client";

import { useState } from "react";
import { FilePenLine, LoaderCircle, Send, X } from "lucide-react";
import { CLOUDFLARE_DEPLOY_HOOK_URL } from "@/lib/blog";

const inputCls =
  "mt-2 w-full border-2 border-ink bg-cream px-4 py-3 text-sm font-medium outline-none transition-shadow focus:shadow-[3px_3px_0px_0px_var(--color-ink)]";
const labelCls = "block text-xs font-bold uppercase tracking-widest";

const EMPTY_FORM = {
  author_name: "",
  author_email: "",
  title: "",
  cover_image_url: "",
  meta_description: "",
  body: "",
  backlink_url: "",
};

export default function BlogSubmitModal() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });

  function setField(field: keyof typeof EMPTY_FORM, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function openModal() {
    setForm({ ...EMPTY_FORM });
    setError(null);
    setOpen(true);
  }

  function closeModal() {
    if (submitting) return;
    setOpen(false);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const baseUrl = (
        process.env.NEXT_PUBLIC_CRM_API_URL ||
        "https://crm.kalakaarstudios.co.in/api"
      ).replace(/\/+$/, "");
      const submitUrl = `${baseUrl}/blogs/submit`;
      console.log("[blog] Submitting story to:", submitUrl);
      const res = await fetch(submitUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title.trim(),
          author_name: form.author_name.trim(),
          author_email: form.author_email.trim(),
          cover_image_url: form.cover_image_url.trim() || null,
          body: form.body.trim(),
          meta_description: form.meta_description.trim(),
          backlink_url: form.backlink_url.trim() || null,
          // Non-admin submissions always land in the moderation queue.
          status: "pending",
        }),
      });
      if (!res.ok) {
        throw new Error(`Submission failed (HTTP ${res.status})`);
      }
      // Non-blocking redeploy: fire-and-forget so a stuck webhook never
      // blocks the form. `no-cors` keeps this a simple cross-origin POST.
      try {
        void fetch(CLOUDFLARE_DEPLOY_HOOK_URL, {
          method: "POST",
          mode: "no-cors",
        }).catch((err) =>
          console.warn("[blog] Redeploy webhook failed (non-blocking):", err)
        );
      } catch (err) {
        console.warn("[blog] Redeploy webhook failed (non-blocking):", err);
      }
      alert("Thank you! Your story has been submitted for editorial review.");
      setForm({ ...EMPTY_FORM });
      setOpen(false);
    } catch (err) {
      const baseUrl = (
        process.env.NEXT_PUBLIC_CRM_API_URL ||
        "https://crm.kalakaarstudios.co.in/api"
      ).replace(/\/+$/, "");
      const submitUrl = `${baseUrl}/blogs/submit`;
      console.error("Submit Story Error:", err);
      alert(
        `Failed to submit your story. Target URL: ${submitUrl}\n\nError: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
      setError(
        err instanceof Error ? err.message : "Failed to submit your story."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-sun px-6 py-3 text-sm font-bold uppercase tracking-wide text-ink shadow-[4px_4px_0px_0px_var(--color-ink)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_var(--color-ink)]"
      >
        <FilePenLine className="h-4 w-4" strokeWidth={2.5} />
        Write a post
      </button>

      {open && (
        <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-ink/60 p-4 sm:p-8">
          <div className="w-full max-w-2xl border-2 border-ink bg-cream p-6 shadow-[8px_8px_0px_0px_var(--color-ink)] sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-blocky text-xl font-bold uppercase tracking-tight">
                  Share your story
                </h3>
                <p className="mt-1 text-xs font-medium text-ink/50">
                  Submissions land in our moderation queue and are published
                  only after editorial review.
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                disabled={submitting}
                aria-label="Close"
                className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-ink bg-cream text-ink transition-colors hover:bg-[#fecaca] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <X className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>

            <form
              onSubmit={(e) => void handleSubmit(e)}
              className="mt-6 space-y-4"
            >
              {error && (
                <div className="border-2 border-ink bg-[#fecaca] px-4 py-3 text-sm font-bold">
                  Couldn&apos;t send your story: {error}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="submit-author-name" className={labelCls}>
                    Author name *
                  </label>
                  <input
                    id="submit-author-name"
                    type="text"
                    required
                    value={form.author_name}
                    onChange={(e) => setField("author_name", e.target.value)}
                    placeholder="Your name or stage name"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="submit-author-email" className={labelCls}>
                    Author email *
                  </label>
                  <input
                    id="submit-author-email"
                    type="email"
                    required
                    value={form.author_email}
                    onChange={(e) => setField("author_email", e.target.value)}
                    placeholder="you@example.com"
                    className={inputCls}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="submit-title" className={labelCls}>
                  Blog title *
                </label>
                <input
                  id="submit-title"
                  type="text"
                  required
                  maxLength={120}
                  value={form.title}
                  onChange={(e) => setField("title", e.target.value)}
                  placeholder="A headline worth a headline act"
                  className={inputCls}
                />
              </div>

              <div>
                <label htmlFor="submit-cover" className={labelCls}>
                  Cover image URL (optional)
                </label>
                <input
                  id="submit-cover"
                  type="url"
                  value={form.cover_image_url}
                  onChange={(e) => setField("cover_image_url", e.target.value)}
                  placeholder="https://…"
                  className={inputCls}
                />
              </div>

              <div>
                <label htmlFor="submit-meta" className={labelCls}>
                  Meta description / short summary *
                </label>
                <input
                  id="submit-meta"
                  type="text"
                  required
                  maxLength={170}
                  value={form.meta_description}
                  onChange={(e) =>
                    setField("meta_description", e.target.value)
                  }
                  placeholder="One or two sentences — this becomes the SEO snippet."
                  className={inputCls}
                />
              </div>

              <div>
                <label htmlFor="submit-body" className={labelCls}>
                  Article content (markdown) *
                </label>
                <textarea
                  id="submit-body"
                  rows={10}
                  required
                  value={form.body}
                  onChange={(e) => setField("body", e.target.value)}
                  placeholder="## Headings, **bold**, *em*, <u>underline</u> and [links](https://…) all supported."
                  className={`${inputCls} resize-y font-mono text-xs leading-relaxed`}
                />
              </div>

              <div>
                <label htmlFor="submit-backlink" className={labelCls}>
                  Backlink / portfolio URL (optional)
                </label>
                <input
                  id="submit-backlink"
                  type="url"
                  value={form.backlink_url}
                  onChange={(e) => setField("backlink_url", e.target.value)}
                  placeholder="https://your-site.com — linked with rel=nofollow ugc"
                  className={inputCls}
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-red px-6 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-[4px_4px_0px_0px_var(--color-ink)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <LoaderCircle
                        className="h-4 w-4 animate-spin"
                        strokeWidth={2.5}
                      />
                      Submitting…
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" strokeWidth={2.5} />
                      Submit for review
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-cream px-6 py-3 text-sm font-bold uppercase tracking-wide shadow-[4px_4px_0px_0px_var(--color-ink)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}