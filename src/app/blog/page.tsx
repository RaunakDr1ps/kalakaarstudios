import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, NotebookPen } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { excerpt, fetchPublishedBlogs, formatDate } from "@/lib/blog";

export const metadata: Metadata = {
  title: "The Blog | Kalakaar Studios",
  description:
    "Stories from the world of live event production — stage builds, festival footprints, artist ops, and the chaos in between.",
};

export default async function BlogIndexPage() {
  const posts = await fetchPublishedBlogs();

  return (
    <>
      <Header />
      <main className="bg-cream text-ink">
        <section className="border-b-2 border-ink bg-sun/30">
          <div className="mx-auto max-w-5xl px-6 py-12">
            <span className="inline-flex -rotate-1 items-center gap-2 border-2 border-ink bg-sun px-3 py-1.5 text-xs font-bold uppercase tracking-widest shadow-[3px_3px_0px_0px_var(--color-ink)]">
              <NotebookPen className="h-3.5 w-3.5" strokeWidth={2.5} />
              Notes from the booth
            </span>
            <h1 className="mt-5 font-blocky text-4xl font-bold uppercase leading-[1.02] tracking-tight sm:text-5xl">
              The Kalakaar Blog
            </h1>
            <p className="mt-4 max-w-xl text-sm font-medium leading-relaxed text-ink/70">
              Field notes from live production — readable in the time it takes
              a band to soundcheck.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-12">
          {posts.length === 0 ? (
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
          ) : (
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
                    {post.cover_image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.cover_image_url}
                        alt={post.title}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <NotebookPen
                        className="h-10 w-10 text-ink/25"
                        strokeWidth={1.5}
                      />
                    )}
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
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}