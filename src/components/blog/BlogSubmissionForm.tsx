"use client";

import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  FilePenLine,
  Send,
  Star,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { submitBlog } from "@/lib/blog";

const inputCls =
  "mt-2 w-full border-2 border-ink bg-cream px-4 py-3 text-sm font-medium outline-none transition-shadow focus:shadow-[3px_3px_0px_0px_var(--color-ink)]";
const labelCls =
  "block text-xs font-bold uppercase tracking-widest";

export default function BlogSubmissionForm() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      await submitBlog({
        author_name: String(data.get("author_name") ?? "").trim(),
        title: String(data.get("title") ?? "").trim(),
        cover_image_url: String(data.get("cover_image_url") ?? "").trim(),
        body: String(data.get("body") ?? "").trim(),
        meta_description: String(data.get("meta_description") ?? "").trim(),
        backlink_url: String(data.get("backlink_url") ?? "").trim(),
      });
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="border-2 border-ink bg-cream p-8 shadow-[8px_8px_0px_0px_var(--color-ink)] sm:p-12">
        <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-ink bg-sun shadow-[4px_4px_0px_0px_var(--color-ink)]">
            <Star className="h-8 w-8 fill-current" strokeWidth={2.5} />
          </span>
          <h2 className="font-blocky text-2xl font-bold uppercase tracking-tight">
            Submission received!
          </h2>
          <p className="max-w-md text-sm font-medium leading-relaxed text-ink/70">
            Thank you for your submission! Our editorial team will review your
            post before it goes live.
          </p>
          <Link
            href="/"
            className="mt-2 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide underline decoration-sun decoration-4 underline-offset-4 hover:decoration-red"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
            Back to studio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="border-2 border-ink bg-[#fecaca] px-4 py-3 text-sm font-bold text-ink">
          Couldn&apos;t send your post: {error}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="author_name" className={labelCls}>
            Author Name *
          </label>
          <input
            type="text"
            id="author_name"
            name="author_name"
            required
            placeholder="Your name or stage name"
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="cover_image_url" className={labelCls}>
            Cover Image URL
          </label>
          <input
            type="url"
            id="cover_image_url"
            name="cover_image_url"
            placeholder="https://…"
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label htmlFor="title" className={labelCls}>
          Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          maxLength={120}
          placeholder="A headline worth a headline act"
          className={inputCls}
        />
      </div>

      <div>
        <label htmlFor="meta_description" className={labelCls}>
          Meta description *
        </label>
        <input
          type="text"
          id="meta_description"
          name="meta_description"
          required
          maxLength={170}
          placeholder="One or two sentences — this becomes the SEO snippet."
          className={inputCls}
        />
      </div>

      <div>
        <label htmlFor="body" className={labelCls}>
          Article body (markdown) *
        </label>
        <textarea
          id="body"
          name="body"
          rows={10}
          required
          placeholder={"## Headings, **bold**, *em* and [links](https://…) all supported."}
          className={`${inputCls} resize-y`}
        />
        <p className="mt-1.5 text-xs font-medium text-ink/50">
          Markdown is supported: # headings, **bold**, *italics*, `code`,
          lists, and links.
        </p>
      </div>

      <div>
        <label htmlFor="backlink_url" className={labelCls}>
          Backlink URL (optional)
        </label>
        <input
          type="url"
          id="backlink_url"
          name="backlink_url"
          placeholder="https://your-site.com — linked with rel=nofollow ugc"
          className={inputCls}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-ink bg-red px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-[4px_4px_0px_0px_var(--color-ink)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {submitting ? (
          <>
            <FilePenLine className="h-4 w-4 animate-pulse" strokeWidth={2.5} />
            Submitting…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" strokeWidth={2.5} />
            Submit for Review
          </>
        )}
      </button>

      <div className="flex items-center gap-2 text-xs font-medium text-ink/50">
        <UserRound className="h-3.5 w-3.5" strokeWidth={2.5} />
        Submissions land in our moderation queue and are published only after
        editorial review.
      </div>
    </form>
  );
}