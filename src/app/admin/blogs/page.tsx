import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminPanel from "@/components/blog/AdminPanel";

export const metadata: Metadata = {
  title: "Blog Moderation | Kalakaar Studios",
  description: "Internal moderation queue for community blog submissions.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminBlogsPage() {
  return (
    <>
      <Header />
      <main className="bg-cream text-ink">
        <section className="border-b-2 border-ink bg-sun/30">
          <div className="mx-auto max-w-5xl px-6 py-12">
            <span className="inline-flex -rotate-1 items-center gap-2 border-2 border-ink bg-sun px-3 py-1.5 text-xs font-bold uppercase tracking-widest shadow-[3px_3px_0px_0px_var(--color-ink)]">
              Editorial desk
            </span>
            <h1 className="mt-5 font-blocky text-4xl font-bold uppercase leading-[1.02] tracking-tight sm:text-5xl">
              Blog Moderation
            </h1>
            <p className="mt-4 max-w-xl text-sm font-medium leading-relaxed text-ink/70">
              Review pending submissions and manage live posts. Tweak the
              meta description, edit published content, and watch view counts.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-12">
          <AdminPanel />
        </section>
      </main>
      <Footer />
    </>
  );
}