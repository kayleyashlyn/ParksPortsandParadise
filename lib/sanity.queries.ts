import { groq } from "next-sanity";

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
 * NOTE: the image schemas define no `alt` field, so none is returned here.
 * Consumers must source alt text elsewhere (the sibling `name` / `title` /
 * `label`) until an `alt` field is added to the schema. Logged in TODO.md.
 */
export type SanityImage = {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
};

/* ------------------------------------------------------------------ */
/* destinationFamily (+ its in-document locations[])                   */
/* ------------------------------------------------------------------ */

export type DestinationLocation = {
  _key: string;
  name: string;
  image: SanityImage;
  /** Optional short location line (schema max 60). */
  shortTag: string | null;
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
    shortTag,
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
  *[_type == "agentProfile" && active == true] | order(order asc, name asc) {
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
