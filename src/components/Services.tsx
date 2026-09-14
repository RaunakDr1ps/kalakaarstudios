const services = [
  {
    index: "01",
    title: "Event Architecture & Stage Design",
    description:
      "Schematic design, stage plans, site surveys, and CAD-ready layout drawings agreed before any equipment is booked.",
  },
  {
    index: "02",
    title: "Full-Scale Audio/Visual & Lighting Rigging",
    description:
      "Sourcing, load-in, rigging, and teching of sound systems, LED and lighting rigs, and live video infrastructure.",
  },
  {
    index: "03",
    title: "On-Site Event Management & Logistics",
    description:
      "Vendor coordination, crowd flow, permits, security, schedules, and the on-ground team that keeps the show moving.",
  },
  {
    index: "04",
    title: "Artist & Crew Execution Support",
    description:
      "Artist liaison, crew call sheets, runner systems, and rehearsal-to-show-day execution support.",
  },
];

export default function Services() {
  return (
    <section id="services" className="border-b border-line">
      <div className="mx-auto max-w-5xl px-6 py-20 md:py-24">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="kicker text-brass-deep">Core Capabilities</p>
            <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-graphite md:text-4xl">
              Event Services
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-smoke">
            Four production disciplines, staffed in-house and across a
            vetted vendor network in every city we cover.
          </p>
        </div>

        <div className="mt-14">
          {services.map((service) => (
            <div
              key={service.index}
              className="group grid grid-cols-[3rem_1fr] gap-6 border-t border-line py-8 transition-colors hover:bg-paper md:grid-cols-[5rem_1fr_1fr] md:items-baseline"
            >
              <span className="font-serif text-lg text-brass-deep">
                {service.index}
              </span>
              <div className="md:col-span-1">
                <h3 className="font-serif text-xl font-medium tracking-tight text-graphite md:text-2xl">
                  {service.title}
                </h3>
              </div>
              <p className="col-start-2 text-sm leading-relaxed text-smoke md:col-start-3">
                {service.description}
              </p>
            </div>
          ))}
          <div className="border-t border-line" />
        </div>
      </div>
    </section>
  );
}