import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-sand/60">
      <div className="mx-auto max-w-5xl px-6 py-14">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <Image
              src="/logo.png"
              alt="Kalakaar Studios"
              width={1024}
              height={1024}
              className="h-16 w-auto"
            />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-smoke">
              An event production &amp; event management company — concerts,
              corporate experiential events, galas, and brand activations
              across 12 cities in India.
            </p>
          </div>

          <div className="text-sm">
            <p className="kicker font-semibold text-smoke">Contact</p>
            <ul className="mt-4 space-y-3 text-smoke">
              <li>Kalakaarstudios@ssociopro.com</li>
              <li>Bhub, Maurya Lok, Block A</li>
              <li>Fifth Floor, Patna, Bihar</li>
              <li>
                <a
                  href="#contact"
                  className="transition-colors hover:text-graphite"
                >
                  Book an event
                </a>
              </li>
            </ul>
          </div>

          <div className="text-sm">
            <p className="kicker font-semibold text-smoke">Company</p>
            <ul className="mt-4 space-y-3 text-smoke">
              <li>
                <Link
                  href="/terms"
                  className="transition-colors hover:text-graphite"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="transition-colors hover:text-graphite"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a
                  href="https://crm.kalakaarstudios.co.in/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-smoke/70 transition-colors hover:text-graphite"
                >
                  Employee Login
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-smoke md:flex-row">
          <p>
            &copy; {new Date().getFullYear()} Kalakaar Studios. All rights
            reserved.
          </p>
          <p className="text-xs">
            180+ events produced &middot; 45,000+ attendees hosted &middot; 12
            cities
          </p>
        </div>
      </div>
    </footer>
  );
}