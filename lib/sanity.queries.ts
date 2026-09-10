import { groq } from "next-sanity";
import type { PortableTextBlock } from "@portabletext/react";

import { client } from "./sanity.client";

/**
 * GROQ queries + explicit return types for the three seeded content types
 * (destinationFamily, accreditationBadge, agentProfile).
 *
 * - Reuses the read-only public client from `./sanity.client` (useCdn, no token).
 * - Image fields are returned as raw Sanity image objects (`SanityImage`);
 *   pass them to `urlForImage()` from `./sanity.image` — never build asset URLs
 *   by hand.
 * - Return types are hand-written to match the projections below. They are NOT
 *   validated at runtime; if a projection changes, update the type with it.
 *   (A Zod parse or `sanity typegen` could enforce this later — see TODO.md.)
 * - No caching/revalidation is set here — that is a per-consumer decision.
 *   Callers can pass a third arg, e.g.
 *   `client.fetch(query, params, { next: { revalidate: 60 } })`.
 */

/* ------------------------------------------------------------------ */
/* Shared types                                                        */
/* ------------------------------------------------------------------ */

/**
 * A Sanity image reference as returned by these projections. Structurally
 * assignable to `@sanity/image-url`'s `SanityImageSource`, so it can be passed
 * straight to `urlForImage()`.
 *
 * `alt` comes from the per-image `alt` field on every image schema. It's a
 * warning-level (not required) field, so consumers must still fall back to a
 * sibling label (`name` / `title`) when it's absent.
 */
export type SanityImage = {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
  alt?: string | null;
};

/* ------------------------------------------------------------------ */
/* destinationFamily (+ its in-document locations[])                   */
/* ------------------------------------------------------------------ */

export type DestinationLocation = {
  _key: string;
  name: string;
  image: SanityImage;
  /** Not rendered — comma-separated search terms, fed into the page's JSON-LD. */
  searchKeywords: string | null;
  /** Optional 1–2 sentence blurb on what makes this location distinct (schema max 200). */
  blurb: string | null;
  /** Optional CTA label override; falls back to "Request a Quote". */
  ctaLabel: string | null;
};

export type DestinationFamily = {
  _id: string;
  _type: "destinationFamily";
  title: string;
  slug: string;
  heroImage: SanityImage;
  /** Optional 1–2 sentence intro (schema max 220). */
  shortDescription: string | null;
  /** Controls nav flyout + homepage grid order. */
  order: number;
  locations: DestinationLocation[];
};

const destinationFamilyProjection = groq`{
  _id,
  _type,
  title,
  "slug": slug.current,
  heroImage,
  shortDescription,
  order,
  "locations": coalesce(locations[]{
    _key,
    name,
    image,
    searchKeywords,
    blurb,
    ctaLabel
  }, [])
}`;

const destinationFamiliesQuery = groq`
  *[_type == "destinationFamily"] | order(order asc) ${destinationFamilyProjection}
`;

const destinationFamilyBySlugQuery = groq`
  *[_type == "destinationFamily" && slug.current == $slug][0] ${destinationFamilyProjection}
`;

/** All destination families, ordered by `order` (Theme Parks, Cruise Lines, All-Inclusive). */
export function getDestinationFamilies(): Promise<DestinationFamily[]> {
  return client.fetch<DestinationFamily[]>(destinationFamiliesQuery);
}

/** A single destination family by its slug, or `null` if none matches. */
export function getDestinationFamilyBySlug(
  slug: string,
): Promise<DestinationFamily | null> {
  return client.fetch<DestinationFamily | null>(destinationFamilyBySlugQuery, {
    slug,
  });
}

/* ------------------------------------------------------------------ */
/* accreditationBadge                                                  */
/* ------------------------------------------------------------------ */

export type AccreditationBadge = {
  _id: string;
  _type: "accreditationBadge";
  label: string;
  /** Optional seal artwork; text-only when null. */
  badgeImage: SanityImage | null;
  order: number;
  /** Optional link to the verifying body. */
  linkUrl: string | null;
};

const accreditationBadgesQuery = groq`
  *[_type == "accreditationBadge"] | order(order asc) {
    _id,
    _type,
    label,
    badgeImage,
    order,
    linkUrl
  }
`;

/** All accreditation badges, ordered by `order`. */
export function getAccreditationBadges(): Promise<AccreditationBadge[]> {
  return client.fetch<AccreditationBadge[]>(accreditationBadgesQuery);
}

