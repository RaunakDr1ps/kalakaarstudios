import Link from "next/link";
import {
  ArrowRight,
  Mic2,
  Music4,
  Palette,
  PartyPopper,
  PenLine,
  Smile,
  Sparkles,
  Theater,
} from "lucide-react";
import { GENRES } from "@/lib/artist";

const genreIcons: Record<string, typeof Music4> = {
  "Music / Singing": Music4,
  Dance: PartyPopper,
  Comedy: Smile,
  "Acting / Theatre": Theater,
  "Visual Art": Palette,
  "Poetry / Storytelling": PenLine,
  Other: Sparkles,
};

const highlights = [
  {
    label: "7 open categories",
    body: "Music, dance, comedy, theatre, visual art, poetry — and anything that refuses to fit a box.",
  },
  {
    label: "Every district welcome",
    body: "Patna, Muzaffarpur, Gaya, Darbhanga, Bhagalpur, Purnia and every town in between.",
  },
  {
    label: "No entry fee",
    body: "Free registration. Shortlisted artists get studio support for the showcase round.",
  },
];

/**
 * Homepage promo band for Bihar Got Talent. Static markup — every link and
 * CTA works in the exported HTML with no client JS of its own.
 */
export default function BiharGotTalentSection() {
  return (
    <section id="bihar-got-talent" className="border-y-2 border-ink bg-ink text-cream">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.25fr_1fr]">
          <div>
            <span className="inline-flex -rotate-1 items-center gap-2 border-2 border-ink bg-sun px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-ink shadow-[3px_3px_0px_0px_var(--color-ink)]">
              <Mic2 className="h-3.5 w-3.5" strokeWidth={2.5} />
              Open auditions · Registrations live
            </span>

            <h2 className="mt-6 font-blocky text-3xl font-bold uppercase leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl">
              Bihar Got Talent —
              <br />
              Perform, Partner &amp;{" "}
              <span className="relative z-0 inline-block whitespace-nowrap">
                <svg
                  viewBox="0 0 200 26"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  className="absolute left-0 top-[32%] -z-10 h-[105%] w-full"
                >
                  <path
                    d="M4 17 C 50 4, 120 4, 196 13"
                    stroke="#F2EE07"
                    strokeWidth="14"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                Showcase
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-sm font-medium leading-relaxed text-cream/70 sm:text-base">
              The open call for Bihar&apos;s youth and creative communities —
              singers, dancers, comics, actors, painters and storytellers. One
              registration puts you on the Kalakaar Studios Artist Network, the
              roster we book from for auditions, showcases and paid gigs all
              year.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/register/artist"
                className="group inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink bg-sun px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-ink shadow-[4px_4px_0px_0px_var(--color-ink)] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_var(--color-ink)]"
              >
                Register as an Artist
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  strokeWidth={2.5}
                />
              </Link>
              <Link
                href="/events/bihar-got-talent"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-cream px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-cream transition-colors hover:bg-cream hover:text-ink"
              >
                Event Details
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap gap-2.5">
              {GENRES.map((genre) => {
                const Icon = genreIcons[genre] ?? Sparkles;
                return (
                  <span
                    key={genre}
                    className="inline-flex items-center gap-1.5 border-2 border-cream/35 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-cream/80"
                  >
                    <Icon className="h-3.5 w-3.5 text-sun" strokeWidth={2.5} />
                    {genre}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="relative">
            <div className="border-2 border-ink bg-cream p-6 text-ink shadow-[8px_8px_0px_0px_var(--color-sun)] sm:p-8">
              <p className="kicker text-ink/50">Why register</p>
              <ul className="mt-5 space-y-5">
                {highlights.map((item) => (
                  <li key={item.label} className="border-b border-ink/15 pb-4 last:border-0 last:pb-0">
                    <p className="font-blocky text-lg font-bold uppercase tracking-tight">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm font-medium leading-relaxed text-ink/65">
                      {item.body}
                    </p>
                  </li>
                ))}
              </ul>

              <Link
                href="/register/artist"
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-ink bg-sun px-6 py-3 text-sm font-bold uppercase tracking-wide shadow-[4px_4px_0px_0px_var(--color-ink)] transition-all hover:-translate-y-0.5"
              >
                Join the roster — free
              </Link>
            </div>

            <span className="absolute -right-3 -top-6 flex h-20 w-20 rotate-12 flex-col items-center justify-center rounded-full border-2 border-ink bg-sun text-center text-[11px] font-bold uppercase leading-tight text-ink shadow-[4px_4px_0px_0px_var(--color-ink)] sm:-right-6 sm:h-24 sm:w-24">
              Free
              <br />
              Entry
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
