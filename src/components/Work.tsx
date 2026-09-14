const events = [
  {
    category: "Live Concert Series",
    title: "Sunburn Campus — Live Concert Series",
    location: "Mumbai, Maharashtra",
    attendees: "8,600+ attendees",
    highlights: "Stage Design, A/V Production, Crowd Control",
    period: "2025",
    featured: true,
  },
  {
    category: "Corporate Experiential Event",
    title: "Annual Tech Leadership Summit",
    location: "Bengaluru, Karnataka",
    attendees: "1,200 attendees",
    highlights: "Stage Rigging, Live Stream, Speaker & Stageflow Management",
    period: "2025",
    featured: false,
  },
  {
    category: "Private Gala",
    title: "Gala Experiential Fashion & Art Show",
    location: "New Delhi",
    attendees: "650 invited guests",
    highlights: "Lighting Design, Vendor Logistics, VIP Hospitality",
    period: "2024",
    featured: false,
  },
  {
    category: "Brand Activation",
    title: "Brand Product Unveiling Activation",
    location: "Hyderabad, Telangana",
    attendees: "3,400 visitors",
    highlights: "Interactive Set Design, Audio Production, Crowd Flow",
    period: "2026",
    featured: false,
  },
];

export default function Work() {
  return (
    <section id="past-events" className="border-b border-line">
      <div className="mx-auto max-w-5xl px-6 py-20 md:py-24">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="kicker text-brass-deep">Selected Shows &amp; Events</p>
            <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-graphite md:text-4xl">
              Past Events
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-smoke">
            A cross-section of the concert series, corporate events, galas, and
            activations we have planned, built, and run. Client brand marks are
            withheld by default.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {events.map((event) => (
            <article
              key={event.title}
              className="group border border-line bg-paper transition-colors hover:border-brass/50"
            >
              <div className="border-b border-line px-7 pb-5 pt-6">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="kicker text-brass-deep">{event.category}</p>
                  <p className="text-xs text-smoke">{event.period}</p>
                </div>
              </div>

              <div className="px-7 py-7">
                <h3 className="font-serif text-2xl font-medium leading-snug tracking-tight text-graphite">
                  {event.title}
                </h3>

                <p className="mt-4 text-sm text-smoke">
                  {event.location} &middot; {event.attendees}
                </p>

                <div className="mt-6 border-t border-line pt-5">
                  <p className="kicker font-semibold text-smoke">
                    Production Highlights
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-graphite">
                    {event.highlights}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}