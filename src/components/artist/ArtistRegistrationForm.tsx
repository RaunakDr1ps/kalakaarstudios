"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Megaphone, UserPlus } from "lucide-react";
import {
  BIHAR_CITIES,
  GENRES,
  registerArtist,
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

export default function ArtistRegistrationForm() {
  const router = useRouter();
  const [form, setForm] = useState<ArtistRegistration>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [banner, setBanner] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
        router.push("/register/artist/thank-you");
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
        No entry fee — ever. We only use your details for Bihar Got Talent
        audition communications.
      </p>
    </form>
  );
}