"use client";

import Link from "next/link";
import Image from "next/image";
import { Oswald } from "next/font/google";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  AtSign,
  AudioLines,
  Boxes,
  CalendarPlus,
  Clapperboard,
  Globe,
  HardHat,
  Lightbulb,
  Mail,
  MapPin,
  Menu,
  Music4,
  PartyPopper,
  PenTool,
  Play,
  Send,
  Sparkles,
  Speaker,
  Spotlight,
  Star,
  X,
} from "lucide-react";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const pillBase =
  "inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink shadow-[4px_4px_0px_0px_var(--color-ink)] font-bold uppercase tracking-wide transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_var(--color-ink)]";

const navLinks = [
  { label: "What We Do", href: "#what-we-do" },
  { label: "Services", href: "#services" },
  { label: "Showreel", href: "#showreel" },
  { label: "FAQ", href: "#faq" },
];

const services = [
  {
    icon: PartyPopper,
    bg: "bg-sun",
    title: "Live Concerts & Festivals",
    desc: "Multi-stage festival builds, headline concerts, and open-air gigs — booked, designed, and run from one accountable team.",
  },
  {
    icon: Boxes,
    bg: "bg-sun",
    title: "Corporate Galas & Brand Activations",
    desc: "Product launches, awards nights, and immersive pop-ups that turn brand budgets into crowds, buzz, and measurable ROI.",
  },
  {
    icon: AudioLines,
    bg: "bg-sun",
    title: "Staging, Lighting & Audio Systems",
    desc: "Custom stage architecture, concert-grade lighting rigs, and broadcast-clear sound — engineered, rigged, and operated end to end.",
  },
];

const steps = [
  {
    step: "01",
    icon: PenTool,
    chip: "bg-sun",
    title: "Plan",
    desc: "Kickoff call, site visit, and a written production scope with a locked budget.",
  },
  {
    step: "02",
    icon: HardHat,
    chip: "bg-sun",
    title: "Build",
    desc: "Stage construction, AV load-in, lighting focus, sound checks, and full rehearsal.",
  },
  {
    step: "03",
    icon: PartyPopper,
    chip: "bg-sun",
    title: "Run",
    desc: "Live show-call, on-ground ops, real-time troubleshooting, and a spotless load-out.",
  },
];

const faqs = [
  {
    q: "Can you actually pull off a last-minute event?",
    a: "Chaos is kind of our thing. We keep an emergency crew bench and a hot AV inventory, so a two-week runway is workable and a 48-hour one is painstaking but possible.",
  },
  {
    q: "Are you based only in Bihar?",
    a: "Rooted in Patna, wired pan-India. Our production network stretches across 12+ cities, so we can stage in your hometown or fly a crew to yours.",
  },
  {
    q: "Where does the budget conversation start?",
    a: "With a scoping call, not a guess. We map your venue, guest count, and ambition to a realistic range — then put it in writing before you spend a rupee.",
  },
  {
    q: "Do we need to bring our own gear and crew?",
    a: "Nope. Stage, sound, lights, crew, and talent coordination all come under one roof. You get one accountable team and one invoice.",
  },
];

const eventTypes = [
  "Concert / live show",
  "Corporate gala / launch event",
  "Brand activation / pop-up",
  "Private celebration / wedding",
  "Music festival",
  "Other",
];

