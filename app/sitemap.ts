import type { MetadataRoute } from "next";

import { getDestinationFamilies } from "@/lib/sanity.queries";
import { SITE_URL } from "@/lib/site";

// Re-generate at most hourly so newly published destination families show up
// without a redeploy (matches the pages' ISR intent).
export const revalidate = 3600;

/**
 * `/sitemap.xml` — the four built Phase 1 routes plus every published
 * `destinationFamily` slug. Routes that currently 404 (`/work-with-us`,
 * `/blog`, `/privacy`, `/terms`) are intentionally left out until they exist;
 * `/studio` and API routes are excluded by design.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/destinations`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/plan-your-vacation`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/meet-the-team`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  let familyRoutes: MetadataRoute.Sitemap = [];
  try {
    const families = await getDestinationFamilies();
    familyRoutes = families.map((family) => ({
      url: `${SITE_URL}/destinations/${family.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch {
    // CMS unreachable at build/revalidate time — still emit the static routes
    // rather than failing the whole sitemap.
    familyRoutes = [];
  }

  return [...staticRoutes, ...familyRoutes];
}
