import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | Kalakaar Studios",
  description:
    "How Kalakaar Studios collects, uses, and protects personal and business contact data.",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-20 md:py-28">
        <p className="kicker text-brass-deep">Legal</p>
        <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-graphite">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm text-smoke">
          Last updated: January 2026. This policy describes how Kalakaar Studios
          processes personal and business contact data.
        </p>

      <div className="mt-12 space-y-10">
        {[
          {
            title: "1. Data we collect",
            body: "Where relevant to an event, we collect contact data — names, roles, company details, work email addresses, and phone numbers — for guest lists, event coordination, and hospitality. We do not collect more data than an event requires.",
          },
          {
            title: "2. How we use data",
            body: "Contact data is processed to manage guest lists, coordinate event logistics, run the event, and report on outcomes. Where a client has supplied the data, it is processed on that client's instruction and for no unrelated purpose.",
          },
          {
            title: "3. Storage and security",
            body: "Event data is held in our own internal systems and provided the same protection we apply to our own records. Access is limited to the personnel required to produce an event, on a need-to-know basis.",
          },
          {
            title: "4. Sharing",
            body: "We do not sell, rent, or trade contact data. Data is shared only (a) with the client who supplied it or on whose behalf it was collected, (b) with contracted vendors strictly necessary to deliver an event under confidentiality obligations, or (c) where disclosure is required by law.",
          },
          {
            title: "5. Retention",
            body: "Contact data is retained for as long as it is needed to perform the relevant event and to comply with legal and accounting obligations, after which it is deleted or anonymised.",
          },
          {
            title: "6. Your rights",
            body: "Individuals may request access to, correction of, or deletion of their personal data by writing to Kalakaarstudios@ssociopro.com. Requests are actioned within thirty days. Where a request relates to data supplied by a client on their behalf, we coordinate with that client.",
          },
          {
            title: "7. Website analytics",
            body: "This website does not embed third-party advertising trackers. Basic technical logs may record page loads to keep the site operational and diagnose faults.",
          },
          {
            title: "8. Changes to this policy",
            body: "We may update this policy as our operations evolve. Material changes are reflected by an updated 'Last updated' date above.",
          },
        ].map((section) => (
          <section key={section.title}>
            <h2 className="font-serif text-xl font-medium text-graphite">
              {section.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-smoke">
              {section.body}
            </p>
          </section>
        ))}
      </div>

      <p className="mt-14 border-t border-line pt-6 text-sm text-smoke">
        Privacy questions:{" "}
        <span className="text-graphite">Kalakaarstudios@ssociopro.com</span>
      </p>
    </main>
      <Footer />
    </>
  );
}