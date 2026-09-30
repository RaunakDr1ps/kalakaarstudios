import type { Metadata } from "next";
import { CalendarDays, MapPin, Radio, Ticket } from "lucide-react";
import { Oswald } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchEvents, groupEvents } from "@/lib/events";
import EventsClient from "./EventsClient";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Events | Kalakaar Studios",
  description:
    "Live now, upcoming, and past — every concert, festival, gala, and brand activation Kalakaar Studios has on stage, with dates, venues, and tickets.",
};

export default async function EventsPage() {
  // Static export: this resolves at build time. `fetchedAt` becomes the
  // prerendered bucketing reference so the first client render matches the HTML
  // exactly; EventsClient then re-stamps it from a live refresh on mount.
  const { events, fetchedAt } = await fetchEvents();
  const { live, upcoming } = groupEvents(events, fetchedAt);

  return (
    <div className={`${oswald.variable} flex min-h-full flex-col bg-cream text-ink`}>
      <Header />

      <main className="flex-1">
        <section className="border-b-2 border-ink bg-sun/30">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
            <span className="inline-flex -rotate-1 items-center gap-2 border-2 border-ink bg-sun px-3 py-1.5 text-xs font-bold uppercase tracking-widest shadow-[3px_3px_0px_0px_var(--color-ink)]">
              <CalendarDays className="h-3.5 w-3.5" strokeWidth={2.5} />
              The Events Calendar
            </span>

            <h1 className="mt-5 font-blocky text-4xl font-bold uppercase leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
              Live now, booked
              <br />
              next, and{" "}
              <span className="relative z-0 inline-block whitespace-nowrap">
                <svg
                  viewBox="0 0 120 26"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  className="absolute left-0 top-[30%] -z-10 h-[115%] w-full"
                >
                  <path
                    d="M3 20 C 30 5, 90 5, 117 14"
                    stroke="#F2EE07"
                    strokeWidth="12"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                already
              </span>{" "}
              done.
            </h1>

            <p className="mt-5 max-w-2xl text-sm font-medium leading-relaxed text-ink/70 sm:text-base">
              Every show the studio has on stage, on deck, or already ran. Dates
              and statuses update themselves from the calendar — check back before
              you plan a night out.
            </p>

            <dl className="mt-8 flex flex-wrap gap-3">
              {[
                { icon: Radio, label: `${live.length} live now` },
                { icon: Ticket, label: `${upcoming.length} upcoming` },
                { icon: MapPin, label: "12 cities" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-2 border-2 border-ink bg-cream px-3.5 py-2 text-xs font-bold uppercase tracking-wide shadow-[3px_3px_0px_0px_var(--color-ink)]"
                >
                  <stat.icon className="h-4 w-4" strokeWidth={2.5} />
                  {stat.label}
                </div>
              ))}
            </dl>
          </div>
        </section>

        <EventsClient initialEvents={events} builtAt={fetchedAt} />
      </main>

      <Footer />
    </div>
  );
}
