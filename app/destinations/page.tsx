import type { Metadata } from "next";
import Link from "next/link";

import { DestinationFamilyCard } from "@/components/destination-family-card";
import { Button } from "@/components/ui/button";
import { getDestinationFamilies } from "@/lib/sanity.queries";
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
  const families = await getDestinationFamilies();

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <h1 className="text-balance text-4xl sm:text-5xl">Destinations</h1>
        <p className="mt-4 text-pretty text-muted-foreground">
          We plan three kinds of trips — theme parks, cruises, and all-inclusive
          resorts. Browse a family below, then tell us about your trip and an
          advisor puts together a free quote.
        </p>
      </header>

      <div className="mt-12">
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
      </div>

      <section className="mt-16 rounded-lg border border-border bg-muted/50 px-6 py-10 text-center sm:px-10">
        <h2 className="text-2xl sm:text-3xl">Not sure where to start?</h2>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">
          Tell us who&apos;s travelling and what you&apos;re hoping for. We&apos;ll
          point you at the right trip and quote it for free.
        </p>
        <div className="mt-6">
          <Button asChild variant="secondary" size="lg">
            <Link href={PRIMARY_CTA.href}>{PRIMARY_CTA.label}</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
