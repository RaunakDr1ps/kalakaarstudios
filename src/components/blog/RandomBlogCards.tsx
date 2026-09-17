"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, NotebookPen, RefreshCw, Shuffle } from "lucide-react";
import { excerpt, fetchPublishedBlogs, formatDate, type Blog } from "@/lib/blog";

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function RandomBlogCards() {
  const [posts, setPosts] = useState<Blog[]>([]);
  const [rotation, setRotation] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchPublishedBlogs()
      .then((all) => {
        if (!active) return;
        setPosts(all);
        setRotation(shuffle(all).slice(0, 3));
      })
      .catch(() => {
        if (active) setPosts([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  function reshuffle() {
    setLoading(true);
    setRotation(posts.length ? shuffle(posts).slice(0, 3) : []);
    setTimeout(() => setLoading(false), 200);
  }

  if (loading) return null;
  if (posts.length === 0 || rotation.length === 0) return null;

  return (
    <section className="border-t-2 border-ink bg-cream">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-ink/50">
              From the booth log
            </p>
            <h2 className="mt-2 font-blocky text-3xl font-bold uppercase tracking-tight sm:text-4xl">
              Fresh from the blog
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={reshuffle}
              className="inline-flex items-center gap-2 border-2 border-ink bg-sun px-4 py-2 text-xs font-bold uppercase tracking-wide shadow-[3px_3px_0px_0px_var(--color-ink)] transition-all hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_var(--color-ink)]"
              aria-label="Shuffle blog posts"
            >
              <RefreshCw className="h-3.5 w-3.5" strokeWidth={2.5} />
              Shuffle
            </button>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 border-2 border-ink bg-cream px-4 py-2 text-xs font-bold uppercase tracking-wide shadow-[3px_3px_0px_0px_var(--color-ink)] transition-all hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_var(--color-ink)]"
            >
              <Shuffle className="h-3.5 w-3.5" strokeWidth={2.5} />
              All posts
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {rotation.map((post, i) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className={`group flex flex-col border-2 border-ink bg-cream shadow-[5px_5px_0px_0px_var(--color-ink)] transition-all hover:-translate-y-1 hover:shadow-[7px_7px_0px_0px_var(--color-ink)] ${
                i % 2 === 0 ? "rotate-[0.75deg]" : "-rotate-[0.75deg]"
              }`}
            >
              <div className="flex aspect-[16/9] w-full items-center justify-center overflow-hidden border-b-2 border-ink bg-white">
                {post.cover_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.cover_image_url}
                    alt={post.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <NotebookPen className="h-10 w-10 text-ink/25" strokeWidth={1.5} />
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50">
                  {post.author_name} · {formatDate(post.created_at)}
                </p>
                <h3 className="mt-2 font-blocky text-xl font-bold uppercase leading-snug tracking-tight transition-colors group-hover:text-red">
                  {post.title}
                </h3>
                <p className="mt-3 flex-1 text-sm font-medium leading-relaxed text-ink/65">
                  {excerpt(post.body, 120)}
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
      </div>
    </section>
  );
}