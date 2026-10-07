import type { Metadata } from "next";
import Link from "next/link";
import { Oswald } from "next/font/google";
import { ArrowLeft, BellRing } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NotificationCenter from "@/components/notifications/NotificationCenter";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Notification Center | Kalakaar Studios",
  description:
    "Audition calls, shortlist updates and showcase announcements for artists registered with the Kalakaar Studios Artist Network — Bihar Got Talent.",
};

export default function NotificationsPage() {
  return (
    <div className={`${oswald.variable} flex min-h-full flex-col bg-cream text-ink`}>
      <Header />

      <main className="flex-1">
        <section className="border-b-2 border-ink bg-sun/30">
          <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-ink/60 transition-colors hover:text-ink"
            >
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
              Home
            </Link>

            <span className="mt-5 inline-flex -rotate-1 items-center gap-2 border-2 border-ink bg-sun px-3 py-1.5 text-xs font-bold uppercase tracking-widest shadow-[3px_3px_0px_0px_#000000]">
              <BellRing className="h-3.5 w-3.5" strokeWidth={2.5} />
              Artist Network
            </span>

            <h1 className="mt-5 font-blocky text-4xl font-bold uppercase leading-[1.02] tracking-tight sm:text-5xl">
              Notification{" "}
              <span className="relative z-0 inline-block whitespace-nowrap">
                <svg
                  viewBox="0 0 150 26"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  className="absolute left-0 top-[30%] -z-10 h-[115%] w-full"
                >
                  <path
                    d="M3 20 C 30 5, 90 5, 117 14"
                    stroke="#F2EE07"
                    strokeWidth="13"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                Center
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm font-medium leading-relaxed text-ink/70 sm:text-base">
              Every audition update, shortlist notice and call for performers
              for the Bihar Got Talent roster — in one place.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
          <NotificationCenter />
        </section>
      </main>

      <Footer />
    </div>
  );
}
