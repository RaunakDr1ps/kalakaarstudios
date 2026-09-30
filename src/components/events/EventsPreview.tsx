"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, Radio } from "lucide-react";
import EventCard from "@/components/events/EventCard";
import { fetchEvents, featuredEvents, groupEvents, type Event } from "@/lib/events";

export default function EventsPreview() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(0);

  useEffect(() => {
    let active = true;
    fetchEvents()
      .then((snapshot) => {
        if (!active) return;
        setEvents(snapshot.events);
        setNow(snapshot.fetchedAt);
      })
      .catch(() => {
        if (active) setEvents([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const preview = useMemo(
    () => featuredEvents(events, 3, now),
    [events, now]
  );
  const { live, upcoming, past } = useMemo(
    () => groupEvents(events, now),
    [events, now]
  );

  // The section chrome and the "View All Events" CTA render unconditionally so
  // they survive into the static export; only the card grid waits on the fetch.
  return (
    <section className="border-t-2 border-ink bg-cream">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex -rotate-1 items-center gap-2 border-2 border-ink bg-sun px-3 py-1.5 text-xs font-bold uppercase tracking-widest shadow-[3px_3px_0px_0px_var(--color-ink)]">
              <CalendarDays className="h-3.5 w-3.5" strokeWidth={2.5} />
              Upcoming Events
            </span>
            <h2 className="mt-5 font-blocky text-3xl font-bold uppercase tracking-tight sm:text-4xl">
              What&apos;s on the{" "}
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
                calendar.
              </span>
            </h2>

            {!loading && (
              <div className="mt-5 flex flex-wrap items-center gap-2.5 text-xs font-bold uppercase tracking-widest text-ink/50">
                <span className="inline-flex items-center gap-1.5">
                  <Radio className="h-3.5 w-3.5 text-red" strokeWidth={2.5} />
                  {live.length} live now
                </span>
                <span className="h-1.5 w-1.5 rotate-45 bg-ink/30" />
                <span>{upcoming.length} upcoming</span>
                <span className="h-1.5 w-1.5 rotate-45 bg-ink/30" />
                <span>{past.length} in the archive</span>
              </div>
            )}
          </div>

          <Link
            href="/events"
            className="group inline-flex items-center gap-2 rounded-full border-2 border-ink bg-red px-6 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-[4px_4px_0px_0px_var(--color-ink)] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_var(--color-ink)]"
          >
            View All Events
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              strokeWidth={2.5}
            />
          </Link>
        </div>

        {loading ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                aria-hidden="true"
                className="h-96 animate-pulse border-2 border-dashed border-ink/30"
              />
            ))}
          </div>
        ) : preview.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {preview.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                now={now}
                tilt={index % 2 === 0 ? 1 : -1}
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 border-2 border-dashed border-ink py-14 text-center">
            <p className="font-blocky text-xl font-bold uppercase tracking-tight">
              No dates on the board yet
            </p>
            <p className="mx-auto mt-2 max-w-sm px-6 text-sm font-medium leading-relaxed text-ink/60">
              Our calendar opens up every few weeks. Send a brief and we&apos;ll
              lock a date in with you.
            </p>
            <Link
              href="/#contact"
              className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-sun px-6 py-3 text-sm font-bold uppercase tracking-wide shadow-[4px_4px_0px_0px_var(--color-ink)] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_var(--color-ink)]"
            >
              Book a Call
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
