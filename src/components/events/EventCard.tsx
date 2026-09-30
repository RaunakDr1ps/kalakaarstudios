"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Images,
  MapPin,
  Sparkles,
  Ticket,
  Users,
} from "lucide-react";
import ImageWithFallback from "@/components/blog/ImageWithFallback";
import {
  bucketOf,
  countdownLabel,
  eventStart,
  formatEventDate,
  formatEventDateLong,
  formatEventMonth,
  getBookingUrl,
  type Event,
} from "@/lib/events";

const chipStyles = {
  live: "bg-red text-white",
  upcoming: "bg-sun text-ink",
  past: "bg-ink text-cream",
} as const;

const chipLabels = {
  live: "Live Now",
  upcoming: "Upcoming",
  past: "Past Event",
} as const;

function ActionLink({ event }: { event: Event }) {
  const href = getBookingUrl(event);
  const className =
    "inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-ink px-5 py-2.5 text-xs font-bold uppercase tracking-wide shadow-[3px_3px_0px_0px_var(--color-ink)] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_var(--color-ink)]";

  const inner = (
    <>
      {event.ticketLabel ?? "Book Now"}
      <Ticket className="h-4 w-4" strokeWidth={2.5} />
    </>
  );

  if (/^https?:\/\//i.test(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${className} bg-red text-white`}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={`${className} bg-red text-white`}>
      {inner}
    </Link>
  );
}

export default function EventCard({
  event,
  now,
  tilt = 0,
}: {
  event: Event;
  now: number;
  tilt?: number;
}) {
  const [highlightsOpen, setHighlightsOpen] = useState(false);
  const bucket = bucketOf(event, now);
  const isPast = bucket === "past";
  const venue = [event.venue, event.city].filter(Boolean).join(", ");
  const isTilted = tilt !== 0;

  return (
    <article
      className={`group flex flex-col border-2 border-ink bg-cream shadow-[6px_6px_0px_0px_var(--color-ink)] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_var(--color-ink)] ${
        isTilted ? tilt > 0 ? "rotate-[0.75deg]" : "-rotate-[0.75deg]" : ""
      }`}
    >
      <div className="relative overflow-hidden border-b-2 border-ink bg-white">
        {event.bannerImage ? (
          <ImageWithFallback
            src={event.bannerImage}
            alt={`${event.title} — Kalakaar Studios`}
            className="aspect-[16/9] w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            className="flex aspect-[16/9] w-full items-center justify-center bg-sun"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(0,0,0,0.12) 1.5px, transparent 1.5px)",
              backgroundSize: "18px 18px",
            }}
          >
            <Image
              src="/logo.png"
              alt="Kalakaar Studios"
              width={1024}
              height={1024}
              className="h-14 w-14 border-2 border-ink object-cover"
            />
          </div>
        )}

        <span
          className={`absolute left-3 top-3 inline-flex items-center gap-1.5 border-2 border-ink px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest shadow-[2px_2px_0px_0px_var(--color-ink)] ${chipStyles[bucket]}`}
        >
          {bucket === "live" && (
            <span className="live-dot flex h-2 w-2 rounded-full bg-current" />
          )}
          {bucket === "upcoming"
            ? countdownLabel(event.eventDate, now)
            : chipLabels[bucket]}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50">
          {event.category}
        </p>

        <h3 className="mt-2 font-blocky text-xl font-bold uppercase leading-snug tracking-tight">
          {event.title}
        </h3>

        <div className="mt-4 space-y-2 text-sm font-medium text-ink/70">
          <p className="flex items-start gap-2">
            <CalendarDays
              className="mt-0.5 h-4 w-4 shrink-0"
              strokeWidth={2.25}
            />
            <span>
              {isPast
                ? formatEventMonth(eventStart(event))
                : formatEventDateLong(eventStart(event))}
              {event.timeLabel && (
                <span className="block text-xs text-ink/55">{event.timeLabel}</span>
              )}
            </span>
          </p>

          <p className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.25} />
            <span>{venue}</span>
          </p>

          {isPast && event.attendance && (
            <p className="flex items-start gap-2">
              <Users className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.25} />
              <span>{event.attendance}</span>
            </p>
          )}
        </div>

        {event.shortDescription && (
          <p className="mt-4 flex-1 text-sm font-medium leading-relaxed text-ink/65">
            {event.shortDescription}
          </p>
        )}

        {isPast ? (
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setHighlightsOpen((open) => !open)}
              aria-expanded={highlightsOpen}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-ink bg-cream px-5 py-2.5 text-xs font-bold uppercase tracking-wide shadow-[3px_3px_0px_0px_var(--color-ink)] transition-all hover:-translate-y-0.5 hover:bg-sun hover:shadow-[5px_5px_0px_0px_var(--color-ink)]"
            >
              <Images className="h-4 w-4" strokeWidth={2.5} />
              {highlightsOpen ? "Hide Highlights" : "View Highlights"}
              <ArrowRight
                className={`h-4 w-4 transition-transform ${highlightsOpen ? "rotate-90" : ""}`}
                strokeWidth={2.5}
              />
            </button>

            {highlightsOpen && (
              <div className="mt-4 border-2 border-ink bg-sun/40 p-4">
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/60">
                  <Sparkles className="h-3 w-3" strokeWidth={2.5} />
                  Recap · {formatEventDate(eventStart(event))}
                </p>

                {event.highlights?.length ? (
                  <ul className="mt-3 space-y-2">
                    {event.highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="flex items-start gap-2 text-sm font-medium leading-relaxed text-ink/75"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-red" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm font-medium leading-relaxed text-ink/65">
                    Full photo set and production breakdown for this show are in
                    the gallery.
                  </p>
                )}

                <Link
                  href="/gallery"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide underline decoration-2 underline-offset-4 hover:decoration-red"
                >
                  See the photo set
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-6">
            <ActionLink event={event} />
            {bucket === "live" && (
              <p className="mt-2 text-center text-[10px] font-bold uppercase tracking-widest text-red">
                Doors open · Show running
              </p>
            )}
          </div>
        )}
      </div>

      {bucket === "past" && event.bannerImage && (
        <Link
          href="/gallery"
          className="flex items-center justify-center gap-1.5 border-t-2 border-ink/10 px-5 py-3 text-xs font-bold uppercase tracking-widest text-ink/40 transition-colors hover:text-ink"
        >
          <Images className="h-3.5 w-3.5" strokeWidth={2.5} />
          Event imagery
        </Link>
      )}
    </article>
  );
}
