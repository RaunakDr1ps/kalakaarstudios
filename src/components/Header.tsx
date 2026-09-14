"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const links = [
  { label: "Past Events", href: "/#past-events" },
  { label: "Services", href: "/#services" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ivory/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center" aria-label="Kalakaar Studios — home">
          <Image
            src="/logo.png"
            alt="Kalakaar Studios"
            width={1024}
            height={1024}
            className="h-10 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm tracking-wide text-smoke transition-colors hover:text-graphite"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <a
            href="https://crm.kalakaarstudios.co.in/login"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm border border-graphite/30 px-5 py-2 text-sm tracking-wide text-graphite transition-colors hover:border-graphite hover:bg-graphite hover:text-ivory"
          >
            Employee Portal
          </a>
        </div>

        <button
          type="button"
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span
            className={`block h-px w-6 bg-graphite transition-transform ${
              open ? "translate-y-[3px] rotate-45" : ""
            }`}
          />
          <span
            className={`mt-1.5 block h-px w-6 bg-graphite transition-opacity ${
              open ? "opacity-0" : ""
            }`}
          />
        </button>
      </div>

      {open && (
        <nav className="border-t border-line bg-ivory px-6 pb-6 pt-2 md:hidden">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block border-b border-line/60 py-3.5 text-sm tracking-wide text-smoke transition-colors hover:text-graphite"
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://crm.kalakaarstudios.co.in/login"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-block rounded-sm border border-graphite/30 px-5 py-2 text-sm tracking-wide text-graphite transition-colors hover:border-graphite hover:bg-graphite hover:text-ivory"
          >
            Employee Portal
          </a>
        </nav>
      )}
    </header>
  );
}