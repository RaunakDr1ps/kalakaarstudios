"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AtSign,
  CheckCircle2,
  Copy,
  Loader2,
  Megaphone,
  Send,
  Sparkles,
  UserPlus,
} from "lucide-react";
import {
  BIHAR_CITIES,
  GENRES,
  registerArtist,
  saveArtistSession,
  validateRegistration,
  type ArtistRegistration,
} from "@/lib/artist";

const emptyForm: ArtistRegistration = {
  fullName: "",
  email: "",
  phone: "",
  genre: "",
  city: "",
  portfolio: "",
  bio: "",
  consent: false,
  company: "",
};

const fieldBase =
  "mt-2 w-full border-2 border-ink bg-white px-4 py-3 text-sm font-medium text-ink outline-none transition-shadow placeholder:text-ink/35 focus:shadow-[3px_3px_0px_0px_var(--color-ink)]";

const labelBase = "block text-xs font-bold uppercase tracking-widest text-ink";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-xs font-bold text-red" role="alert">
      {message}
    </p>
  );
}

type SuccessState = {
  artistId?: string;
  emailSent?: boolean;
  fallback?: boolean;
};

export default function ArtistRegistrationForm() {
  const [form, setForm] = useState<ArtistRegistration>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [banner, setBanner] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<SuccessState | null>(null);
  const [copied, setCopied] = useState(false);

  function update<K extends keyof ArtistRegistration>(
    key: K,
    value: ArtistRegistration[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key as string]) return prev;
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    setBanner(null);
    const clientErrors = validateRegistration(form);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      setBanner("Please fix the highlighted fields and try again.");
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      const res = await registerArtist(form);
      if (res.ok) {
        saveArtistSession({
          email: form.email.trim().toLowerCase(),
          name: form.fullName.trim(),
          genre: form.genre,
          city: form.city.trim(),
          registeredAt: new Date().toISOString(),
        });
        setDone({
          artistId: res.artistId,
          emailSent: res.emailSent,
          fallback: res.fallback,
        });
        return;
      }
      if (res.errors && Object.keys(res.errors).length > 0) {
        setErrors(res.errors);
        setBanner("Some details need another look.");
      } else {
        setBanner(
          res.message ??
            "Registration failed. Email Kalakaarstudios@ssociopro.com and we'll add you."
        );
      }
    } catch {
      setBanner("Something went wrong on our side. Please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return <SuccessPanel state={done} onReset={() => {
      setDone(null);
      setForm(emptyForm);
      setCopied(false);
    }} copied={copied} setCopied={setCopied} />;
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {banner && (
        <div
          className="flex items-start gap-2 border-2 border-ink bg-[#fecaca] px-4 py-3 text-sm font-bold text-ink"
          role="alert"
        >
          <Megaphone className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.5} />
          <span>{banner}</span>
        </div>
      )}

      {/* Honeypot — hidden from humans, irresistible to bots. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={form.company ?? ""}
        onChange={(e) => update("company", e.target.value)}
        className="hidden"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="artist-fullName" className={labelBase}>
            Full name *
          </label>
          <input
            id="artist-fullName"
            name="fullName"
            type="text"
            required
            autoComplete="name"
            placeholder="Priya Sharma"
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            className={fieldBase}
          />
          <FieldError message={errors.fullName} />
        </div>

        <div>
          <label htmlFor="artist-phone" className={labelBase}>
            Phone (WhatsApp preferred) *
          </label>
          <input
            id="artist-phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            placeholder="98765 43210"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className={fieldBase}
          />
          <FieldError message={errors.phone} />
        </div>
      </div>

      <div>
        <label htmlFor="artist-email" className={labelBase}>
          Email address *
        </label>
        <input
          id="artist-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          className={fieldBase}
        />
        <FieldError message={errors.email} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="artist-genre" className={labelBase}>
            Performance genre / category *
          </label>
          <select
            id="artist-genre"
            name="genre"
            required
            value={form.genre}
            onChange={(e) => update("genre", e.target.value)}
            className={fieldBase}
          >
            <option value="" disabled>
              Select your category
            </option>
            {GENRES.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
          <FieldError message={errors.genre} />
        </div>

        <div>
          <label htmlFor="artist-city" className={labelBase}>
            City / location *
          </label>
          <input
            id="artist-city"
            name="city"
            type="text"
            required
            list="bihar-cities"
            autoComplete="address-level2"
            placeholder="Patna"
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
            className={fieldBase}
          />
          <datalist id="bihar-cities">
            {BIHAR_CITIES.map((city) => (
              <option key={city} value={city} />
            ))}
          </datalist>
          <FieldError message={errors.city} />
        </div>
      </div>

      <div>
        <label htmlFor="artist-portfolio" className={labelBase}>
          Portfolio / social media link
        </label>
        <input
          id="artist-portfolio"
          name="portfolio"
          type="url"
          inputMode="url"
          placeholder="https://instagram.com/yourhandle"
          value={form.portfolio}
          onChange={(e) => update("portfolio", e.target.value)}
          className={fieldBase}
        />
        <p className="mt-1.5 text-xs font-medium text-ink/55">
          Instagram, YouTube, Spotify or a Drive link — whatever shows your best work.
        </p>
        <FieldError message={errors.portfolio} />
      </div>

      <div>
        <label htmlFor="artist-bio" className={labelBase}>
          Brief bio / past achievements *
        </label>
        <textarea
          id="artist-bio"
          name="bio"
          rows={5}
          required
          maxLength={1000}
          placeholder="What you perform, where you've performed, and any awards, opens, or milestones worth knowing."
          value={form.bio}
          onChange={(e) => update("bio", e.target.value)}
          className={`${fieldBase} resize-none`}
        />
        <div className="mt-1.5 flex items-center justify-between gap-3">
          <FieldError message={errors.bio} />
          <span className="ml-auto text-[11px] font-bold uppercase tracking-widest text-ink/40">
            {form.bio.length}/1000
          </span>
        </div>
      </div>

      <div className="border-2 border-ink bg-sun/30 px-4 py-3.5">
        <label className="flex cursor-pointer items-start gap-3 text-sm font-medium leading-relaxed text-ink">
          <input
            type="checkbox"
            name="consent"
            checked={form.consent}
            onChange={(e) => update("consent", e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#F2EE07]"
          />
          <span>
            I agree to receive Bihar Got Talent audition updates from Kalakaar
            Studios over email and WhatsApp. *
          </span>
        </label>
        <FieldError message={errors.consent} />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-ink bg-sun px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-ink shadow-[4px_4px_0px_0px_var(--color-ink)] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_var(--color-ink)] sm:w-auto"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.5} />
            Joining the roster…
          </>
        ) : (
          <>
            <UserPlus className="h-4 w-4" strokeWidth={2.5} />
            Register as an Artist
          </>
        )}
      </button>

      <p className="text-xs font-medium leading-relaxed text-ink/50">
        Already registered? Your updates live in the{" "}
        <Link
          href="/notifications"
          className="font-bold underline decoration-sun decoration-[3px] underline-offset-4 hover:text-ink"
        >
          Notification Center
        </Link>
        .
      </p>
    </form>
  );
}

/* ─── Success state ─────────────────────────────────────────────────── */

const SHARE_URL = "https://kalakaarstudios.co.in/events/bihar-got-talent";
const SHARE_TEXT =
  "I just registered for Bihar Got Talent with Kalakaar Studios — Perform, Partner & Showcase. If you've got talent from Bihar, join in!";

function SuccessPanel({
  state,
  onReset,
  copied,
  setCopied,
}: {
  state: SuccessState;
  onReset: () => void;
  copied: boolean;
  setCopied: (v: boolean) => void;
}) {
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const shares = [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT} ${SHARE_URL}`)}`,
    },
    {
      label: "X / Twitter",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(SHARE_URL)}`,
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SHARE_URL)}`,
    },
  ];

  return (
    <div className="flex flex-col items-center gap-5 py-6 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-ink bg-sun shadow-[4px_4px_0px_0px_var(--color-ink)]">
        <CheckCircle2 className="h-8 w-8" strokeWidth={2.5} />
      </span>

      <div>
        <h3 className="font-blocky text-2xl font-bold uppercase tracking-tight text-ink">
          You&apos;re on the roster!
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-relaxed text-ink/70">
          Welcome to the Kalakaar Studios Artist Network. Your Bihar Got Talent
          registration is confirmed
          {state.emailSent
            ? " and the confirmation email is on its way to your inbox."
            : state.fallback
              ? " — we'll follow up by email shortly."
              : "."}
        </p>
        {state.artistId && (
          <p className="mt-3 inline-block border-2 border-ink bg-cream px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-ink shadow-[2px_2px_0px_0px_var(--color-ink)]">
            Reg. ID · {state.artistId.slice(0, 8)}
          </p>
        )}
      </div>

      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center">
        <Link
          href="/notifications"
          className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink bg-sun px-6 py-3 text-sm font-bold uppercase tracking-wide text-ink shadow-[4px_4px_0px_0px_var(--color-ink)] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_var(--color-ink)]"
        >
          <Sparkles className="h-4 w-4" strokeWidth={2.5} />
          Open Notification Center
        </Link>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink bg-white px-6 py-3 text-sm font-bold uppercase tracking-wide text-ink transition-colors hover:bg-sun/40"
        >
          <UserPlus className="h-4 w-4" strokeWidth={2.5} />
          Register another artist
        </button>
      </div>

      <div className="w-full border-2 border-ink bg-sun/25 px-4 py-4">
        <p className="text-xs font-bold uppercase tracking-widest text-ink">
          Spread the word — talent travels fast
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2.5">
          {shares.map((share) => (
            <a
              key={share.label}
              href={share.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 border-2 border-ink bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-ink shadow-[2px_2px_0px_0px_var(--color-ink)] transition-all hover:-translate-y-0.5 hover:bg-sun"
            >
              <Send className="h-3.5 w-3.5" strokeWidth={2.5} />
              {share.label}
            </a>
          ))}
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex items-center gap-1.5 border-2 border-ink bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-ink shadow-[2px_2px_0px_0px_var(--color-ink)] transition-all hover:-translate-y-0.5 hover:bg-sun"
          >
            {copied ? (
              <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2.5} />
            ) : (
              <Copy className="h-3.5 w-3.5" strokeWidth={2.5} />
            )}
            {copied ? "Copied!" : "Copy link"}
          </button>
          <a
            href={`mailto:?subject=${encodeURIComponent("Bihar Got Talent — Kalakaar Studios")}&body=${encodeURIComponent(`${SHARE_TEXT} ${SHARE_URL}`)}`}
            className="inline-flex items-center gap-1.5 border-2 border-ink bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-ink shadow-[2px_2px_0px_0px_var(--color-ink)] transition-all hover:-translate-y-0.5 hover:bg-sun"
          >
            <AtSign className="h-3.5 w-3.5" strokeWidth={2.5} />
            Email
          </a>
        </div>
      </div>
    </div>
  );
}
