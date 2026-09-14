"use client";

import { useState } from "react";

const eventTypes = [
  "Concert / live show",
  "Corporate experiential event",
  "Private gala",
  "Brand activation / product launch",
  "Other",
];

const budgetRanges = [
  "Below ₹5,00,000",
  "₹5,00,000 – ₹15,00,000",
  "₹15,00,000 – ₹40,00,000",
  "Above ₹40,00,000",
  "Prefer to discuss",
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(false);
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
          setSubmitted(true);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      }
    } else {
      setSubmitted(true);
    }
  }

  return (
    <section id="contact" className="border-b border-line">
      <div className="mx-auto max-w-5xl px-6 py-20 md:py-24">
        <div className="grid gap-14 md:grid-cols-[1fr_1.6fr]">
          <div>
            <p className="kicker text-brass-deep">Contact</p>
            <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-graphite md:text-4xl">
              Book an Event
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-smoke">
              For concerts, corporate experiential events, galas, and brand
              activations. Share the essentials and our production team will
              respond within one business day with a scoping call and a
              ballpark budget.
            </p>
            <dl className="mt-10 space-y-6 text-sm">
              <div>
                <dt className="kicker font-semibold text-smoke">Email</dt>
                <dd className="mt-1.5 text-graphite">
                  Kalakaarstudios@ssociopro.com
                </dd>
              </div>
              <div>
                <dt className="kicker font-semibold text-smoke">
                  Production office
                </dt>
                <dd className="mt-1.5 leading-relaxed text-graphite">
                  Kalakaar Studios
                  <br />
                  Bhub, Maurya Lok, Block A
                  <br />
                  Fifth Floor, Patna, Bihar
                </dd>
              </div>
            </dl>
          </div>

          <div>
            {submitted ? (
              <div className="rounded-md border border-brass/40 bg-paper px-8 py-16 text-center">
                <h3 className="font-serif text-2xl font-medium text-graphite">
                  Inquiry received
                </h3>
                <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-smoke">
                  Thank you. Your event inquiry has been registered and will be
                  reviewed by the production team. We will respond within one
                  business day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <input type="hidden" name="_subject" value="New event inquiry — kalakaarstudios.co.in" />
                <input type="hidden" name="_template" value="table" />
                <input type="hidden" name="_captcha" value="false" />

                {error && (
                  <div className="rounded-sm border border-red-300 bg-red-50 px-5 py-3 text-sm text-red-800">
                    Something went wrong. Please email us directly at{" "}
                    <span className="font-medium">Kalakaarstudios@ssociopro.com</span>
                  </div>
                )}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="kicker block font-semibold text-smoke"
                    >
                      Full name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      placeholder="Priya Sharma"
                      className="mt-2 w-full rounded-sm border border-line bg-paper px-4 py-3 text-sm text-graphite placeholder-smoke/60 outline-none transition-colors focus:border-brass focus:ring-1 focus:ring-brass"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="kicker block font-semibold text-smoke"
                    >
                      Work email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="you@company.com"
                      className="mt-2 w-full rounded-sm border border-line bg-paper px-4 py-3 text-sm text-graphite placeholder-smoke/60 outline-none transition-colors focus:border-brass focus:ring-1 focus:ring-brass"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="event-type"
                    className="kicker block font-semibold text-smoke"
                  >
                    Event type
                  </label>
                  <select
                    id="event-type"
                    name="event-type"
                    defaultValue=""
                    className="mt-2 w-full rounded-sm border border-line bg-paper px-4 py-3 text-sm text-graphite outline-none transition-colors focus:border-brass focus:ring-1 focus:ring-brass"
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

                <div className="grid gap-6 sm:grid-cols-3">
                  <div>
                    <label
                      htmlFor="attendees"
                      className="kicker block font-semibold text-smoke"
                    >
                      Expected attendees
                    </label>
                    <input
                      type="text"
                      id="attendees"
                      name="attendees"
                      placeholder="e.g. 500"
                      className="mt-2 w-full rounded-sm border border-line bg-paper px-4 py-3 text-sm text-graphite placeholder-smoke/60 outline-none transition-colors focus:border-brass focus:ring-1 focus:ring-brass"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="location"
                      className="kicker block font-semibold text-smoke"
                    >
                      Location / city
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      placeholder="e.g. Mumbai"
                      className="mt-2 w-full rounded-sm border border-line bg-paper px-4 py-3 text-sm text-graphite placeholder-smoke/60 outline-none transition-colors focus:border-brass focus:ring-1 focus:ring-brass"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="budget"
                      className="kicker block font-semibold text-smoke"
                    >
                      Budget range
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      defaultValue=""
                      className="mt-2 w-full rounded-sm border border-line bg-paper px-4 py-3 text-sm text-graphite outline-none transition-colors focus:border-brass focus:ring-1 focus:ring-brass"
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
                    className="kicker block font-semibold text-smoke"
                  >
                    Event details
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    placeholder="Venue, date, scale, and what a successful show looks like for you."
                    className="mt-2 w-full resize-none rounded-sm border border-line bg-paper px-4 py-3 text-sm text-graphite placeholder-smoke/60 outline-none transition-colors focus:border-brass focus:ring-1 focus:ring-brass"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-sm bg-graphite px-7 py-3.5 text-sm tracking-wide text-ivory transition-colors hover:bg-graphite-soft sm:w-auto"
                >
                  Send inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}