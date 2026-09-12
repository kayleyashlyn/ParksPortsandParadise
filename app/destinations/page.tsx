import type { Metadata } from "next";
import Link from "next/link";

import { DestinationFamilyCard } from "@/components/destination-family-card";
import { TrustBar } from "@/components/trust-bar";
import { Button } from "@/components/ui/button";
import { getAccreditationBadges, getDestinationFamilies } from "@/lib/sanity.queries";
import { pageMetadata } from "@/lib/seo";
import { PRIMARY_CTA } from "@/lib/site";

// ISR — re-pull CMS content at most once a minute (matches the homepage).
export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: "Destinations",
  description:
    "Theme parks, cruises, and all-inclusive resorts — the three ways we get families away. Pick a direction and our advisors build the trip around you.",
  path: "/destinations",
});

export default async function DestinationsPage() {
  const [families, badges] = await Promise.all([
    getDestinationFamilies(),
    getAccreditationBadges(),
  ]);

  return (
    <>
      {/* Intro sits in a very light Warm Taupe wash so the page reads as a
          sequence of bands (intro / trust bar / grid / CTA) instead of one
          long stretch of white — no new photography or copy, just layout and
          color, per the brand-polish pass. */}
      <div className="border-b border-border bg-brand-taupe/5">
        <header className="mx-auto max-w-[1400px] px-4 pb-8 pt-10 sm:px-6 sm:pb-10 sm:pt-12 lg:px-8">
          {/* Sand Gold kicker — a dot accent, not gold text (see
              destination-family-grid.tsx for the AA-contrast reasoning). */}
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand-secondary" />
            Explore
          </p>
          <h1 className="mt-2 max-w-2xl text-balance text-4xl sm:text-5xl">
            Destinations
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-muted-foreground">
            We plan three kinds of trips — theme parks, cruises, and
            all-inclusive resorts. Browse a family below, then tell us about
            your trip and an advisor puts together a free quote.
          </p>
        </header>
      </div>

      <TrustBar badges={badges} />

      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8">
        {families.length > 0 ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {families.map((family) => (
              <li key={family._id}>
                <DestinationFamilyCard
                  family={family}
                  headingLevel="h2"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">
            Our destination guides are being updated — check back soon.
          </p>
        )}

        <section className="mt-14 rounded-lg border border-border bg-brand-blush/10 px-6 py-10 text-center sm:px-10">
          <h2 className="text-2xl sm:text-3xl">Not sure where to start?</h2>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            Tell us who&apos;s travelling and what you&apos;re hoping for.
            We&apos;ll point you at the right trip and quote it for free.
          </p>
          <div className="mt-6">
            <Button asChild variant="secondary" size="lg">
              <Link href={PRIMARY_CTA.href}>{PRIMARY_CTA.label}</Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
