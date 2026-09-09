import type { MetadataRoute } from "next";

import { getDestinationFamilies, getPosts } from "@/lib/sanity.queries";
import { SITE_URL } from "@/lib/site";

// Re-generate at most hourly so newly published content shows up without a
// redeploy (matches the pages' ISR intent).
export const revalidate = 3600;

/**
 * `/sitemap.xml` — the built Phase 1 routes plus every published
 * `destinationFamily` slug and blog `post` slug. `/studio` and API routes are
 * excluded by design.
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
    {
      url: `${SITE_URL}/work-with-us`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  let cmsRoutes: MetadataRoute.Sitemap = [];
  try {
    const [families, posts] = await Promise.all([
      getDestinationFamilies(),
      getPosts(),
    ]);
    cmsRoutes = [
      ...families.map((family) => ({
        url: `${SITE_URL}/destinations/${family.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...posts.map((post) => ({
        url: `${SITE_URL}/blog/${post.slug}`,
        lastModified: new Date(post.publishedAt),
        changeFrequency: "yearly" as const,
        priority: 0.5,
      })),
    ];
  } catch {
    // CMS unreachable at build/revalidate time — still emit the static routes
    // rather than failing the whole sitemap.
    cmsRoutes = [];
  }

  return [...staticRoutes, ...cmsRoutes];
}
