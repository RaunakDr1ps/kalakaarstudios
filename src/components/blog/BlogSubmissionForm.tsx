"use client";

import { FormEvent, useRef, useState } from "react";
import {
  ArrowLeft,
  Bold,
  FilePenLine,
  Heading2,
  ImagePlus,
  Italic,
  Link2,
  List,
  LoaderCircle,
  Send,
  Star,
  Underline,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import ImageWithFallback from "@/components/blog/ImageWithFallback";
import { submitBlog, uploadBlogImage } from "@/lib/blog";

const inputCls =
  "mt-2 w-full border-2 border-ink bg-cream px-4 py-3 text-sm font-medium outline-none transition-shadow focus:shadow-[3px_3px_0px_0px_var(--color-ink)]";
const labelCls = "block text-xs font-bold uppercase tracking-widest";
const toolbarBtn =
  "inline-flex h-8 items-center justify-center gap-1.5 border-2 border-ink bg-cream px-2 text-xs font-bold uppercase tracking-wide text-ink transition-all hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_0px_var(--color-ink)]";

export default function BlogSubmissionForm() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [body, setBody] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [coverUploaded, setCoverUploaded] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [coverError, setCoverError] = useState<string | null>(null);
  const [linkPopupOpen, setLinkPopupOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  async function handleCoverFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    setCoverError(null);
    try {
      const url = await uploadBlogImage(file);
      setCoverImageUrl(url);
      setCoverUploaded(true);
    } catch (err) {
      setCoverError(
        err instanceof Error ? err.message : "Image upload failed."
      );
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  }

  function applyInline(before: string, after: string, placeholder: string) {
    const el = bodyRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = el.value.slice(start, end) || placeholder;
    const insert = `${before}${selected}${after}`;
    setBody(el.value.slice(0, start) + insert + el.value.slice(end));
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(
        start + before.length,
        start + before.length + selected.length
      );
    });
  }

  function applyBlock(prefix: string, placeholder: string) {
    const el = bodyRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = el.value;
    const lineStart = text.lastIndexOf("\n", start - 1) + 1;
    const atLineStart = start === lineStart;
    const selected = text.slice(start, end);

    let nextValue: string;
    let selStart: number;
    let selEnd: number;

    if (selected && atLineStart) {
      nextValue = text.slice(0, lineStart) + prefix + selected + text.slice(end);
      selStart = lineStart + prefix.length;
      selEnd = selStart + selected.length;
    } else if (selected) {
      nextValue = text.slice(0, start) + "\n" + prefix + selected + text.slice(end);
      selStart = start + 1 + prefix.length;
      selEnd = selStart + selected.length;
    } else if (atLineStart) {
      nextValue = text.slice(0, start) + prefix + placeholder + text.slice(start);
      selStart = start + prefix.length;
      selEnd = selStart + placeholder.length;
    } else {
      nextValue = text.slice(0, start) + "\n" + prefix + placeholder + text.slice(start);
      selStart = start + 1 + prefix.length;
      selEnd = selStart + placeholder.length;
    }

    setBody(nextValue);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(selStart, selEnd);
    });
  }

  function applyLink() {
    const el = bodyRef.current;
    if (!el) return;
    const url = linkUrl.trim();
    if (!url) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = el.value.slice(start, end) || "link text";
    const href = /^(https?:\/\/|mailto:)/i.test(url) ? url : `https://${url}`;
    const insert = `[${selected}](${href})`;
    setBody(el.value.slice(0, start) + insert + el.value.slice(end));
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + 1, start + 1 + selected.length);
    });
    setLinkPopupOpen(false);
    setLinkUrl("");
  }

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
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="cover_image_url" className={labelCls}>
              Cover Image URL
            </label>
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              disabled={uploadingImage}
              className="inline-flex items-center gap-1.5 border-2 border-ink bg-cream px-3 py-1 text-[10px] font-bold uppercase tracking-wide transition-all hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_0px_var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploadingImage ? (
                <>
                  <LoaderCircle
                    className="h-3.5 w-3.5 animate-spin"
                    strokeWidth={2.5}
                  />
                  Uploading…
                </>
              ) : (
                <>
                  <ImagePlus className="h-3.5 w-3.5" strokeWidth={2.5} />
                  Upload Image
                </>
              )}
            </button>
          </div>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleCoverFile}
          />
          <input
            type="url"
            id="cover_image_url"
            name="cover_image_url"
            value={coverImageUrl}
            onChange={(e) => {
              setCoverImageUrl(e.target.value);
              setCoverUploaded(false);
            }}
            placeholder="https://blog-images.yourcdn.com/…"
            className={inputCls}
          />
          {coverError && (
            <p className="mt-1.5 text-xs font-bold text-red">
              Image upload failed: {coverError}
            </p>
          )}
          {coverImageUrl && (
            <div className="mt-2 flex items-center gap-3 border-2 border-ink bg-white p-2 shadow-[2px_2px_0px_0px_var(--color-ink)]">
              <ImageWithFallback
                src={coverImageUrl}
                alt="Cover preview"
                className="h-16 w-24 shrink-0 border border-ink object-cover"
              />
              <span className="text-[10px] font-bold uppercase tracking-widest text-ink/50">
                {coverUploaded
                  ? "Stored in Supabase Storage"
                  : "Cover image URL"}
              </span>
            </div>
          )}
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

        <div className="mt-2 border-2 border-ink bg-sun/20 p-1.5 shadow-[2px_2px_0px_0px_var(--color-ink)]">
          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() => applyInline("**", "**", "text")}
              title="Bold — **text**"
              aria-label="Bold"
              className={toolbarBtn}
            >
              <Bold className="h-4 w-4" strokeWidth={2.5} />
            </button>
            <button
              type="button"
              onClick={() => applyInline("*", "*", "text")}
              title="Italic — *text*"
              aria-label="Italic"
              className={toolbarBtn}
            >
              <Italic className="h-4 w-4" strokeWidth={2.5} />
            </button>
            <button
              type="button"
              onClick={() => applyInline("<u>", "</u>", "text")}
              title="Underline — <u>text</u>"
              aria-label="Underline"
              className={toolbarBtn}
            >
              <Underline className="h-4 w-4" strokeWidth={2.5} />
            </button>
            <button
              type="button"
              onClick={() => setLinkPopupOpen((open) => !open)}
              title="Link — [link text](url)"
              aria-label="Add Link"
              className={toolbarBtn}
            >
              <Link2 className="h-4 w-4" strokeWidth={2.5} />
              Link
            </button>
            <button
              type="button"
              onClick={() => applyBlock("## ", "Header")}
              title="Heading — ## Header"
              aria-label="Heading"
              className={toolbarBtn}
            >
              <Heading2 className="h-4 w-4" strokeWidth={2.5} />
            </button>
            <button
              type="button"
              onClick={() => applyBlock("- ", "item")}
              title="Bullet list — - item"
              aria-label="Bullet list"
              className={toolbarBtn}
            >
              <List className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>

          {linkPopupOpen && (
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5 border-2 border-ink bg-white p-1.5">
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    applyLink();
                  }
                  if (e.key === "Escape") setLinkPopupOpen(false);
                }}
                placeholder="https://…"
                autoFocus
                className="min-w-[12rem] flex-1 border-2 border-ink bg-cream px-3 py-1.5 text-sm font-medium outline-none"
              />
              <button
                type="button"
                onClick={applyLink}
                className="inline-flex h-8 items-center gap-1.5 border-2 border-ink bg-sun px-3 text-xs font-bold uppercase tracking-wide text-ink shadow-[2px_2px_0px_0px_var(--color-ink)] transition-all hover:-translate-y-0.5"
              >
                <Link2 className="h-3.5 w-3.5" strokeWidth={2.5} />
                Insert
              </button>
              <button
                type="button"
                onClick={() => setLinkPopupOpen(false)}
                aria-label="Cancel link"
                className="inline-flex h-8 w-8 items-center justify-center border-2 border-ink bg-cream text-ink transition-colors hover:bg-[#fecaca]"
              >
                <X className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>
          )}
        </div>

        <textarea
          id="body"
          name="body"
          ref={bodyRef}
          rows={10}
          required
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={"## Headings, **bold**, *em*, <u>underline</u> and [links](https://…) all supported."}
          className={`${inputCls} resize-y`}
        />
        <p className="mt-1.5 text-xs font-medium text-ink/50">
          Markdown is supported: # headings, **bold**, *italics*,{" "}
          <u>underline</u>, `code`, lists, and links — or use the toolbar above.
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