/* ------------------------------------------------------------------ */
/* agentProfile                                                        */
/* ------------------------------------------------------------------ */

export type AgentProfile = {
  _id: string;
  _type: "agentProfile";
  name: string;
  photo: SanityImage;
  /** e.g. "Travel Advisor", "Owner / Lead Advisor". */
  title: string | null;
  /** Short bio (schema max 300). */
  bio: string | null;
  specialties: string[];
  /** Optional; null sorts after numbered agents, then alphabetical by name. */
  order: number | null;
};

const activeAgentsQuery = groq`
  *[_type == "agentProfile" && active == true] | order(coalesce(order, 9999) asc, name asc) {
    _id,
    _type,
    name,
    photo,
    title,
    bio,
    "specialties": coalesce(specialties, []),
    order
  }
`;

/**
 * Active agents only (`active == true`), per the schema intent — a departed
 * agent is unpublished by toggling `active` off, not deleted. Agents with
 * `active` unset are excluded (schema `initialValue` is `true`, so this should
 * not happen for Studio-created docs).
 */
export function getActiveAgents(): Promise<AgentProfile[]> {
  return client.fetch<AgentProfile[]>(activeAgentsQuery);
}

/* ------------------------------------------------------------------ */
/* siteSettings (singleton)                                            */
/* ------------------------------------------------------------------ */

export type SiteSettings = {
  /** Homepage hero background image. Null → the plain text hero renders instead. */
  heroPoster: SanityImage | null;
  /** Resolved URL of the optional hero background video; null when unset. */
  heroVideoUrl: string | null;
  /** MIME of the hero video (`video/mp4` | `video/webm`) for the `<source>` tag. */
  heroVideoMimeType: string | null;
  instagramFeedEnabled: boolean;
  /** SnapWidget widget ID for the homepage feed; null until the editor sets it. */
  instagramWidgetId: string | null;
};

const siteSettingsQuery = groq`
  *[_id == "siteSettings"][0]{
    heroPoster,
    "heroVideoUrl": heroVideo.asset->url,
    "heroVideoMimeType": heroVideo.asset->mimeType,
    "instagramFeedEnabled": coalesce(instagramFeedEnabled, false),
    instagramWidgetId
  }
`;

/** The single Site Settings document, or `null` if it hasn't been created yet. */
export function getSiteSettings(): Promise<SiteSettings | null> {
  return client.fetch<SiteSettings | null>(siteSettingsQuery);
}

/* ------------------------------------------------------------------ */
/* post (blog)                                                         */
/* ------------------------------------------------------------------ */

/** A blog post as shown on the `/blog` index — no `body`. */
export type PostListItem = {
  _id: string;
  title: string;
  slug: string;
  /** ISO string; posts with `publishedAt` in the future are filtered out. */
  publishedAt: string;
  excerpt: string | null;
  author: string | null;
  mainImage: SanityImage | null;
};

/** A full blog post for `/blog/[slug]`. */
export type Post = PostListItem & {
  _updatedAt: string;
  /** Portable Text; images inside carry a nested `alt` (see `SanityImage`). */
  body: PortableTextBlock[] | null;
};

// Shared field list (the inside of the `{ ... }`), composed into both queries.
const postListFields = groq`
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  author,
  mainImage
`;

// Only published posts: a real `publishedAt` that is not in the future.
const publishedFilter = groq`_type == "post" && defined(publishedAt) && publishedAt <= now()`;

const postsQuery = groq`
  *[${publishedFilter}] | order(publishedAt desc) { ${postListFields} }
`;

const postBySlugQuery = groq`
  *[${publishedFilter} && slug.current == $slug][0]{
    ${postListFields},
    _updatedAt,
    body
  }
`;

const postSlugsQuery = groq`*[${publishedFilter}].slug.current`;

/** All published posts, newest first. */
export function getPosts(): Promise<PostListItem[]> {
  return client.fetch<PostListItem[]>(postsQuery);
}

/** A single published post by slug, or `null`. */
export function getPostBySlug(slug: string): Promise<Post | null> {
  return client.fetch<Post | null>(postBySlugQuery, { slug });
}

/** Published post slugs — for `generateStaticParams`. */
export function getPostSlugs(): Promise<string[]> {
  return client.fetch<string[]>(postSlugsQuery);
}
