/**
 * Single source of truth for the /events page and the homepage events preview.
 *
 * `eventDate` is an ISO 8601 timestamp and is the only field the Live / Upcoming
 * / Past split is derived from (see `groupEvents` in src/lib/events.ts) — an
 * event moves Upcoming → Live → Past on its own as the clock passes it, so
 * nothing here has to be re-flagged by hand.
 *
 * `endsAt` is optional: omit it for a single-evening show and the library
 * assumes a default run time. Set it for multi-day festivals and residencies.
 *
 * Once the CRM grows an `/events` endpoint this file becomes the offline
 * fallback — `fetchEvents()` in src/lib/events.ts prefers live data.
 */

export type EventCategory =
  | "Concert"
  | "Festival"
  | "Corporate Gala"
  | "Brand Activation"
  | "Esports"
  | "Community"
  | "Wedding";

export type Event = {
  id: string;
  title: string;
  /** ISO 8601 start timestamp, e.g. "2026-11-07T18:30:00+05:30". */
  eventDate: string;
  /** ISO 8601 end timestamp. Omit for a single-evening show. */
  endsAt?: string;
  /** Curated show window, e.g. "6:00 PM – 11:00 PM IST". */
  timeLabel: string;
  venue: string;
  city: string;
  category: EventCategory;
  bannerImage: string;
  shortDescription: string;
  /** Ticket / booking destination. Defaults to the studio booking form. */
  bookingUrl?: string;
  /** Overrides the CTA wording, e.g. "Reserve Seats". */
  ticketLabel?: string;
  /** Recap bullets surfaced on the card once a past event's highlights open. */
  highlights?: string[];
  /** Head-count stat shown on the past-event recap. */
  attendance?: string;
};

/** Used whenever an event has no ticketing partner of its own. */
export const DEFAULT_BOOKING_URL = "/#contact";

