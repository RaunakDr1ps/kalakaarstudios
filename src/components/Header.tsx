"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const links = [
  { label: "Past Events", href: "/#past-events" },
  { label: "Services", href: "/#services" },
  { label: "About", href: "/#about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/#contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
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
              className="group relative text-sm font-semibold tracking-wide text-ink/70 transition-colors hover:text-ink"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-sun transition-all group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <a
            href="/admin/blogs"
            className="inline-flex items-center justify-center rounded-md border-2 border-ink bg-sun px-5 py-2 text-sm font-semibold tracking-wide text-ink shadow-[3px_3px_0px_0px_#000000] transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000000]"
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
            className={`block h-[3px] w-6 bg-ink transition-transform ${
              open ? "translate-y-[3px] rotate-45" : ""
            }`}
          />
          <span
            className={`mt-1.5 block h-[3px] w-6 bg-ink transition-opacity ${
              open ? "opacity-0" : ""
            }`}
          />
        </button>
      </div>

      {open && (
        <nav className="border-t-2 border-ink bg-white px-6 pb-6 pt-2 md:hidden">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block border-b border-ink/10 py-3.5 text-sm font-semibold tracking-wide text-ink/70 transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/admin/blogs"
            className="mt-5 inline-flex items-center justify-center rounded-md border-2 border-ink bg-sun px-5 py-2 text-sm font-semibold tracking-wide text-ink shadow-[3px_3px_0px_0px_#000000]"
          >
            Employee Portal
          </a>
        </nav>
      )}
    </header>
  );
}