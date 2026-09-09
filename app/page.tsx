import Link from "next/link";

import { DestinationFamilyGrid } from "@/components/destination-family-grid";
import { InstagramFeed } from "@/components/instagram-feed";
import { TrustBar } from "@/components/trust-bar";
import { Button } from "@/components/ui/button";
import {
  getAccreditationBadges,
  getDestinationFamilies,
  getSiteSettings,
} from "@/lib/sanity.queries";
import { PRIMARY_CTA } from "@/lib/site";

// ISR — re-pull CMS content at most once a minute.
export const revalidate = 60;

export default async function Home() {
  const [families, badges, settings] = await Promise.all([
    getDestinationFamilies(),
    getAccreditationBadges(),
    getSiteSettings(),
  ]);

  return (
    <>
      {/*
        TODO(ui-agent): real hero — full-bleed brand photography, blocked on
        photography delivery (CLAUDE.md embargo). Text-only placeholder + the one
        repeated CTA for now; copy needs sign-off.
      */}
      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          Family vacations, planned with you
        </p>
        <h1 className="mt-3 max-w-3xl text-balance text-4xl sm:text-5xl lg:text-6xl">
          Parks, ports, and paradise — planned with you, quoted for free.
        </h1>
        <p className="mt-4 max-w-prose text-pretty text-muted-foreground">
          Tell our advisors where you want to go. We handle the details — theme
          parks, cruises, and all-inclusive resorts.
        </p>
        <div className="mt-8">
          <Button asChild variant="secondary" size="lg">
            <Link href={PRIMARY_CTA.href}>{PRIMARY_CTA.label}</Link>
          </Button>
        </div>
      </section>

      <TrustBar badges={badges} />
      <DestinationFamilyGrid families={families} />
      <InstagramFeed settings={settings} />

      {/*
        TODO(ui-agent): testimonials (needs content) and a newsletter section —
        per IMPLEMENTATION_PLAN.md §9.
      */}
    </>
  );
}
