import Image from "next/image";

const disciplines = [
  "Concert & live series production",
  "Corporate experiential events",
  "Private galas & artist showcases",
  "Brand activations & product launches",
];

export default function About() {
  return (
    <section id="about" className="border-b border-line bg-sand/40">
      <div className="mx-auto max-w-5xl px-6 py-20 md:py-24">
        <div className="grid gap-14 md:grid-cols-[1fr_1.6fr]">
          <div>
            <p className="kicker text-brass-deep">About the Studio</p>
            <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-graphite md:text-4xl">
              A production company, run with a producer&apos;s discipline
            </h2>

            <div className="mt-10 inline-flex items-center justify-center border border-line bg-paper p-10">
              <Image
                src="/logo.png"
                alt="Kalakaar Studios"
                width={1024}
                height={1024}
                className="h-36 w-auto"
              />
            </div>
          </div>

          <div className="space-y-5 text-sm leading-relaxed text-smoke md:text-base">
            <p>
              Kalakaar Studios plans, builds, and operates live events. Our work
              spans concert series and artist showcases, corporate experiential
              events, private galas, and brand activations — from a cramped
              boardroom briefing to a full arena-day production schedule.
            </p>
            <p>
              We keep production in-house: stage design and architecture,
              audio-visual and lighting rigging, on-site event management, and
              crew and artist coordination. That means one accountable team,
              one production timeline, and no gap between the rendering and the
              load-in manifest.
            </p>
            <p>
              Our vendor and venue network covers twelve cities across India,
              which lets us price from real market relationships rather than
              region-by-region guesswork.
            </p>

            <div className="border-t border-line pt-5">
              <p className="kicker font-semibold text-smoke">We Produce</p>
              <ul className="mt-3 space-y-2">
                {disciplines.map((item) => (
                  <li key={item} className="text-graphite">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}