export const events: Event[] = [
  {
    id: "warehouse-sessions-oct-2026",
    title: "Warehouse Sessions: Patna",
    eventDate: "2026-09-30T19:00:00+05:30",
    endsAt: "2026-10-01T01:00:00+05:30",
    timeLabel: "7:00 PM – 1:00 AM IST",
    venue: "The Old Mill Compound",
    city: "Patna",
    category: "Concert",
    bannerImage: "/gallery/event1.png",
    shortDescription:
      "Three acts, one restored mill floor, and a rig we rebuilt from scratch over nine days. Limited standing tickets, no bar tab nonsense.",
    ticketLabel: "Get Tickets",
  },
  {
    id: "techsprint-2026",
    title: "TechSprint 2026: Arena Finals",
    eventDate: "2026-09-30T15:00:00+05:30",
    endsAt: "2026-10-02T22:00:00+05:30",
    timeLabel: "3:00 PM, Sep 30 – 10:00 PM, Oct 2",
    venue: "Maurya Lok Convention Centre — Hall A",
    city: "Patna",
    category: "Esports",
    bannerImage: "/gallery/event2.png",
    shortDescription:
      "Three days, sixteen teams, one arena. We handled the stage build, the LED volume, and the broadcast gallery end to end.",
    ticketLabel: "Reserve Seats",
  },
  {
    id: "brand-launch-monsoon-edit",
    title: "The Monsoon Edit — Pop-up Launch",
    eventDate: "2026-10-18T11:00:00+05:30",
    timeLabel: "11:00 AM – 9:00 PM IST",
    venue: "Emporio One, Atrium Level",
    city: "Kolkata",
    category: "Brand Activation",
    bannerImage: "/gallery/event5.png",
    shortDescription:
      "A walk-through pop-up built to be photographed: kinetic lighting façade, live print bar, and a DJ set that ran to closing.",
    ticketLabel: "Book a Slot",
  },
  {
    id: "diwali-bashas-2026",
    title: "Diwali Bashas: The Grand Concert",
    eventDate: "2026-11-07T18:30:00+05:30",
    timeLabel: "6:30 PM – 11:30 PM IST",
    venue: "Patliputra Sports Complex — Main Arena",
    city: "Patna",
    category: "Festival",
    bannerImage: "/gallery/event8.png",
    shortDescription:
      "Our biggest night of the year. A 60-foot stage, pyro on cue, and four headliners across a six-hour fireworks-and-loudness show.",
    ticketLabel: "Early Bird Now",
  },
  {
    id: "kalakaar-awards-2026",
    title: "The Kalakaar Awards 2026",
    eventDate: "2026-12-12T19:00:00+05:30",
    timeLabel: "7:00 PM – 11:00 PM IST",
    venue: "Maurya Lok Convention Centre",
    city: "Patna",
    category: "Corporate Gala",
    bannerImage: "/gallery/event3.png",
    shortDescription:
      "Our own night of the year — awards, a twelve-piece live band, and the clients and crews who made the year worth celebrating.",
    ticketLabel: "Request an Invite",
  },
  {
    id: "winter-wedding-2027",
    title: "Winter Wedding Showcase",
    eventDate: "2027-01-24T16:00:00+05:30",
    endsAt: "2027-01-26T23:00:00+05:30",
    timeLabel: "4:00 PM, Jan 24 – 11:00 PM, Jan 26",
    venue: "Tajnessar Heritage Estate",
    city: "Ranchi",
    category: "Wedding",
    bannerImage: "/gallery/event4.png",
    shortDescription:
      "A two-day, three-function celebration across the estate — mehndi, sangeet, and a baraat we cued entirely from the booth.",
    ticketLabel: "Check Availability",
  },
  {
    id: "monsoon-beats-2026",
    title: "Monsoon Beats Festival",
    eventDate: "2026-08-16T16:00:00+05:30",
    timeLabel: "4:00 PM – 11:00 PM IST",
    venue: "Gandhi Maidan — South Lawn",
    city: "Patna",
    category: "Festival",
    bannerImage: "/gallery/event6.png",
    shortDescription:
      "Twelve artists, two stages, one very wet monsoon. The rain landed at load-out and made the crowd better, not worse.",
    highlights: [
      "12 artists across 2 stages in 7 hours",
      "Monsoon-proofed rigging held through 60mm of rain",
      "Zero medical incidents across 12,000 guests",
    ],
    attendance: "12,000 attendees",
  },
  {
    id: "ssociopro-10-year",
    title: "Ssociopro 10th Anniversary Gala",
    eventDate: "2026-06-27T19:30:00+05:30",
    timeLabel: "7:30 PM – 11:00 PM IST",
    venue: "Hotel Maurya — Grand Ballroom",
    city: "Patna",
    category: "Corporate Gala",
    bannerImage: "/gallery/event7.png",
    shortDescription:
      "A decade of client parties in one room. Timeline reel, live brass band, and a dinner service for 400 that hit on time.",
    highlights: [
      "400 guests seated and served in 55 minutes",
      "Live 10-year timeline reel synced to the band",
      "Client award handed out on a rolling stage",
    ],
    attendance: "400 attendees",
  },
  {
    id: "street-food-sunday",
    title: "Street Food & Music Sunday",
    eventDate: "2026-05-10T11:00:00+05:30",
    timeLabel: "11:00 AM – 9:00 PM IST",
    venue: "Kadam Kuan Footcourt",
    city: "Patna",
    category: "Community",
    bannerImage: "/gallery/event1.png",
    shortDescription:
      "Thirty stalls, six local bands, and a stage we built and broke down inside 36 hours. Our favourite kind of weekend.",
    highlights: [
      "30 food stalls, 6 local bands, 1 very long queue",
      "Full build-to-strike in 36 hours",
      "Zero waste cleared to a certified recycler",
    ],
    attendance: "8,500 attendees",
  },
  {
    id: "e-auction-live",
    title: "E-Auction Live Broadcast",
    eventDate: "2026-03-22T11:00:00+05:30",
    timeLabel: "11:00 AM – 4:00 PM IST",
    venue: "RZPD Convention Centre",
    city: "Patna",
    category: "Brand Activation",
    bannerImage: "/gallery/event5.png",
    shortDescription:
      "A hybrid auction: 180 bidders in the room, 2,100 online, and a broadcast gallery that ran bid-to-hammer without a single dropout.",
    highlights: [
      "2,100 remote bidders on a 3-stream setup",
      "Bid-to-hammer latency held under 2 seconds",
      "Hammered out 100% of the listed lots",
    ],
    attendance: "180 in-room bidders",
  },
  {
    id: "republic-day-concert",
    title: "Republic Day Concert",
    eventDate: "2026-01-26T09:00:00+05:30",
    timeLabel: "9:00 AM – 1:00 PM IST",
    venue: "Gandhi Maidan — Main Stage",
    city: "Patna",
    category: "Concert",
    bannerImage: "/gallery/event2.png",
    shortDescription:
      "A morning concert with a brass band, a fly-past cue, and a stage struck before the afternoon parade took the ground.",
    highlights: [
      "Morning rehearsal against a live fly-past cue",
      "Struck and cleared in 3 hours flat",
      "Full brass band on a 40-foot stage",
    ],
    attendance: "15,000 attendees",
  },
];
