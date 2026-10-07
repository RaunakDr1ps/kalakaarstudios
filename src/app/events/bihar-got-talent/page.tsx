import type { Metadata } from "next";
import Link from "next/link";
import { Oswald } from "next/font/google";
import {
  ArrowRight,
  BellRing,
  CalendarCheck,
  MapPin,
  Mic2,
  Music4,
  Palette,
  PartyPopper,
  PenLine,
  Smile,
  Sparkles,
  Star,
  Theater,
  Trophy,
  UserPlus,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BIHAR_CITIES, GENRES } from "@/lib/artist";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Bihar Got Talent — Perform, Partner & Showcase | Kalakaar Studios",
  description:
    "Bihar Got Talent: the open audition call from Kalakaar Studios. Register as an artist — music, dance, comedy, acting, visual art and poetry from every district of Bihar.",
};

const genreIcons: Record<string, typeof Music4> = {
  "Music / Singing": Music4,
  Dance: PartyPopper,
  Comedy: Smile,
  "Acting / Theatre": Theater,
  "Visual Art": Palette,
  "Poetry / Storytelling": PenLine,
  Other: Sparkles,
};

const genreBlurb: Record<string, string> = {
  "Music / Singing": "Solo, duo or band — Hindustani, pop, folk, hip-hop, anything with a hook.",
  Dance: "Classical, street, folk, freestyle — solo crews and formations both welcome.",
  Comedy: "Stand-up, sketch, improv and the kind of bit that works only in Bhojpuri.",
  "Acting / Theatre": "Monologues, scenes and stage work from amateur troupes to drama school grads.",
  "Visual Art": "Live painting, mural pitches, illustration and craft with a stage presence.",
  "Poetry / Storytelling": "Kavi Sammelan energy, spoken word, folk tales and true stories told well.",
  Other: "Magic, puppetry, beatboxing, stunts — if it entertains, it belongs here.",
};

const steps = [
  {
    icon: UserPlus,
    title: "Register online",
    body: "Fill the artist form — name, category, city, portfolio and a short bio. Two minutes, no fee, instant registration ID.",
  },
  {
    icon: CalendarCheck,
    title: "Audition call",
    body: "Our curators shortlist entries and send your audition slot, venue and call time by email and to the Notification Center.",
  },
  {
    icon: Trophy,
    title: "Take the stage",
    body: "Shortlisted artists perform at the live showcase with Kalakaar Studios production — stage, sound, lights and audience handled.",
  },
];

const perks = [
  "Featured on the Kalakaar Studios Artist Network roster",
  "Studio-grade stage, sound and lights for the showcase round",
  "Photo + video of your performance to build your portfolio",
  "Consideration for paid gigs, brand activations and future events",
];

