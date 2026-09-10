import type { Metadata } from "next";

import { DestinationFamilyGrid } from "@/components/destination-family-grid";
import { Hero } from "@/components/hero";
import { InstagramFeed } from "@/components/instagram-feed";
import { TrustBar } from "@/components/trust-bar";
import {
  getAccreditationBadges,
  getDestinationFamilies,
  getSiteSettings,
} from "@/lib/sanity.queries";
import { pageMetadata } from "@/lib/seo";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

// ISR — re-pull CMS content at most once a minute.
export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  path: "/",
});

export default async function Home() {
  const [families, badges, settings] = await Promise.all([
    getDestinationFamilies(),
    getAccreditationBadges(),
    getSiteSettings(),
  ]);

  return (
    <>
      {/* Full-bleed image/video hero once a hero image is set in Site Settings;
          plain text hero until then. Real brand photography still pending
          (CLAUDE.md embargo) — the editor drops it in via the CMS. */}
      <Hero settings={settings} />

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
