import type { Metadata } from "next";

import { CONTACT, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

/* ------------------------------------------------------------------ */
/* Per-page metadata                                                   */
/* ------------------------------------------------------------------ */

type PageMetadataInput = {
  /**
   * Bare page name (e.g. `"Meet the Team"`). The root `title.template` in
   * `app/layout.tsx` appends `" | Parks Ports & Paradise"` for `<title>`; this
   * helper composes the same full string for the OG/Twitter titles (which do
   * not inherit the template). Pass `path: "/"` for the home page and the
   * template is skipped so the title stays exactly `title`.
   */
  title: string;
  description: string;
  /** Root-relative path for the canonical + `og:url` (e.g. `"/meet-the-team"`). */
  path: string;
  /**
   * Absolute URL of a 1200×630 OpenGraph image. Optional — there is no
   * site-wide default OG asset yet (flagged in TODO.md for design). Destination
   * pages derive one from the family hero image.
   */
  ogImage?: string;
};

/**
 * Builds a page's `Metadata`. Next.js merges metadata *shallowly*, so a route
 * that declares `openGraph` / `twitter` replaces the root's entirely — this
 * helper re-emits the full block (type, siteName, locale, card) each time so
 * callers only supply title/description/path.
 */
export function pageMetadata({
  title,
  description,
  path,
  ogImage,
}: PageMetadataInput): Metadata {
  const isHome = path === "/";
  const fullTitle = isHome ? title : `${title} | ${SITE_NAME}`;
  const images = ogImage
    ? [{ url: ogImage, width: 1200, height: 630 }]
    : undefined;

  return {
    title: isHome ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      url: path,
      title: fullTitle,
      description,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(images ? { images } : {}),
    },
  };
}

/* ------------------------------------------------------------------ */
/* JSON-LD structured data                                             */
/* ------------------------------------------------------------------ */

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

/**
 * Site-wide `TravelAgency` (an `Organization` subtype) + `WebSite`, emitted
 * once in the root layout as a single `@graph`.
 */
export function siteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TravelAgency",
        "@id": ORG_ID,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/images/logos/logo-primary.png`,
        image: `${SITE_URL}/images/logos/logo-primary.png`,
        email: CONTACT.email,
        sameAs: [CONTACT.instagram],
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        publisher: { "@id": ORG_ID },
      },
    ],
  };
}

type BreadcrumbItem = { name: string; path: string };

/** `BreadcrumbList` from an ordered list of `{ name, path }` crumbs. */
export function breadcrumbJsonLd(
  items: BreadcrumbItem[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

type BlogPostingJsonLdInput = {
  title: string;
  description?: string | null;
  /** Root-relative path, e.g. `"/blog/my-post"`. */
  path: string;
  datePublished: string;
  dateModified?: string;
  /** Byline; falls back to the agency as an Organization author. */
  author?: string | null;
  /** Absolute image URL, already resolved via `urlForImage()`. */
  image?: string | null;
};

/** `BlogPosting` for a single post page. Only real CMS values are used. */
export function blogPostingJsonLd(
  input: BlogPostingJsonLdInput,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.title,
    ...(input.description ? { description: input.description } : {}),
    datePublished: input.datePublished,
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    ...(input.image ? { image: [input.image] } : {}),
    author: input.author
      ? { "@type": "Person", name: input.author }
      : { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    mainEntityOfPage: `${SITE_URL}${input.path}`,
  };
}

type DestinationFamilyJsonLdInput = {
  name: string;
  description?: string | null;
  /** Root-relative path of the family page (e.g. `"/destinations/parks"`). */
  path: string;
  locations: {
    name: string;
    description?: string | null;
    /** Absolute image URL, already resolved via `urlForImage()`. */
    image?: string | null;
    /** Comma-separated search terms from the CMS `searchKeywords` field; not shown on the page. */
    keywords?: string | null;
  }[];
};

/**
 * Models a destination-family page as an `ItemList` of `TouristAttraction`s —
 * one per broken-out location. The family itself is a browsing grouping, not a
 * single attraction, so `ItemList` is the honest shape. Only real CMS values
 * are used; no ratings/prices/addresses are fabricated. Returns `null` when the
 * family has no locations yet (nothing truthful to list).
 */
export function destinationFamilyJsonLd(
  input: DestinationFamilyJsonLdInput,
): Record<string, unknown> | null {
  if (input.locations.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: input.name,
    ...(input.description ? { description: input.description } : {}),
    url: `${SITE_URL}${input.path}`,
    numberOfItems: input.locations.length,
    itemListElement: input.locations.map((location, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "TouristAttraction",
        name: location.name,
        ...(location.description ? { description: location.description } : {}),
        ...(location.image ? { image: location.image } : {}),
        ...(location.keywords?.trim()
          ? { keywords: location.keywords.trim() }
          : {}),
      },
    })),
  };
}