const budgetRanges = [
  "Below ₹5,00,000",
  "₹5,00,000 – ₹15,00,000",
  "₹15,00,000 – ₹40,00,000",
  "Above ₹40,00,000",
  "Prefer to discuss",
];

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [hideSplash, setHideSplash] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setHideSplash(true), 500);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(false);
    const form = e.currentTarget;
    const data = new FormData(form);
    const id = process.env.NEXT_PUBLIC_FORMSPREE_ID;

    if (id) {
      try {
        const res = await fetch(`https://formspree.io/f/${id}`, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
        });
        if (res.ok) {
          setFormSubmitted(true);
        } else {
          setFormError(true);
        }
      } catch {
        setFormError(true);
      }
    } else {
      setFormSubmitted(true);
    }
  }

  return (
    <div
      className={`${oswald.variable} min-h-screen bg-cream font-sans text-ink antialiased`}
    >
      {!hideSplash && (
        <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white transition-opacity duration-500 ${
            loading ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <div className="splash-thud relative flex items-center justify-center">
            <div className="relative inline-block">
              <Image
                src="/ks-grid-logo.png"
                alt="Kalakaar Studios"
                width={200}
                height={64}
                className="splash-grid block h-16 w-auto"
              />
              <Image
                src="/stamp-logo.png"
                alt="Kalakaar Studios"
                width={500}
                height={500}
                className="splash-stamp absolute left-0 top-0 aspect-square h-72 w-72 rounded-full object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-50 border-b-2 border-ink bg-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="#" className="group inline-flex items-center gap-3">
            <span className="flex items-center justify-center rounded-md border-2 border-ink bg-white p-1.5 shadow-[3px_3px_0px_0px_#000000]">
              <Image
                src="/logo.png"
                alt="Kalakaar Studios"
                width={200}
                height={200}
                className="h-8 w-auto"
              />
            </span>
            <Image
              src="/ks-grid-logo.png"
              alt="Kalakaar Studios"
              width={200}
              height={64}
              className="h-8 w-auto"
            />
          </a>

          <nav className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="group relative text-sm font-bold uppercase tracking-wide transition-colors hover:text-ink"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-[3px] w-0 bg-sun transition-all group-hover:w-full" />
              </a>
            ))}
            <a
              href="#contact"
              className={`${pillBase} bg-red px-5 py-2.5 text-sm`}
            >
              <CalendarPlus className="h-4 w-4" strokeWidth={2.5} />
              Book a Call
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            className="flex h-10 w-10 items-center justify-center border-2 border-ink bg-cream shadow-[3px_3px_0px_0px_var(--color-ink)] lg:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" strokeWidth={2.5} />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={2.5} />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="border-t-2 border-ink bg-cream px-5 pb-6 pt-2 lg:hidden">
            <div className="flex flex-col">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="border-b border-ink/10 py-3.5 text-sm font-bold uppercase tracking-wide"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className={`${pillBase} mt-5 bg-red px-6 py-3 text-sm`}
              >
                <CalendarPlus className="h-4 w-4" strokeWidth={2.5} />
                Book a Call
              </a>
            </div>
          </nav>
        )}
      </header>

      {/* ─── HERO ─── */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 sm:px-8 lg:grid-cols-2 lg:py-20">
        <div>
          <span className="inline-flex -rotate-1 items-center gap-2 border-2 border-ink bg-sun px-3 py-1.5 text-xs font-bold uppercase tracking-widest shadow-[3px_3px_0px_0px_var(--color-ink)]">
            <Star className="h-3.5 w-3.5 fill-current" strokeWidth={2.5} />
            Event Production &amp; Management
          </span>

          <h1 className="mt-6 font-blocky text-4xl font-bold uppercase leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
            Turn Event{" "}
            <span className="relative z-0 inline-block whitespace-nowrap">
              <svg
                viewBox="0 0 150 34"
                preserveAspectRatio="none"
                aria-hidden="true"
                className="absolute -left-[2px] top-[12%] -z-10 h-[105%] w-[calc(100%+4px)]"
              >
                <path
                  d="M3 27 C 32 8, 58 12, 74 21 C 90 31, 118 8, 147 17"
                  stroke="#F2EE07"
                  strokeWidth="15"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M3 27 C 32 8, 58 12, 74 21 C 90 31, 118 8, 147 17"
                  stroke="none"
                  fill="#F2EE07"
                  opacity="0"
                />
              </svg>
              Chaos
            </span>{" "}
            Into Unforgettable
            <br className="hidden sm:block" /> Live Experiences.
            <svg
              viewBox="0 0 220 14"
              preserveAspectRatio="none"
              aria-hidden="true"
              className="mt-1 h-[0.16em] w-[76%] max-w-sm"
            >
              <path
                d="M4 10 C 50 3, 120 3, 216 8"
                stroke="#F2EE07"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M4 10 C 50 3, 120 3, 216 8"
                stroke="#000000"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
                strokeDasharray="3 5"
                opacity="0.4"
              />
            </svg>
          </h1>

          <p className="mt-6 max-w-xl text-base font-medium leading-relaxed text-ink/70 sm:text-lg">
            Kalakaar Studios manages the mess so the magic survives — live event
            management, custom stage design, AV engineering, and talent booking
            under one roof. We plan it, build it, and run it like it&apos;s the
            only show in town.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <a href="#contact" className={`${pillBase} bg-red px-7 py-3.5 text-sm text-white`}>
              <Send className="h-4 w-4" strokeWidth={2.5} />
              Get Started with a Proposal
            </a>
            <a
              href="#showreel"
              className={`${pillBase} bg-cream px-7 py-3.5 text-sm`}
            >
              <Play className="h-4 w-4 fill-current" strokeWidth={2.5} />
              View Production Reel
            </a>
            <a
              href="#contact"
              className={`${pillBase} bg-sun px-7 py-3.5 text-sm`}
            >
              <Mail className="h-4 w-4" strokeWidth={2.5} />
              Contact Us
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-widest text-ink/50">
            <MaybeStar />
            <span>Concerts</span>
            <Dot />
            <span>Galas</span>
            <Dot />
            <span>Activations</span>
            <Dot />
            <span>Weddings</span>
            <Dot />
            <span>Festivals</span>
          </div>
        </div>

        {/* Hero visual placeholder */}
        <div className="relative">
          <div
            className="relative flex aspect-[4/3] items-center justify-center overflow-hidden border-2 border-dashed border-ink bg-white shadow-[8px_8px_0px_0px_var(--color-ink)]"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(17,24,39,0.1) 1.5px, transparent 1.5px)",
              backgroundSize: "20px 20px",
            }}
          >
            <Sparkles className="absolute left-6 top-6 h-6 w-6 rotate-12 text-ink/30" />
            <Music4 className="absolute right-8 top-8 h-7 w-7 -rotate-6 text-ink/25" />
            <Star className="absolute bottom-24 right-5 h-4 w-4 fill-sun text-ink/40" />

            <Spotlight
              className="absolute -left-2 top-8 h-16 w-16 text-sun"
              strokeWidth={1.5}
            />
            <Spotlight
              className="absolute -right-2 top-8 h-16 w-16 scale-x-[-1] text-sun"
              strokeWidth={1.5}
            />

            <div className="relative z-10 flex flex-col items-center gap-3">
              <span className="flex h-20 w-20 items-center justify-center overflow-hidden border-2 border-ink bg-cream shadow-[4px_4px_0px_0px_var(--color-ink)]">
                <Image
                  src="/logo.png"
                  alt="Kalakaar Studios logo"
                  width={1024}
                  height={1024}
                  className="h-full w-full object-cover"
                />
              </span>
              <span className="border-2 border-ink bg-sun px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-ink">
                Your Event Art Here
              </span>
            </div>

            <Speaker
              className="absolute bottom-16 left-8 h-9 w-9 rotate-6 text-ink/50"
              strokeWidth={1.75}
            />
            <AudioLines
              className="absolute bottom-10 right-10 h-8 w-8 -rotate-3 text-ink/45"
              strokeWidth={1.75}
            />

            <div className="absolute inset-x-0 bottom-0 h-8 bg-ink" />
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-[0.25em] text-cream">
              Stage / Build / Run
            </span>
          </div>

          <span className="absolute -right-2 -top-4 flex h-14 w-14 rotate-12 items-center justify-center rounded-full border-2 border-ink bg-sun text-xs font-bold uppercase leading-tight shadow-[4px_4px_0px_0px_var(--color-ink)] lg:right-4">
            Since
            <br />
            2025
          </span>
        </div>
      </section>

      {/* ─── WHAT WE DO ─── */}
      <section id="what-we-do" className="border-y-2 border-ink bg-cream">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-ink/50">
                How it works
              </p>
              <h2 className="mt-2 font-blocky text-3xl font-bold uppercase tracking-tight sm:text-4xl">
                One team.{" "}
                <span className="relative z-0 inline-block whitespace-nowrap">
                  <svg
                    viewBox="0 0 120 26"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                    className="absolute left-0 top-[30%] -z-10 h-[115%] w-full"
                  >
                    <path
                      d="M3 20 C 30 5, 90 5, 117 14"
                      stroke="#F2EE07"
                      strokeWidth="12"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                  Three phases.
                </span>
              </h2>
            </div>
            <p className="max-w-sm text-sm font-medium leading-relaxed text-ink/60">
              No hand-offs, no finger-pointing. The same crew that plans your
              show is on site the night it matters.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.step}
                className="relative border-2 border-ink bg-cream p-6 shadow-[5px_5px_0px_0px_var(--color-ink)]"
              >
                <span className="absolute -top-4 -right-2 rotate-3 bg-cream px-2 text-2xl font-bold text-ink/20">
                  {step.step}
                </span>
                <span
                  className={`flex h-12 w-12 -rotate-3 items-center justify-center border-2 border-ink ${step.chip}`}
                >
                  <step.icon className="h-6 w-6" strokeWidth={2.25} />
                </span>
                <h3 className="mt-5 font-blocky text-xl font-bold uppercase tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-ink/65">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SERVICES ─── */}
      <section id="services" className="bg-ink">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-cream/50">
                What we produce
              </p>
              <h2 className="mt-2 font-blocky text-3xl font-bold uppercase tracking-tight text-cream sm:text-4xl">
                Services &
                <br className="sm:hidden" /> Productions
              </h2>
            </div>
            <a
              href="#contact"
              className={`${pillBase} bg-red px-6 py-3 text-sm`}
            >
              Start a Project <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
            </a>
          </div>

          <div className="mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.title}
                className={`relative flex flex-col border-2 border-ink p-6 shadow-[6px_6px_0px_0px_var(--color-ink)] ${service.bg}`}
              >
                <span className="flex h-12 w-12 items-center justify-center border-2 border-ink bg-cream">
                  <service.icon className="h-6 w-6" strokeWidth={2.25} />
                </span>
                <h3 className="mt-6 font-blocky text-xl font-bold uppercase leading-snug tracking-tight">
                  {service.title}
                </h3>
                <p className="mt-3 flex-1 text-sm font-medium leading-relaxed text-ink/70">
                  {service.desc}
                </p>
                <a
                  href="#contact"
                  className="group mt-6 inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide"
                >
                  Learn More
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    strokeWidth={2.5}
                  />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SHOWREEL PLACEHOLDER ─── */}
      <section id="showreel" className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-ink/50">
          Reel · 2026
        </p>
        <h2 className="mt-2 font-blocky text-3xl font-bold uppercase tracking-tight sm:text-4xl">
          See the show, <span className="text-ink/60">not just the photos.</span>
        </h2>

        <div className="relative mt-8 aspect-video overflow-hidden border-2 border-ink bg-ink shadow-[8px_8px_0px_0px_var(--color-ink)]">
          <video
            className="h-full w-full object-cover"
            controls
            playsInline
            preload="metadata"
            poster="/logo.png"
          >
            <source src="/showreel.mp4" type="video/mp4" />
          </video>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section
        id="faq"
        className="border-t-2 border-ink bg-gradient-to-b from-white to-sun/30"
      >
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-ink/50">
            Straight answers
          </p>
          <h2 className="mt-2 font-blocky text-3xl font-bold uppercase tracking-tight sm:text-4xl">
            FAQ
          </h2>

          <div className="mt-8 space-y-5">
            {faqs.map((faq, i) => (
              <details
                key={faq.q}
                open={i === 0}
                className="group border-2 border-ink bg-cream shadow-[4px_4px_0px_0px_var(--color-ink)]"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-sm font-bold uppercase tracking-wide sm:text-base">
                  {faq.q}
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center border-2 border-ink bg-sun text-sm transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="border-t-2 border-ink px-5 py-4 text-sm font-medium leading-relaxed text-ink/70">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONTACT FORM ─── */}
      <section id="contact" className="bg-sun/30 border-t-2 border-ink">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <span className="inline-flex -rotate-1 items-center gap-2 border-2 border-ink bg-ink px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-cream shadow-[3px_3px_0px_0px_var(--color-ink)]">
              <Lightbulb className="h-3.5 w-3.5" strokeWidth={2.5} />
              Let&apos;s talk shop
            </span>
            <h2 className="mt-5 font-blocky text-4xl font-bold uppercase leading-[1.02] tracking-tight sm:text-5xl">
              Got an event
              <br />
              <span className="relative z-0 inline-block whitespace-nowrap">
                <svg
                  viewBox="0 0 130 26"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  className="absolute left-0 top-[35%] -z-10 h-[110%] w-full"
                >
                  <path
                    d="M3 19 C 30 6, 80 6, 127 13"
                    stroke="#F2EE07"
                    strokeWidth="13"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                brewing?
              </span>
            </h2>
            <p className="mt-5 max-w-md text-sm font-medium leading-relaxed text-ink/70">
              Send the essentials — scale, city, dates, vibe — and our
              production desk replies within 24 hours with a scoping call and a
              ballpark budget.
            </p>

            <dl className="mt-8 space-y-4 text-sm font-bold">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center border-2 border-ink bg-cream">
                  <Mail className="h-4.5 w-4.5" strokeWidth={2.5} />
                </span>
                <a
                  href="mailto:Kalakaarstudios@ssociopro.com"
                  className="hover:text-ink/70"
                >
                  Kalakaarstudios@ssociopro.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-ink bg-cream">
                  <MapPin className="h-4.5 w-4.5" strokeWidth={2.5} />
                </span>
                <span>
                  Bhub, Maurya Lok, Block A
                  <br />
                  Fifth Floor, Patna, Bihar
                </span>
              </div>
            </dl>
          </div>

          <div className="border-2 border-ink bg-cream p-6 shadow-[8px_8px_0px_0px_var(--color-ink)] sm:p-8">
            {formSubmitted ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-ink bg-sun shadow-[4px_4px_0px_0px_var(--color-ink)]">
                  <Star className="h-8 w-8 fill-current" strokeWidth={2.5} />
                </span>
                <h3 className="font-blocky text-2xl font-bold uppercase tracking-tight">
                  Inquiry received!
                </h3>
                <p className="max-w-sm text-sm font-medium leading-relaxed text-ink/70">
                  Thanks — your event brief is on the production desk. Expect a
                  response within one business day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-5">
                <input
                  type="hidden"
                  name="_subject"
                  value="New event inquiry — Kalakaar Studios"
                />
                <input type="hidden" name="_captcha" value="false" />

                {formError && (
                  <div className="border-2 border-ink bg-[#fecaca] px-4 py-3 text-sm font-bold text-ink">
                    Oops — that didn&apos;t go through. Email us directly at
                    Kalakaarstudios@ssociopro.com
                  </div>
                )}

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-xs font-bold uppercase tracking-widest"
                    >
                      Full name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      placeholder="Priya Sharma"
                      className="mt-2 w-full border-2 border-ink bg-cream px-4 py-3 text-sm font-medium outline-none transition-shadow focus:shadow-[3px_3px_0px_0px_var(--color-ink)]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-bold uppercase tracking-widest"
                    >
                      Work email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="you@company.com"
                      className="mt-2 w-full border-2 border-ink bg-cream px-4 py-3 text-sm font-medium outline-none transition-shadow focus:shadow-[3px_3px_0px_0px_var(--color-ink)]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="event-type"
                    className="block text-xs font-bold uppercase tracking-widest"
                  >
                    Event type
                  </label>
                  <select
                    id="event-type"
                    name="event-type"
                    defaultValue=""
                    className="mt-2 w-full border-2 border-ink bg-cream px-4 py-3 text-sm font-medium outline-none transition-shadow focus:shadow-[3px_3px_0px_0px_var(--color-ink)]"
                  >
                    <option value="" disabled>
                      Select an event type
                    </option>
                    {eventTypes.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-5 sm:grid-cols-3">
                  <div>
                    <label
                      htmlFor="attendees"
                      className="block text-xs font-bold uppercase tracking-widest"
                    >
                      Attendees
                    </label>
                    <input
                      type="text"
                      id="attendees"
                      name="attendees"
                      placeholder="e.g. 500"
                      className="mt-2 w-full border-2 border-ink bg-cream px-4 py-3 text-sm font-medium outline-none transition-shadow focus:shadow-[3px_3px_0px_0px_var(--color-ink)]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="location"
                      className="block text-xs font-bold uppercase tracking-widest"
                    >
                      City
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      placeholder="e.g. Mumbai"
                      className="mt-2 w-full border-2 border-ink bg-cream px-4 py-3 text-sm font-medium outline-none transition-shadow focus:shadow-[3px_3px_0px_0px_var(--color-ink)]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="budget"
                      className="block text-xs font-bold uppercase tracking-widest"
                    >
                      Budget range
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      defaultValue=""
                      className="mt-2 w-full border-2 border-ink bg-cream px-4 py-3 text-sm font-medium outline-none transition-shadow focus:shadow-[3px_3px_0px_0px_var(--color-ink)]"
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      {budgetRanges.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs font-bold uppercase tracking-widest"
                  >
                    Event details *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    placeholder="Venue, date, scale, and what a successful night looks like for you."
                    className="mt-2 w-full resize-none border-2 border-ink bg-cream px-4 py-3 text-sm font-medium outline-none transition-shadow focus:shadow-[3px_3px_0px_0px_var(--color-ink)]"
                  />
                </div>

                <button
                  type="submit"
                  className={`${pillBase} w-full bg-red px-7 py-3.5 text-sm text-white sm:w-auto`}
                >
                  <Send className="h-4 w-4" strokeWidth={2.5} />
                  Send the Brief
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ─── CTA BAND ─── */}
      <section className="border-t-2 border-ink bg-sun">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-5 py-14 text-center sm:px-8">
          <Image
            src="/ks-grid-logo.png"
            alt="Kalakaar Studios"
            width={200}
            height={64}
            className="h-16 w-auto sm:h-20"
          />
          <h2 className="font-blocky text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl">
            Let&apos;s make some
            <br />
            <span className="relative z-0 inline-block whitespace-nowrap">
              <svg
                viewBox="0 0 180 26"
                preserveAspectRatio="none"
                aria-hidden="true"
                className="absolute left-0 top-[45%] -z-10 h-[90%] w-full"
              >
                <path
                  d="M4 13 C 40 5, 90 20, 176 10"
                  stroke="#F2EE07"
                  strokeWidth="14"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              noise.
            </span>
          </h2>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row">
            <a href="#contact" className={`${pillBase} bg-red px-7 py-3.5 text-sm text-white`}>
              <CalendarPlus className="h-4 w-4" strokeWidth={2.5} />
              Book a Call
            </a>
            <a
              href="mailto:Kalakaarstudios@ssociopro.com"
              className={`${pillBase} bg-sun px-7 py-3.5 text-sm`}
            >
              <Mail className="h-4 w-4" strokeWidth={2.5} />
              Email the Studio
            </a>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-ink text-cream">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <a href="#" className="inline-flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Kalakaar Studios"
                width={200}
                height={200}
                className="h-8 w-auto"
              />
              <Image
                src="/ks-grid-logo.png"
                alt="Kalakaar Studios"
                width={200}
                height={64}
                className="h-8 w-auto"
              />
            </a>
            <p className="mt-4 max-w-sm text-sm font-medium leading-relaxed text-cream/60">
              A full-service event production and management studio in Patna,
              making chaos look effortless since 2025. Plan it, build it, run
              it — loudly.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5 text-xs font-bold uppercase tracking-wide">
              <a
                href="https://www.instagram.com/kalakaar_studios1/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 border-2 border-cream px-3 py-1.5 transition-colors hover:bg-sun hover:text-ink"
              >
                <AtSign className="h-3.5 w-3.5" strokeWidth={2.5} />
                @kalakaar_studios1
              </a>
              <a
                href="https://www.linkedin.com/company/kalakaar-studios01/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 border-2 border-cream px-3 py-1.5 transition-colors hover:bg-sun hover:text-ink"
              >
                <Globe className="h-3.5 w-3.5" strokeWidth={2.5} />
                LinkedIn
              </a>
              <span className="inline-flex items-center gap-1.5 border-2 border-cream px-3 py-1.5">
                <Clapperboard className="h-3.5 w-3.5" strokeWidth={2.5} />
                YouTube — soon
              </span>
            </div>
          </div>

          <nav className="flex flex-col gap-3">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-sun">
              Explore
            </p>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-cream/60 transition-colors hover:text-cream"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              className="text-sm font-medium text-cream/60 transition-colors hover:text-cream"
            >
              Contact
            </a>
          </nav>

          <nav className="flex flex-col gap-3">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-sun">
              Legal
            </p>
            <Link
              href="/terms"
              className="text-sm font-medium text-cream/60 transition-colors hover:text-cream"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="text-sm font-medium text-cream/60 transition-colors hover:text-cream"
            >
              Privacy Policy
            </Link>
            <p className="mt-2 text-sm text-cream/40">
              Bhub, Maurya Lok, Block A
              <br />
              Fifth Floor, Patna, Bihar
            </p>
          </nav>
        </div>

        <div className="border-t border-cream/15">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-5 text-xs font-medium text-cream/50 sm:px-8">
            <p>
              &copy; {new Date().getFullYear()} Kalakaar Studios. All rights
              reserved.
            </p>
            <p className="inline-flex items-center gap-1.5">
              Made with <Sparkles className="h-3.5 w-3.5 text-sun" strokeWidth={2.5} /> and
              full-volume monitors
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Dot() {
  return <span className="flex h-1.5 w-1.5 rotate-45 bg-ink/40" />;
}

function MaybeStar() {
  return <span className="text-ink/60">★</span>;
}