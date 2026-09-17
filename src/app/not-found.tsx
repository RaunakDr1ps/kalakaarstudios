import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="bg-cream text-ink">
        <section className="mx-auto max-w-3xl px-6 py-20 text-center">
          <p className="font-blocky text-7xl font-bold uppercase tracking-tight text-ink/15 sm:text-9xl">
            404
          </p>
          <h1 className="mt-4 font-blocky text-3xl font-bold uppercase tracking-tight sm:text-4xl">
            This page got lost backstage
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm font-medium leading-relaxed text-ink/60">
            It might have been unpublished, moved, or never existed.
          </p>
          <Link
            href="/"
            className="mt-7 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-sun px-7 py-3.5 text-sm font-bold uppercase tracking-wide shadow-[4px_4px_0px_0px_var(--color-ink)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_var(--color-ink)]"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
            Back to the studio
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}