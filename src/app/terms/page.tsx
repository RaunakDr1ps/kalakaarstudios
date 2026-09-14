import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service | Kalakaar Studios",
  description:
    "The terms governing events, productions, and use of Kalakaar Studios' services.",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-20 md:py-28">
        <p className="kicker text-brass-deep">Legal</p>
        <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-graphite">
          Terms of Service
        </h1>
        <p className="mt-4 text-sm text-smoke">
          Last updated: January 2026. These terms govern every engagement between
          a client and Kalakaar Studios.
        </p>

      <div className="mt-12 space-y-10">
        {[
          {
            title: "1. Scope of services",
            body: "Kalakaar Studios provides event production and event management services: concert and live series production, corporate experiential events, private galas, and brand activations. A written production agreement defines the deliverables, timelines, and fees for each event. No work is executed without a signed agreement.",
          },
          {
            title: "2. Fees",
            body: "Clients are charged fees agreed in advance and recorded in the production agreement. Kalakaar Studios does not add markups, undisclosed charges, or hidden line items. Any reimbursable third-party costs are itemised and approved by the client before being incurred.",
          },
          {
            title: "3. Client obligations",
            body: "Clients agree to provide accurate event details, venue access, timely approvals, and the materials reasonably required to produce an event. Kalakaar Studios is not liable for delays caused by missing or late client inputs.",
          },
          {
            title: "4. Intellectual property",
            body: "Concepts, stage designs, materials, and media created by Kalakaar Studios for an event remain the property of the client once the final invoice for the event is settled. Production methodology and internal tooling remain the property of Kalakaar Studios.",
          },
          {
            title: "5. Data and confidentiality",
            body: "Guest lists and attendee data shared by clients are processed solely to deliver the agreed event, under the terms described in our Privacy Policy. Event particulars, pricing, and client identities are treated as confidential unless disclosure is required by law.",
          },
          {
            title: "6. Liability",
            body: "Kalakaar Studios is liable only for direct losses arising from its own negligence, capped at the total fees paid under the relevant engagement. Neither party is liable for indirect or consequential losses.",
          },
          {
            title: "7. Termination",
            body: "Either party may terminate an engagement with fourteen days' written notice. Fees for work delivered up to the termination date remain payable, and in-progress deliverables are provided at the client's request.",
          },
          {
            title: "8. Governing law",
            body: "These terms are governed by the laws of India. Disputes are subject to the exclusive jurisdiction of the courts of Patna, Bihar.",
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
        For questions about these terms, write to{" "}
        <span className="text-graphite">Kalakaarstudios@ssociopro.com</span>.
      </p>
    </main>
      <Footer />
    </>
  );
}