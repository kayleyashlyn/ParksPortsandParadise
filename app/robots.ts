import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

/**
 * `/robots.txt` — index everything except the embedded Studio and API routes;
 * point crawlers at the sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/studio", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