export default function BiharGotTalentPage() {
  return (
    <div className={`${oswald.variable} flex min-h-full flex-col bg-cream text-ink`}>
      <Header />

      <main className="flex-1">
        {/* ─── HERO ─── */}
        <section className="border-b-2 border-ink bg-sun/30">
          <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
            <span className="inline-flex -rotate-1 items-center gap-2 border-2 border-ink bg-sun px-3 py-1.5 text-xs font-bold uppercase tracking-widest shadow-[3px_3px_0px_0px_#000000]">
              <Star className="h-3.5 w-3.5 fill-current" strokeWidth={2.5} />
              Artist registrations open
            </span>

            <h1 className="mt-6 font-blocky text-4xl font-bold uppercase leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
              Bihar Got Talent —
              <br />
              Perform, Partner &amp;{" "}
              <span className="relative z-0 inline-block whitespace-nowrap">
                <svg
                  viewBox="0 0 210 30"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  className="absolute left-0 top-[30%] -z-10 h-[110%] w-full"
                >
                  <path
                    d="M4 20 C 60 5, 130 5, 205 15"
                    stroke="#F2EE07"
                    strokeWidth="15"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                Showcase
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-sm font-medium leading-relaxed text-ink/70 sm:text-lg">
              Bihar&apos;s open call to its youth and creative communities.
              Singers, dancers, comics, actors, painters and storytellers —
              register once, join the Kalakaar Studios Artist Network, and get
              called for auditions, showcases and paid stage time.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/register/artist"
                className="group inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink bg-sun px-7 py-3.5 text-sm font-bold uppercase tracking-wide shadow-[4px_4px_0px_0px_var(--color-ink)] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_var(--color-ink)]"
              >
                <UserPlus className="h-4 w-4" strokeWidth={2.5} />
                Register as an Artist
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  strokeWidth={2.5}
                />
              </Link>
              <Link
                href="/notifications"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink bg-white px-7 py-3.5 text-sm font-bold uppercase tracking-wide transition-colors hover:bg-sun/50"
              >
                <BellRing className="h-4 w-4" strokeWidth={2.5} />
                Notification Center
              </Link>
            </div>

            <dl className="mt-10 flex flex-wrap gap-3">
              {[
                { icon: Mic2, label: `${GENRES.length} categories` },
                { icon: MapPin, label: "All Bihar districts" },
                { icon: Star, label: "No entry fee" },
                { icon: Trophy, label: "Live showcase round" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-2 border-2 border-ink bg-cream px-3.5 py-2 text-xs font-bold uppercase tracking-wide shadow-[3px_3px_0px_0px_var(--color-ink)]"
                >
                  <stat.icon className="h-4 w-4" strokeWidth={2.5} />
                  {stat.label}
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ─── HOW IT WORKS ─── */}
        <section className="border-b-2 border-ink bg-cream">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-ink/50">
              The road to the stage
            </p>
            <h2 className="mt-2 font-blocky text-3xl font-bold uppercase tracking-tight sm:text-4xl">
              Three steps.{" "}
              <span className="relative z-0 inline-block whitespace-nowrap">
                <svg
                  viewBox="0 0 140 26"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  className="absolute left-0 top-[32%] -z-10 h-[110%] w-full"
                >
                  <path
                    d="M3 20 C 30 5, 80 5, 137 14"
                    stroke="#F2EE07"
                    strokeWidth="13"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                Zero fees.
              </span>
            </h2>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {steps.map((step, i) => (
                <div
                  key={step.title}
                  className="relative border-2 border-ink bg-white p-6 shadow-[5px_5px_0px_0px_var(--color-ink)]"
                >
                  <span className="absolute -top-4 -right-2 rotate-3 bg-white px-2 text-2xl font-bold text-ink/20">
                    0{i + 1}
                  </span>
                  <span className="flex h-12 w-12 -rotate-3 items-center justify-center border-2 border-ink bg-sun">
                    <step.icon className="h-6 w-6" strokeWidth={2.25} />
                  </span>
                  <h3 className="mt-5 font-blocky text-xl font-bold uppercase tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-ink/65">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CATEGORIES ─── */}
        <section className="border-b-2 border-ink bg-ink text-cream">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-cream/50">
                  Categories
                </p>
                <h2 className="mt-2 font-blocky text-3xl font-bold uppercase tracking-tight sm:text-4xl">
                  Pick your stage
                </h2>
              </div>
              <Link
                href="/register/artist"
                className="group inline-flex items-center gap-2 rounded-full border-2 border-ink bg-sun px-6 py-3 text-sm font-bold uppercase tracking-wide text-ink shadow-[4px_4px_0px_0px_var(--color-ink)] transition-all hover:-translate-y-0.5"
              >
                Register as an Artist
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  strokeWidth={2.5}
                />
              </Link>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {GENRES.map((genre) => {
                const Icon = genreIcons[genre] ?? Sparkles;
                return (
                  <div
                    key={genre}
                    className="flex flex-col border-2 border-cream/30 bg-cream/5 p-6 transition-colors hover:border-sun"
                  >
                    <span className="flex h-11 w-11 items-center justify-center border-2 border-sun bg-sun text-ink">
                      <Icon className="h-5 w-5" strokeWidth={2.25} />
                    </span>
                    <h3 className="mt-4 font-blocky text-lg font-bold uppercase tracking-tight">
                      {genre}
                    </h3>
                    <p className="mt-1.5 text-sm font-medium leading-relaxed text-cream/65">
                      {genreBlurb[genre]}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── ARTIST NETWORK ─── */}
        <section className="border-b-2 border-ink bg-cream">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2">
            <div>
              <span className="inline-flex -rotate-1 items-center gap-2 border-2 border-ink bg-sun px-3 py-1.5 text-xs font-bold uppercase tracking-widest shadow-[3px_3px_0px_0px_#000000]">
                <Sparkles className="h-3.5 w-3.5" strokeWidth={2.5} />
                Kalakaar Studios Artist Network
              </span>
              <h2 className="mt-5 font-blocky text-3xl font-bold uppercase leading-[1.05] tracking-tight sm:text-4xl">
                One registration,
                <br />
                more than one gig.
              </h2>
              <p className="mt-5 max-w-lg text-sm font-medium leading-relaxed text-ink/70 sm:text-base">
                Bihar Got Talent is the door; the Artist Network is the room.
                Registered artists stay on our roster for every show the studio
                builds — festivals, corporate stages, brand activations and
                community showcases across 12 cities.
              </p>

              <ul className="mt-7 space-y-3.5">
                {perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border-2 border-ink bg-sun">
                      <Star className="h-3 w-3 fill-current" strokeWidth={2.5} />
                    </span>
                    <span className="text-sm font-semibold leading-snug text-ink/80">
                      {perk}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-2 border-ink bg-white p-6 shadow-[8px_8px_0px_0px_var(--color-ink)] sm:p-8">
              <p className="kicker text-ink/50">Where artists come from</p>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {BIHAR_CITIES.map((city) => (
                  <span
                    key={city}
                    className="inline-flex items-center gap-1.5 border-2 border-ink bg-cream px-3 py-1.5 text-xs font-bold uppercase tracking-wide shadow-[2px_2px_0px_0px_var(--color-ink)]"
                  >
                    <MapPin className="h-3.5 w-3.5" strokeWidth={2.5} />
                    {city}
                  </span>
                ))}
                <span className="inline-flex items-center border-2 border-dashed border-ink px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-ink/60">
                  + every other town
                </span>
              </div>

              <div className="mt-7 border-2 border-ink bg-sun/40 px-4 py-4">
                <p className="text-sm font-bold uppercase tracking-wide text-ink">
                  Already registered?
                </p>
                <p className="mt-1.5 text-sm font-medium leading-relaxed text-ink/70">
                  Audition slots and shortlist updates land in your Notification
                  Center first.
                </p>
                <Link
                  href="/notifications"
                  className="mt-4 inline-flex items-center gap-2 border-2 border-ink bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide shadow-[3px_3px_0px_0px_var(--color-ink)] transition-all hover:-translate-y-0.5 hover:bg-sun"
                >
                  <BellRing className="h-3.5 w-3.5" strokeWidth={2.5} />
                  Open Notification Center
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── CTA BAND ─── */}
        <section className="border-b-2 border-ink bg-sun">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-5 py-14 text-center sm:px-8">
            <h2 className="font-blocky text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-5xl">
              Bihar, this is
              <br />
              your stage.
            </h2>
            <p className="max-w-xl text-sm font-medium leading-relaxed text-ink/70 sm:text-base">
              Registration takes two minutes and costs nothing. The only thing
              we ask you to bring is the talent.
            </p>
            <Link
              href="/register/artist"
              className="group inline-flex items-center gap-2 rounded-full border-2 border-ink bg-ink px-8 py-4 text-sm font-bold uppercase tracking-wide text-cream shadow-[5px_5px_0px_0px_var(--color-ink)] transition-all hover:-translate-y-0.5"
            >
              <UserPlus className="h-4 w-4" strokeWidth={2.5} />
              Register as an Artist
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                strokeWidth={2.5}
              />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
