"use client";

import Link from "next/link";
import Image from "next/image";
import { Oswald } from "next/font/google";
import { useState } from "react";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const navLinks = [
  { label: "SERVICES", href: "#services" },
  { label: "PORTFOLIO / SHOWREEL", href: "#portfolio" },
  { label: "EVENT PRODUCTION", href: "#production" },
  { label: "CONTACT", href: "#contact" },
];

const services = [
  {
    title: "Corporate Galas & Launch Events",
    desc: "High-stakes corporate galas, product launches, and brand unveilings — staged with precision and executive polish.",
    accent: "bg-cn-cyan",
  },
  {
    title: "Live Concerts & Music Festivals",
    desc: "Multi-stage festival builds, headline concerts, and large-scale live music production across venues and open-air sites.",
    accent: "bg-cn-coral",
  },
  {
    title: "Staging, Lighting & Audio Engineering",
    desc: "Custom stage architecture, concert-grade lighting rigs, and broadcast-quality audio — designed, rigged, and operated end to end.",
    accent: "bg-cn-lime",
  },
  {
    title: "Brand Activations & Pop-ups",
    desc: "Immersive brand experiences, interactive pop-ups, and guerrilla campaigns built to convert footfall into measurable engagement.",
    accent: "bg-cn-cyan",
  },
  {
    title: "Private Celebrations & Weddings",
    desc: "Luxury weddings, milestone celebrations, and intimate private events — curated with white-glove attention to every detail.",
    accent: "bg-cn-coral",
  },
  {
    title: "Talent & Artist Management",
    desc: "Booking, rider fulfilment, stage coordination, and day-of artist liaison — keeping talent comfortable and shows on time.",
    accent: "bg-cn-lime",
  },
];

const recentWork = [
  {
    title: "TechForward Annual Summit",
    category: "Corporate Gala",
    detail: "1,200 attendees · Bengaluru",
    tagColor: "bg-cn-cyan",
  },
  {
    title: "Monsoon Bass Festival",
    category: "Concert Production",
    detail: "8,600 attendees · Mumbai",
    tagColor: "bg-cn-coral",
  },
  {
    title: "Luxeweave Brand Unveiling",
    category: "Brand Activation",
    detail: "3,400 visitors · Hyderabad",
    tagColor: "bg-cn-lime",
  },
  {
    title: "Mehta Family Wedding",
    category: "Private Celebration",
    detail: "650 guests · Jaipur",
    tagColor: "bg-cn-cyan",
  },
  {
    title: "Groove Nation Open Air",
    category: "Music Festival",
    detail: "12,000 attendees · Pune",
    tagColor: "bg-cn-coral",
  },
  {
    title: "Vertex Product Launch",
    category: "Corporate Launch",
    detail: "800 attendees · New Delhi",
    tagColor: "bg-cn-lime",
  },
];

