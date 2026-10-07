import type { Metadata } from "next";
import Link from "next/link";
import { Oswald } from "next/font/google";
import {
  ArrowLeft,
  BellRing,
  CalendarCheck,
  IdCard,
  Mail,
  Sparkles,
  Star,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArtistRegistrationForm from "@/components/artist/ArtistRegistrationForm";
import { GENRES } from "@/lib/artist";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Register as an Artist — Bihar Got Talent | Kalakaar Studios",
  description:
    "Join the Kalakaar Studios Artist Network. Register for Bihar Got Talent — Perform, Partner & Showcase: music, dance, comedy, theatre, visual art and poetry from across Bihar.",
};

const steps = [
  {
    icon: IdCard,
    title: "You register",
    body: "Two minutes, seven fields. You get a registration ID and a spot on the Artist Network roster.",
  },
  {
    icon: CalendarCheck,
    title: "We shortlist",
    body: "Curators review every entry against the audition slate — portfolio, category and city considered together.",
  },
  {
    icon: BellRing,
    title: "You get the call",
    body: "Audition slot, venue and call time arrive by email and in the on-site Notification Center.",
  },
];

export default function ArtistRegisterPage() {
  return (
    <div className={`${oswald.variable} flex min-h-full flex-col bg-cream text-ink`}>
      <Header />

      <main className="flex-1">
        <section className="border-b-2 border-ink bg-sun/30">
          <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
            <Link
              href="/events/bihar-got-talent"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-ink/60 transition-colors hover:text-ink"
            >
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
              Bihar Got Talent
            </Link>

            <span className="mt-5 inline-flex -rotate-1 items-center gap-2 border-2 border-ink bg-sun px-3 py-1.5 text-xs font-bold uppercase tracking-widest shadow-[3px_3px_0px_0px_#000000]">
              <Star className="h-3.5 w-3.5 fill-current" strokeWidth={2.5} />
              Artist Registration &amp; Talent Roster
            </span>

            <h1 className="mt-5 font-blocky text-4xl font-bold uppercase leading-[1.02] tracking-tight sm:text-5xl">
              Perform, partner
              <br />
              and{" "}
              <span className="relative z-0 inline-block whitespace-nowrap">
                <svg
                  viewBox="0 0 150 26"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  className="absolute left-0 top-[30%] -z-10 h-[115%] w-full"
                >
                  <path
                    d="M3 20 C 30 5, 90 5, 117 14"
                    stroke="#F2EE07"
                    strokeWidth="13"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                showcase.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm font-medium leading-relaxed text-ink/70 sm:text-base">
              One form puts you on the Kalakaar Studios Artist Network — the
              roster we pull from for Bihar Got Talent, live showcases, brand
              activations and everything the studio stages next.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.5fr_1fr]">
          <div className="border-2 border-ink bg-white p-6 shadow-[8px_8px_0px_0px_var(--color-ink)] sm:p-8">
            <h2 className="font-blocky text-2xl font-bold uppercase tracking-tight">
              Register as an Artist
            </h2>
            <p className="mt-2 text-sm font-medium text-ink/60">
              Fields marked * are required. Your details stay on the roster and
              are only used for Bihar Got Talent updates.
            </p>
            <div className="mt-7">
              <ArtistRegistrationForm />
            </div>
          </div>

          <aside className="space-y-7">
            <div className="border-2 border-ink bg-white p-6 shadow-[5px_5px_0px_0px_var(--color-ink)]">
              <p className="kicker text-ink/50">What happens next</p>
              <ol className="mt-5 space-y-5">
                {steps.map((step, i) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="flex h-10 w-10 shrink-0 -rotate-3 items-center justify-center border-2 border-ink bg-sun">
                      <step.icon className="h-5 w-5" strokeWidth={2.25} />
                    </span>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink/40">
                        Step {i + 1}
                      </p>
                      <p className="font-blocky text-base font-bold uppercase tracking-tight">
                        {step.title}
                      </p>
                      <p className="mt-1 text-sm font-medium leading-relaxed text-ink/65">
                        {step.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="border-2 border-ink bg-ink p-6 text-cream shadow-[5px_5px_0px_0px_var(--color-ink)]">
              <p className="kicker text-sun">Open categories</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {GENRES.map((genre) => (
                  <span
                    key={genre}
                    className="border-2 border-cream/40 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              <p className="mt-5 text-sm font-medium leading-relaxed text-cream/70">
                From Patna to Purnia — if you perform, draw, write or make people
                laugh, there is a category with your name on it.
              </p>
            </div>

            <div className="border-2 border-ink bg-sun p-6 shadow-[5px_5px_0px_0px_var(--color-ink)]">
              <p className="kicker text-ink/60">Need help?</p>
              <p className="mt-3 flex items-start gap-2 text-sm font-semibold text-ink">
                <Mail className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.5} />
                Kalakaarstudios@ssociopro.com
              </p>
              <p className="mt-3 flex items-start gap-2 text-sm font-medium text-ink/70">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.5} />
                Registration is free. We never charge an entry fee.
              </p>
            </div>
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  );
}
