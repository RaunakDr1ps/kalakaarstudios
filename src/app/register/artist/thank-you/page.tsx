import type { Metadata } from "next";
import Link from "next/link";
import { Oswald } from "next/font/google";
import { CheckCircle2, Mail, Phone, UserPlus } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Thank You for Registering — Bihar Got Talent | Kalakaar Studios",
  description:
    "Your Bihar Got Talent artist registration is in. Our team reviews every entry and reaches out by phone or email if you're shortlisted.",
};

export default function ThankYouPage() {
  return (
    <div className={`${oswald.variable} flex min-h-full flex-col bg-cream text-ink`}>
      <Header />

      <main className="flex flex-1 items-center justify-center px-5 py-16 sm:px-8">
        <div className="w-full max-w-xl border-2 border-ink bg-white p-8 text-center shadow-[8px_8px_0px_0px_var(--color-ink)] sm:p-12">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-ink bg-sun shadow-[4px_4px_0px_0px_var(--color-ink)]">
            <CheckCircle2 className="h-8 w-8" strokeWidth={2.5} />
          </span>

          <h1 className="mt-6 font-blocky text-3xl font-bold uppercase leading-[1.05] tracking-tight sm:text-4xl">
            Thank You for
            <br />
            Registering!
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm font-medium leading-relaxed text-ink/70 sm:text-base">
            Your entry for Bihar Got Talent is on the roster. Our team reviews
            every registration carefully — if you&apos;re shortlisted for the
            auditions, we&apos;ll reach out through the details you shared.
          </p>

          <div className="mx-auto mt-6 flex max-w-sm flex-col gap-3 text-left sm:flex-row">
            <p className="flex flex-1 items-center gap-2 rounded border-2 border-ink bg-cream px-3 py-2 text-xs font-bold uppercase tracking-wide">
              <Phone className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
              <span className="truncate leading-snug">Phone call / WhatsApp</span>
            </p>
            <p className="flex flex-1 items-center gap-2 rounded border-2 border-ink bg-cream px-3 py-2 text-xs font-bold uppercase tracking-wide">
              <Mail className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
              <span className="truncate leading-snug">Or email — soon</span>
            </p>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/events/bihar-got-talent"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink bg-sun px-6 py-3 text-sm font-bold uppercase tracking-wide text-ink shadow-[4px_4px_0px_0px_var(--color-ink)] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_var(--color-ink)]"
            >
              Back to Bihar Got Talent
            </Link>
            <Link
              href="/register/artist"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink bg-white px-6 py-3 text-sm font-bold uppercase tracking-wide text-ink transition-colors hover:bg-sun/40"
            >
              <UserPlus className="h-4 w-4" strokeWidth={2.5} />
              Register another artist
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}