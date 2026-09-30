import {
  DEFAULT_BOOKING_URL,
  events as staticEvents,
  type Event,
  type EventCategory,
} from "@/data/events";

export { DEFAULT_BOOKING_URL };
export type { Event, EventCategory };

export const CRM_API_URL =
  process.env.NEXT_PUBLIC_CRM_API_URL ?? "https://crm.kalakaarstudios.co.in/api";

/**
 * Asia/Kolkata is a fixed +05:30 with no DST, so every date comparison here is
 * done against a constant offset instead of `Intl`/local time. That keeps the
 * Live / Upcoming / Past split identical between the static build (which runs
 * on a UTC build machine) and the visitor's browser, and sidesteps the
 * server/client locale drift that triggers hydration mismatches.
 */
const IST_OFFSET_MS = 330 * 60 * 1000;

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Assumed length of a show with no explicit `endsAt`. */
const DEFAULT_DURATION_MS = 8 * 60 * 60 * 1000;

export type EventBucketId = "live" | "upcoming" | "past";

export const EVENT_BUCKETS: EventBucketId[] = ["live", "upcoming", "past"];

function toMs(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? fallback : parsed;
}

export function eventStart(event: Event): number {
  return toMs(event.eventDate, 0);
}

export function eventEnd(event: Event): number {
  const start = eventStart(event);
  const end = toMs(event.endsAt, start + DEFAULT_DURATION_MS);
  return end > start ? end : start + DEFAULT_DURATION_MS;
}

function shiftedToStudio(ms: number): Date {
  return new Date(ms + IST_OFFSET_MS);
}

/** "YYYY-MM-DD" in studio time — comparable as a plain string. */
function studioDayKey(ms: number): string {
  const d = shiftedToStudio(ms);
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${d.getUTCFullYear()}-${month}-${day}`;
}

/**
 * Live = running now, or on show today (including an evening set that hasn't
 * started yet), or mid-way through a multi-day residency.
 * Upcoming = starts on a later calendar day.
 * Past = already finished.
 */
export function bucketOf(event: Event, now: number = Date.now()): EventBucketId {
  if (eventEnd(event) <= now) return "past";
  if (studioDayKey(eventStart(event)) > studioDayKey(now)) return "upcoming";
  return "live";
}

export type EventGroups = Record<EventBucketId, Event[]>;

export function groupEvents(
  list: readonly Event[],
  now: number = Date.now()
): EventGroups {
  const groups: EventGroups = { live: [], upcoming: [], past: [] };

  for (const event of list) {
    groups[bucketOf(event, now)].push(event);
  }

  groups.live.sort((a, b) => eventStart(a) - eventStart(b));
  groups.upcoming.sort((a, b) => eventStart(a) - eventStart(b));
  groups.past.sort((a, b) => eventEnd(b) - eventEnd(a));

  return groups;
}

/** Live first, then the soonest upcoming — what the homepage preview leads with. */
export function featuredEvents(
  list: readonly Event[],
  limit = 3,
  now: number = Date.now()
): Event[] {
  const { live, upcoming } = groupEvents(list, now);
  return [...live, ...upcoming].slice(0, limit);
}

export function getBookingUrl(event: Event): string {
  return event.bookingUrl?.trim() || DEFAULT_BOOKING_URL;
}

export function formatEventDate(value: string | number): string {
  const d = shiftedToStudio(typeof value === "number" ? value : toMs(value, 0));
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function formatEventDateLong(value: string | number): string {
  const d = shiftedToStudio(typeof value === "number" ? value : toMs(value, 0));
  return `${WEEKDAYS[d.getUTCDay()]}, ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** Countdown chip for upcoming events: "Tomorrow", "In 12 days", "Today". */
export function countdownLabel(value: string, now: number = Date.now()): string {
  const todayKey = studioDayKey(now);
  const targetKey = studioDayKey(toMs(value, now));
  if (targetKey === todayKey) return "Today";

  const today = shiftedToStudio(now);
  const target = shiftedToStudio(toMs(value, now));
  const todayMidnight = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate()
  );
  const targetMidnight = Date.UTC(
    target.getUTCFullYear(),
    target.getUTCMonth(),
    target.getUTCDate()
  );
  const days = Math.round((targetMidnight - todayMidnight) / 86_400_000);

  if (days === 1) return "Tomorrow";
  if (days > 1 && days <= 30) return `In ${days} days`;
  return formatEventDate(value);
}