export default function Home() {
  const [bannerVisible, setBannerVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div
      className={`${oswald.variable} min-h-screen bg-cn-dark font-blocky text-white`}
    >
      {/* ─── BOOKING BANNER ─── */}
      {bannerVisible && (
        <div className="relative bg-cn-cyan px-6 py-3 text-center text-xs font-bold tracking-widest text-black sm:text-sm">
          <span>
            NOW BOOKING FOR SEASON 2026–2027 &nbsp;|&nbsp; GET A FREE EVENT
            PROPOSAL
          </span>
          <button
            type="button"
            onClick={() => setBannerVisible(false)}
            aria-label="Close banner"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-black/50 transition-colors hover:text-black"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>
      )}

      {/* ─── STICKY HEADER ─── */}
      <header className="sticky top-0 z-50 border-b-2 border-cn-cyan bg-black">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center bg-white px-3 py-1.5 font-extrabold tracking-tight text-black sm:px-4 sm:py-2 sm:text-xl"
          >
            KALAKAAR STUDIOS
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-bold tracking-widest text-white transition-colors hover:text-cn-cyan"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            href="#contact"
            className="hidden bg-cn-cyan px-5 py-2 text-sm font-extrabold tracking-wider text-black transition-colors hover:bg-white lg:inline-block"
          >
            GET A QUOTE
          </a>

          <button
            type="button"
            className="flex flex-col gap-[5px] lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <span
              className={`block h-[3px] w-6 bg-white transition-transform ${
                mobileMenuOpen ? "translate-y-[8px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-[3px] w-6 bg-cn-cyan transition-opacity ${
                mobileMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-[3px] w-6 bg-white transition-transform ${
                mobileMenuOpen ? "-translate-y-[8px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="border-t border-white/10 bg-black px-6 pb-5 pt-3 lg:hidden">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block border-b border-white/10 py-3.5 text-sm font-bold tracking-widest text-white transition-colors hover:text-cn-cyan"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-4 block bg-cn-cyan py-3.5 text-center text-sm font-extrabold tracking-wider text-black"
            >
              GET A QUOTE
            </a>
          </nav>
        )}
      </header>

      {/* ─── HERO ─── */}
      <section className="bg-cn-cyan">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-6 py-16 sm:px-6 md:grid-cols-2 md:py-24 lg:px-8">
          <div className="order-2 md:order-1">
            <span className="inline-block bg-black px-3 py-1 text-xs font-bold tracking-widest text-cn-cyan">
              EVENT PRODUCTION &amp; MANAGEMENT
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-black sm:text-5xl lg:text-6xl">
              UNFORGETTABLE
              <br />
              EVENTS.
              <br />
              <span className="text-white">HIGH-OCTANE</span>
              <br />
              PRODUCTION.
            </h1>
            <p className="mt-5 max-w-md text-base font-medium leading-relaxed text-black/70">
              From concerts and corporate galas to luxury weddings and brand
              activations — Kalakaar Studios builds and runs events that leave
              audiences talking.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#contact"
                className="inline-block bg-black px-8 py-3.5 text-center text-sm font-extrabold tracking-widest text-white transition-colors hover:bg-white hover:text-black"
              >
                BOOK AN EVENT
              </a>
              <a
                href="#portfolio"
                className="inline-block border-2 border-black px-8 py-3.5 text-center text-sm font-extrabold tracking-widest text-black transition-colors hover:bg-black hover:text-white"
              >
                WATCH SHOWREEL
              </a>
            </div>
          </div>

          <div className="order-1 flex items-center justify-center md:order-2">
            <div className="flex aspect-video w-full flex-col items-center justify-center border-4 border-black bg-black p-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-16 w-16 text-cn-cyan"
              >
                <path
                  fillRule="evenodd"
                  d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="mt-4 text-xs font-bold tracking-widest text-white/40">
                EVENT HIGHLIGHT REEL
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── COMPANY PROFILE ─── */}
      <section className="border-y border-white/10 bg-cn-card">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-6 py-14 sm:flex-row sm:items-start sm:px-6 lg:px-8">
          <div className="flex shrink-0 items-center justify-center bg-white p-6">
            <Image
              src="/logo.png"
              alt="Kalakaar Studios logo"
              width={1024}
              height={1024}
              className="h-24 w-auto sm:h-28"
            />
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              THE COMPANY
            </h2>
            <p className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-gray-400 sm:text-base">
              Kalakaar Studios is a full-service event production and
              management company operating across India. We design and build
              custom stage architecture, rig concert-grade lighting and audio
              systems, coordinate multi-vendor logistics, and manage
              end-to-end event operations — from the first production meeting
              to the final load-out. Our talent desk handles artist booking,
              rider fulfilment, and day-of stage coordination so every show
              lands on time and on brief.
            </p>
          </div>
        </div>
      </section>

      {/* ─── SERVICES / WHAT WE PRODUCE ─── */}
      <section id="services" className="bg-cn-dark">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            WHAT WE{" "}
            <span className="text-cn-cyan">PRODUCE</span>
          </h2>
          <p className="mt-3 max-w-lg text-sm font-medium text-gray-400">
            Six production disciplines, one accountable company — from concept
            to curtain call.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.title}
                className="group border border-white/10 bg-cn-card transition-colors hover:border-cn-cyan"
              >
                <div className={`h-1.5 w-full ${service.accent}`} />
                <div className="p-6">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                    {service.title}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4 text-cn-cyan"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-400">
                    {service.desc}
                  </p>
                  <a
                    href="#contact"
                    className="mt-5 inline-block text-sm font-bold text-cn-cyan transition-colors hover:text-white"
                  >
                    LEARN MORE
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── RECENT WORK / PORTFOLIO ─── */}
      <section id="portfolio" className="border-y border-white/10 bg-cn-card">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            RECENT{" "}
            <span className="text-cn-coral">WORK</span>
          </h2>
          <p className="mt-3 max-w-lg text-sm font-medium text-gray-400">
            A selection of the events we&apos;ve staged, produced, and run.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recentWork.map((project) => (
              <article
                key={project.title}
                className="group border border-white/10 bg-black transition-colors hover:border-cn-cyan"
              >
                <div className="flex aspect-video items-center justify-center bg-cn-dark">
                  <span className="text-4xl font-extrabold text-white/10 transition-colors group-hover:text-cn-cyan/30">
                    KS
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-bold tracking-widest text-black ${project.tagColor}`}
                    >
                      {project.category.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-white">
                    {project.title}
                  </h3>
                  <p className="mt-1 text-xs font-medium text-gray-500">
                    {project.detail}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRODUCTION PROCESS ─── */}
      <section id="production" className="bg-cn-dark">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            EVENT{" "}
            <span className="text-cn-lime">PRODUCTION</span>
          </h2>
          <p className="mt-3 max-w-lg text-sm font-medium text-gray-400">
            From first brief to final bow — how we run every event.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "01",
                title: "BRIEF & SCOPING",
                desc: "Kickoff call, site visit, budget alignment, and a written production scope — no ambiguity.",
                color: "text-cn-cyan",
              },
              {
                step: "02",
                title: "DESIGN & PLANNING",
                desc: "Stage CAD, lighting plots, audio maps, vendor shortlists, and the master production schedule.",
                color: "text-cn-coral",
              },
              {
                step: "03",
                title: "BUILD & RIG",
                desc: "Stage construction, AV load-in, lighting focus, sound checks, and full technical rehearsal.",
                color: "text-cn-lime",
              },
              {
                step: "04",
                title: "SHOW & LOAD-OUT",
                desc: "Live show-call, on-ground ops, real-time troubleshooting, crew coordination, and demob.",
                color: "text-cn-cyan",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="border border-white/10 bg-cn-card p-6 transition-colors hover:border-cn-cyan"
              >
                <span className="font-blocky text-3xl font-extrabold text-white/15">
                  {item.step}
                </span>
                <h3
                  className={`mt-3 text-sm font-bold tracking-widest ${item.color}`}
                >
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONTACT / CTA ─── */}
      <section id="contact" className="border-y border-white/10 bg-cn-cyan">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
              READY TO PRODUCE YOUR NEXT EVENT?
            </h2>
            <p className="mt-4 text-sm font-medium text-black/60">
              Tell us the scale and we&apos;ll come back with a production
              proposal within 24 hours.
            </p>
            <a
              href="mailto:Kalakaarstudios@ssociopro.com"
              className="mt-8 inline-block bg-black px-10 py-4 text-sm font-extrabold tracking-widest text-white transition-colors hover:bg-white hover:text-black"
            >
              GET A FREE PROPOSAL
            </a>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-black">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-lg font-extrabold tracking-tight text-white">
                KALAKAAR STUDIOS
              </p>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">
                Event production &amp; management company — concerts, galas,
                brand activations, and private celebrations across 12 cities in
                India.
              </p>
            </div>

            <div>
              <p className="text-xs font-bold tracking-widest text-cn-cyan">
                NAVIGATION
              </p>
              <nav className="mt-3 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            <div>
              <p className="text-xs font-bold tracking-widest text-cn-cyan">
                LEGAL
              </p>
              <nav className="mt-3 flex flex-col gap-2">
                <Link
                  href="/terms"
                  className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/privacy"
                  className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
                >
                  Privacy Policy
                </Link>
              </nav>
            </div>

            <div>
              <p className="text-xs font-bold tracking-widest text-cn-cyan">
                CONNECT
              </p>
              <div className="mt-3 flex flex-col gap-2">
                <a
                  href="mailto:Kalakaarstudios@ssociopro.com"
                  className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
                >
                  Email Us
                </a>
                <a
                  href="https://www.instagram.com/kalakaar_studios1/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-gray-400 transition-colors hover:text-cn-coral"
                >
                  Instagram
                </a>
                <a
                  href="https://youtube.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-gray-400 transition-colors hover:text-cn-coral"
                >
                  YouTube
                </a>
                <a
                  href="https://www.linkedin.com/company/kalakaar-studios01/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-gray-400 transition-colors hover:text-cn-cyan"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs font-medium text-gray-600">
            &copy; {new Date().getFullYear()} Kalakaar Studios. All rights
            reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}