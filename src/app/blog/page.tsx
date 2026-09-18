import type { Metadata } from "next";
import { NotebookPen } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogFeed from "@/components/blog/BlogFeed";
import { fetchPublishedBlogs } from "@/lib/blog";

export const metadata: Metadata = {
  title: "The Blog | Kalakaar Studios",
  description:
    "Stories from the world of live event production — stage builds, festival footprints, artist ops, and the chaos in between.",
};

export default async function BlogIndexPage() {
  // Static fetch: pulls published posts straight from
  // {NEXT_PUBLIC_CRM_API_URL}/blogs?status=published at build time.
  // BlogFeed refreshes from the same endpoint client-side as a fallback.
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
          <BlogFeed initialPosts={posts} />
        </section>
      </main>
      <Footer />
    </>
  );
}