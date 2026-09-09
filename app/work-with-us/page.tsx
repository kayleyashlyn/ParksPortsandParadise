import type { Metadata } from "next";
import { Check } from "lucide-react";

import { FaqList } from "@/components/faq-list";
import { WorkWithUsForm } from "@/components/work-with-us-form";
import { pageMetadata } from "@/lib/seo";
import { ACCREDITATIONS, CONTACT, SELLER_OF_TRAVEL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Work With Us",
  description:
    "Join Parks Ports & Paradise as a travel advisor. Training, established supplier relationships, and a small, supportive team — for experienced agents and newcomers alike.",
  path: "/work-with-us",
});

/**
 * Agent-recruiting page (IMPLEMENTATION_PLAN.md §9, "Prospective Agent" persona
 * in §3). Restrained by design — this is a working page, not a hero showcase.
 * The application form posts to `/api/work-with-us` (Resend notification to the
 * business inbox); résumés come in by email so the site needs no file storage.
 */
export default function WorkWithUsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-wider text-primary">
          Join the team
        </p>
        <h1 className="mt-2 text-balance text-4xl sm:text-5xl">
          Become a Parks Ports &amp; Paradise advisor
        </h1>
        <p className="mt-4 text-pretty text-muted-foreground">
          Whether you&rsquo;re an experienced advisor with an established book of
          business or just starting out in the industry, we&rsquo;d love to hear
          from you. We offer real training, established supplier relationships,
          and a small team that actually enjoys the work.
        </p>
      </header>

      <section className="mt-12" aria-labelledby="why-heading">
        <h2 id="why-heading" className="text-2xl">
          Why advisors join us
        </h2>
        <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
          {[
            "Onboarding, training, and ongoing mentorship — no one is left to figure it out alone.",
            "Established relationships with cruise lines, resorts, and theme-park partners.",
            "You keep your clients and your book of business.",
            "A supportive, low-drama team that shares supplier knowledge freely.",
          ].map((point) => (
            <li key={point} className="flex gap-2.5">
              <Check
                aria-hidden
                className="mt-0.5 h-4 w-4 shrink-0 text-primary"
              />
              <span>{point}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted-foreground">
          {SELLER_OF_TRAVEL.join(" · ")} · {ACCREDITATIONS.join(" · ")}
        </p>
      </section>

      <section className="mt-14" aria-labelledby="apply-heading">
        <h2 id="apply-heading" className="text-2xl">
          Apply
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Fill out the form below, then email your résumé to{" "}
          <a
            className="font-medium text-primary underline underline-offset-2"
            href={`mailto:${CONTACT.email}`}
          >
            {CONTACT.email}
          </a>
          . Prefer to reach out directly? That email works too.
        </p>
        <div className="mt-6">
          <WorkWithUsForm />
        </div>
      </section>

      <section className="mt-14" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-2xl">
          Frequently asked questions
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Starting-point answers — anything specific to your situation is covered
          during onboarding.
        </p>
        <div className="mt-6">
          <FaqList
            items={[
              {
                q: "Do you require experience?",
                a: "No. We work with seasoned advisors bringing an existing book of business and with newer agents who are serious about building one. Training and mentorship are part of onboarding either way.",
              },
              {
                q: "Do you provide Errors and Omissions (E&O) insurance?",
                a: "We confirm current E&O coverage and any requirements during onboarding.",
              },
              {
                q: "What is the agency culture like?",
                a: "Small, supportive, and genuinely enthusiastic about travel. We share supplier knowledge, celebrate each other's bookings, and keep the pressure on the trips — not on each other.",
              },
              {
                q: "How quickly can I start selling after onboarding?",
                a: "Once onboarding is complete and any required supplier certifications are done (for example the College of Disney Knowledge or CLIA training), you can start booking right away.",
              },
            ]}
          />
        </div>
      </section>
    </div>
  );
}