/** Year-and-up for archive cards: "Mar 2026". */
export function formatEventMonth(value: string | number): string {
  const d = shiftedToStudio(typeof value === "number" ? value : toMs(value, 0));
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

type RawEvent = {
  id?: string;
  title?: string;
  event_date?: string;
  eventDate?: string;
  start_date?: string;
  starts_at?: string;
  date?: string;
  ends_at?: string;
  endsAt?: string;
  time_label?: string;
  timeLabel?: string;
  venue?: string;
  location?: string;
  city?: string;
  category?: string;
  banner_image?: string;
  bannerImage?: string;
  image?: string;
  short_description?: string;
  shortDescription?: string;
  description?: string;
  booking_url?: string;
  bookingUrl?: string;
  ticket_url?: string;
  ticketLabel?: string;
  highlights?: string[] | string;
  attendance?: string;
};

const CATEGORIES: EventCategory[] = [
  "Concert",
  "Festival",
  "Corporate Gala",
  "Brand Activation",
  "Esports",
  "Community",
  "Wedding",
];

function firstText(...candidates: Array<string | null | undefined>): string {
  const found = candidates.find(
    (value): value is string => typeof value === "string" && value.trim().length > 0
  );
  return found ? found.trim() : "";
}

function toCategory(value: string | undefined): EventCategory {
  const match = CATEGORIES.find(
    (category) => category.toLowerCase() === value?.trim().toLowerCase()
  );
  return match ?? "Community";
}

function toHighlights(value: RawEvent["highlights"]): string[] | undefined {
  if (Array.isArray(value)) {
    const list = value.filter((item) => typeof item === "string" && item.trim());
    return list.length ? list : undefined;
  }
  if (typeof value === "string" && value.trim()) {
    return value
      .split("\n")
      .map((line) => line.replace(/^[-*•\s]+/, "").trim())
      .filter(Boolean);
  }
  return undefined;
}

/**
 * Folds the field-name variants the CRM is known to use into the canonical
 * `Event` shape. Returns null for rows without a title or a parseable date so
 * one malformed record can't take the whole page down.
 */
function normalizeEvent(raw: RawEvent, index: number): Event | null {
  const title = firstText(raw.title);
  const eventDate = firstText(
    raw.eventDate,
    raw.event_date,
    raw.starts_at,
    raw.start_date,
    raw.date
  );

  if (!title || !eventDate || Number.isNaN(Date.parse(eventDate))) return null;

  return {
    id: firstText(raw.id) || `event-${index}`,
    title,
    eventDate,
    endsAt: firstText(raw.endsAt, raw.ends_at) || undefined,
    timeLabel: firstText(raw.timeLabel, raw.time_label) || "Timings to be announced",
    venue: firstText(raw.venue, raw.location) || "Venue to be announced",
    city: firstText(raw.city),
    category: toCategory(raw.category),
    bannerImage: firstText(raw.bannerImage, raw.banner_image, raw.image),
    shortDescription: firstText(
      raw.shortDescription,
      raw.short_description,
      raw.description
    ),
    bookingUrl:
      firstText(raw.bookingUrl, raw.booking_url, raw.ticket_url) || undefined,
    ticketLabel: firstText(raw.ticketLabel) || undefined,
    highlights: toHighlights(raw.highlights),
    attendance: firstText(raw.attendance) || undefined,
  };
}

/**
 * An events list plus the instant it was taken. `fetchedAt` is the reference
 * point for bucketing: the server stamps it at build time (so the prerendered
 * HTML and the first client render agree) and the client re-stamps it on
 * refresh, which keeps a static export from ever rendering a stale calendar.
 */
export type EventSnapshot = {
  events: Event[];
  fetchedAt: number;
};

/**
 * Reads events from the CRM (`GET {CRM_API_URL}/events`) and falls back to the
 * static data file. The CRM does not expose an events route yet, so today this
 * always resolves to the bundled data — the moment it does, live rows win and
 * the static file stays as the offline/default source. Failures are silent by
 * design: this runs on every client mount, and an absent route is expected.
 */
export async function fetchEvents(): Promise<EventSnapshot> {
  const fetchedAt = Date.now();

  try {
    const res = await fetch(`${CRM_API_URL}/events`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return { events: staticEvents, fetchedAt };

    const rows: unknown = await res.json();
    if (!Array.isArray(rows)) return { events: staticEvents, fetchedAt };

    const normalized = rows
      .map((row, index) => normalizeEvent(row as RawEvent, index))
      .filter((event): event is Event => event !== null);

    return {
      events: normalized.length ? normalized : staticEvents,
      fetchedAt,
    };
  } catch {
    return { events: staticEvents, fetchedAt };
  }
}
