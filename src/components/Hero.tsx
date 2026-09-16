export default function Hero() {
  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-5xl px-6 pb-20 pt-20 md:pb-28 md:pt-28">
        <p className="kicker text-brass-deep">
          Event Production · Stage Design · Live Execution
        </p>

        <h1 className="mt-6 max-w-3xl font-serif text-4xl font-medium leading-[1.12] tracking-tight text-graphite md:text-6xl">
          Concerts, corporate experiential events, and private galas — designed,
          produced, and run to the second.
        </h1>

        <p className="mt-8 max-w-2xl text-base leading-relaxed text-smoke md:text-lg">
          Kalakaar Studios is an event production and event management company.
          We plan, stage-build, and operate live events end to end: immersive
          stage production, full audio-visual and lighting rigging, on-site
          logistics, and artist and crew coordination. Every event runs against
          a written production timeline, and on-stage execution is measured to
          the minute.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="#past-events"
            className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-ink bg-red px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-[4px_4px_0px_0px_#000000] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#000000]"
          >
            Explore Past Events
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-ink bg-sun px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-ink shadow-[4px_4px_0px_0px_#000000] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#000000]"
          >
            Book an Event
          </a>
        </div>
      </div>
    </section>
  );
}