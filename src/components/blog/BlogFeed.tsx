"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, LoaderCircle, NotebookPen } from "lucide-react";
import {
  excerpt,
  fetchPublishedBlogs,
  formatDate,
  type Blog,
} from "@/lib/blog";

export default function BlogFeed({ initialPosts }: { initialPosts: Blog[] }) {
  const [posts, setPosts] = useState<Blog[]>(initialPosts);
  const [loaded, setLoaded] = useState(initialPosts.length > 0);

  useEffect(() => {
    let active = true;
    // Client-side fallback: if the static export was built without live data
    // (empty/failed fetch during `next build`), pull posts straight from the
    // CRM as soon as the page loads in the browser.
    fetchPublishedBlogs()
      .then((live) => {
        if (!active) return;
        if (live.length > 0) setPosts(live);
      })
      .catch(() => {
        // Keep whatever the static build produced.
      })
      .finally(() => {
        if (active) setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, []);

  if (posts.length > 0) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, i) => (
          <Link
            key={post.id}
            href={`/blog/${post.id}`}
            className={`group flex flex-col border-2 border-ink bg-cream shadow-[5px_5px_0px_0px_var(--color-ink)] transition-all hover:-translate-y-1 hover:shadow-[7px_7px_0px_0px_var(--color-ink)] ${
              i % 2 === 0 ? "rotate-[0.5deg]" : "-rotate-[0.5deg]"
            }`}
          >
            <div className="flex aspect-[16/9] w-full items-center justify-center overflow-hidden border-b-2 border-ink bg-white">
              {(() => {
                const coverUrl =
                  post.cover_image ||
                  post.coverImage ||
                  post.cover_image_url ||
                  post.image ||
                  "";
                return coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={coverUrl}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <NotebookPen
                    className="h-10 w-10 text-ink/25"
                    strokeWidth={1.5}
                  />
                );
              })()}
            </div>
            <div className="flex flex-1 flex-col p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50">
                {post.author_name} · {formatDate(post.created_at)}
              </p>
              <h2 className="mt-2 font-blocky text-xl font-bold uppercase leading-snug tracking-tight transition-colors group-hover:text-red">
                {post.title}
              </h2>
              <p className="mt-3 flex-1 text-sm font-medium leading-relaxed text-ink/65">
                {excerpt(post.body)}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide">
                Read More
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  strokeWidth={2.5}
                />
              </span>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  if (!loaded) {
    return (
      <div className="flex items-center justify-center gap-2 border-2 border-dashed border-ink py-16 text-center">
        <LoaderCircle className="h-5 w-5 animate-spin text-ink/40" strokeWidth={2.5} />
        <p className="text-xs font-bold uppercase tracking-widest text-ink/50">
          Loading posts…
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-ink py-16 text-center">
      <p className="font-blocky text-2xl font-bold uppercase tracking-tight">
        No entries yet
      </p>
      <p className="max-w-sm text-sm font-medium text-ink/60">
        The editorial queue is warming up. Write one for us.
      </p>
      <Link
        href="/blog/new"
        className="mt-2 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-red px-6 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-[4px_4px_0px_0px_var(--color-ink)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_var(--color-ink)]"
      >
        Submit a Post
      </Link>
    </div>
  );
}