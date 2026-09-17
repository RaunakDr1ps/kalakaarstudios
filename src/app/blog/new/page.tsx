import type { Metadata } from "next";
import { NotebookPen } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogSubmissionForm from "@/components/blog/BlogSubmissionForm";

export const metadata: Metadata = {
  title: "Write for Us | Kalakaar Studios",
  description:
    "Guest post for Kalakaar Studios. Share your event production, live music, and stagecraft stories — our editorial team reviews every submission.",
};

export default function NewBlogPage() {
  return (
    <>
      <Header />
      <main className="bg-cream text-ink">
        <section className="border-b-2 border-ink bg-sun/30">
          <div className="mx-auto max-w-3xl px-6 py-12">
            <span className="inline-flex -rotate-1 items-center gap-2 border-2 border-ink bg-sun px-3 py-1.5 text-xs font-bold uppercase tracking-widest shadow-[3px_3px_0px_0px_var(--color-ink)]">
              <NotebookPen className="h-3.5 w-3.5" strokeWidth={2.5} />
              Guest post
            </span>
            <h1 className="mt-5 font-blocky text-4xl font-bold uppercase leading-[1.02] tracking-tight sm:text-5xl">
              Write for
              <br />
              the blog.
            </h1>
            <p className="mt-4 max-w-xl text-sm font-medium leading-relaxed text-ink/70">
              Got a story from the front row of live production? Stage builds,
              festival footprints, artist ops, or the road crew notes nobody
              writes down — pitch it. Our editorial team reviews every
              submission before it goes live.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 py-12">
          <BlogSubmissionForm />
        </section>
      </main>
      <Footer />
    </>
  );
}