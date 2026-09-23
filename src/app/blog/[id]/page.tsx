import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ViewTracker from "@/components/blog/ViewTracker";
import MarkdownBody from "@/components/blog/MarkdownBody";
import { fetchPublishedBlog, fetchPublishedBlogs, formatDate } from "@/lib/blog";

type Params = { id: string };

function isSafeBacklink(url: string | null): url is string {
  return Boolean(url && /^(https?):\/\/./i.test(url.trim()));
}

export const dynamicParams = false;

const PLACEHOLDER_ID = "__placeholder__";

export async function generateStaticParams(): Promise<{ id: string }[]> {
  const posts = await fetchPublishedBlogs();

  // With `output: export` at least one route must exist at build time.
  // If Supabase isn't configured during the build, emit a placeholder
  // param; its page call notFound() and gets 404'd. Real IDs are always
  // generated when the environment provides a Supabase project.
  if (posts.length > 0) return posts.map((post) => ({ id: post.id }));
  return [{ id: PLACEHOLDER_ID }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await fetchPublishedBlog(id);

  if (!post) {
    return {
      title: "Post not found | Kalakaar Studios",
    };
  }

  return {
    title: `${post.title} | Kalakaar Studios`,
    description: post.meta_description,
    openGraph: {
      title: post.title,
      description: post.meta_description,
      type: "article",
      publishedTime: post.created_at,
      authors: [post.author_name],
      images: post.coverImage ? [{ url: post.coverImage, alt: post.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.meta_description,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const post = await fetchPublishedBlog(id);

  if (!post) notFound();

  return (
    <>
      <Header />
      <main className="bg-cream text-ink">
        <article className="mx-auto max-w-3xl px-6 py-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ink/60 hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
            All posts
          </Link>

          {(() => {
            const coverUrl =
              post.cover_image ||
              post.coverImage ||
              post.cover_image_url ||
              post.image ||
              "";
            return coverUrl ? (
              <div className="relative mb-8 mt-6 h-[350px] w-full overflow-hidden rounded-lg border border-black/10 md:h-[450px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverUrl}
                  alt={post.title}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : null;
          })()}

          <h1 className="mt-6 font-blocky text-4xl font-bold uppercase leading-[1.05] tracking-tight sm:text-5xl">
            {post.title}
          </h1>

          <p className="mt-4 text-xs font-bold uppercase tracking-[0.25em] text-ink/50">
            By {post.author_name} · {formatDate(post.created_at)}
          </p>

          <div className="blog-body mt-10 max-w-none space-y-4">
            <MarkdownBody markdown={post.body} />
          </div>

          {isSafeBacklink(post.backlink_url) && (
            <div className="mt-10 flex flex-wrap items-center gap-3 border-2 border-ink bg-cream p-4 shadow-[4px_4px_0px_0px_var(--color-ink)]">
              <span className="flex h-9 w-9 items-center justify-center border-2 border-ink bg-sun">
                <ExternalLink className="h-4 w-4" strokeWidth={2.5} />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50">
                  Guest author&apos;s site
                </p>
                <a
                  href={post.backlink_url}
                  target="_blank"
                  rel="nofollow ugc noopener noreferrer"
                  className="break-all text-sm font-bold uppercase tracking-wide underline decoration-sun decoration-4 underline-offset-4 hover:decoration-red"
                >
                  {post.backlink_url.replace(/^https?:\/\//, "")}
                </a>
              </div>
            </div>
          )}

          <p className="mt-10 text-xs font-medium text-ink/40">
            This post was submitted by a community writer and reviewed by the
            Kalakaar Studios editorial team.
          </p>
        </article>
      </main>
      <ViewTracker id={post.id} />
      <Footer />
    </>
  );
}