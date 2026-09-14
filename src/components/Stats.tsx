const stats = [
  {
    value: "180",
    suffix: "+",
    tone: "brass",
    label: "Events produced & executed",
    note: "Concert series, corporate experiential events, galas, and brand activations across the country.",
  },
  {
    value: "45,000",
    suffix: "+",
    tone: "silver",
    label: "Total attendee footfall",
    note: "Paid and invite-only audiences hosted and managed safely at our produced events.",
  },
  {
    value: "12",
    suffix: "+",
    tone: "brass",
    label: "Cities covered across India",
    note: "Long-standing venue and vendor relationships in every market we operate in.",
  },
  {
    value: "99.4",
    suffix: "%",
    tone: "silver",
    label: "On-time stage execution rate",
    note: "Show starts landed within the scheduled window across all produced events.",
  },
];

export default function Stats() {
  return (
    <section className="border-b border-line bg-sand/60">
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <p className="kicker text-brass-deep">
          Operational Track Record, From the Production Desk
        </p>

        <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="border-t border-graphite/15 pt-6"
            >
              <div className="flex items-baseline">
                <span
                  className={`metal-${
                    stat.tone
                  } text-5xl font-semibold md:text-6xl`}
                >
                  {stat.value}
                </span>
                {stat.suffix && (
                  <span className="suffix ml-0.5 text-3xl font-semibold">
                    {stat.suffix}
                  </span>
                )}
              </div>
              <h3 className="mt-4 text-sm font-semibold text-graphite">
                {stat.label}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-smoke">
                {stat.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}