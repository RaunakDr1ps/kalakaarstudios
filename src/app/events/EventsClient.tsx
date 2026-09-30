"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarPlus, History, Radio, Sparkles } from "lucide-react";
import EventCard from "@/components/events/EventCard";
import {
  fetchEvents,
  groupEvents,
  type Event,
  type EventBucketId,
} from "@/lib/events";

const TABS: {
  id: EventBucketId;
  label: string;
  eyebrow: string;
  heading: string;
  blurb: string;
  icon: typeof Radio;
  empty: string;
}[] = [
  {
    id: "live",
    label: "Live Now",
    eyebrow: "On the ground",
    heading: "Happening right now",
    blurb:
      "Shows running today — doors, stages, and show-calls in motion. Walk-up tickets only if the room allows it.",
    icon: Radio,
    empty: "Nothing on stage today. The next show is already in the build.",
  },
  {
    id: "upcoming",
    label: "Upcoming Events",
    eyebrow: "On the calendar",
    heading: "Booked, scoped, scheduled",
    blurb:
      "Every confirmed date on the studio calendar, with ticketing and booking handled by the same crew that runs the show.",
    icon: CalendarPlus,
    empty: "No dates locked yet. Send us a brief and we'll put one on the board.",
  },
  {
    id: "past",
    label: "Past Events",
    eyebrow: "The archive",
    heading: "Shows we've already run",
    blurb:
      "Completed productions with head-counts, recaps, and the photo sets our crews shot on the night.",
    icon: History,
    empty: "The archive is empty. It won't stay that way.",
  },
];

export default function EventsClient({
  initialEvents,
  builtAt,
}: {
  initialEvents: Event[];
  builtAt: number;
}) {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  // Seeded with the build timestamp so the prerendered HTML and the first
  // client render bucket against the same instant — no hydration mismatch on a
  // site that ships as a static export. The refresh effect below swaps in the
  // visitor's real clock as soon as it resolves.
  const [now, setNow] = useState(builtAt);
  const [preferredTab, setPreferredTab] = useState<EventBucketId | null>(null);

  const groups = useMemo(() => groupEvents(events, now), [events, now]);

  useEffect(() => {
    let active = true;
    // Picks up rows from the CRM if an /events route is ever live, and carries
    // the visitor's real clock back with it. The static export keeps whatever
    // the build produced when the refresh doesn't respond.
    fetchEvents()
      .then((snapshot) => {
        if (!active) return;
        if (snapshot.events.length > 0) setEvents(snapshot.events);
        setNow(snapshot.fetchedAt);
      })
      .catch(() => {
        // Keep the build-time data and its timestamp.
      });
    return () => {
      active = false;
    };
  }, []);

  // Derived rather than stored: an emptied tab falls back to the next section
  // that actually has events, so a long-past calendar can't strand the visitor
  // on an empty panel.
  const fallbackTab =
    TABS.find((entry) => groups[entry.id].length > 0)?.id ?? TABS[0].id;
  const activeTab =
    preferredTab && groups[preferredTab].length > 0 ? preferredTab : fallbackTab;

  const tab = TABS.find((entry) => entry.id === activeTab) ?? TABS[0];
  const visible = groups[tab.id];

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <div
        role="tablist"
        aria-label="Event status"
        className="flex flex-wrap justify-center gap-3"
      >
        {TABS.map((entry) => {
          const isActive = entry.id === activeTab;
          const count = groups[entry.id].length;
          return (
            <button
              key={entry.id}
              type="button"
              role="tab"
              id={`events-tab-${entry.id}`}
              aria-selected={isActive}
              aria-controls={`events-panel-${entry.id}`}
              onClick={() => setPreferredTab(entry.id)}
              className={`inline-flex items-center gap-2 rounded-full border-2 border-ink px-5 py-2.5 text-xs font-bold uppercase tracking-wide transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_var(--color-ink)] ${
                isActive
                  ? "bg-ink text-cream shadow-[4px_4px_0px_0px_var(--color-ink)]"
                  : "bg-cream text-ink"
              }`}
            >
              <entry.icon className="h-4 w-4" strokeWidth={2.5} />
              {entry.label}
              <span
                className={`flex h-5 min-w-5 items-center justify-center border-2 px-1 text-[10px] ${
                  isActive
                    ? "border-cream bg-sun text-ink"
                    : "border-ink bg-sun text-ink"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`events-panel-${tab.id}`}
        aria-labelledby={`events-tab-${tab.id}`}
        className="mt-10"
      >
        <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-ink pb-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-ink/50">
              {tab.eyebrow}
            </p>
            <h2 className="mt-2 font-blocky text-3xl font-bold uppercase tracking-tight sm:text-4xl">
              {tab.heading}
            </h2>
          </div>
          <p className="max-w-sm text-sm font-medium leading-relaxed text-ink/60">
            {tab.blurb}
          </p>
        </div>

        {visible.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                now={now}
                tilt={index % 2 === 0 ? 1 : -1}
              />
            ))}
          </div>
        ) : (
          <div className="mt-8 flex flex-col items-center gap-4 border-2 border-dashed border-ink py-16 text-center">
            <span className="flex h-14 w-14 -rotate-3 items-center justify-center border-2 border-ink bg-sun">
              <Sparkles className="h-6 w-6" strokeWidth={2.25} />
            </span>
            <p className="max-w-sm text-sm font-medium leading-relaxed text-ink/60">
              {tab.empty}
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-red px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white shadow-[3px_3px_0px_0px_var(--color-ink)] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_var(--color-ink)]"
            >
              Book a Call
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
