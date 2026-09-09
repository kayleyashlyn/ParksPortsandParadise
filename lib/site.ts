/**
 * Central site configuration — navigation, footer, and confirmed business facts.
 * Sources: IMPLEMENTATION_PLAN.md §4 (sitemap/nav + trust bar) and §11
 * (client-confirmed answers). Hard rules (ui-agent.md): one dropdown level /
 * one flyout max; exactly one dominant CTA ("Request a Quote"); Agent Portal is
 * a footer utility link, never primary nav.
 */

/**
 * Canonical site identity — used for `<title>`, metadata descriptions, and
 * JSON-LD. Keep in step with `app/layout.tsx` and `BRAND_KIT.md`.
 */
export const SITE_NAME = "Parks Ports & Paradise";
export const SITE_DESCRIPTION =
  "Family vacation planning for theme parks, cruises, and all-inclusive resorts. Tell us about your trip and our advisors build a custom quote — free.";

/**
 * Canonical site origin (no trailing slash). Drives `metadataBase`, canonical
 * URLs, `sitemap.xml`, and `robots.txt`. Vercel sets `NEXT_PUBLIC_SITE_URL`
 * per environment (preview deploys get their own preview URL); the fallback is
 * the production domain.
 *
 * Guard against an **empty or blank** env var, not just an unset one: `??` only
 * catches `undefined`/`null`, so a `NEXT_PUBLIC_SITE_URL=""` in Vercel would
 * otherwise yield `""` and crash `new URL(SITE_URL)` in `app/layout.tsx`
 * (`metadataBase`) — which breaks the whole build.
 */
const DEFAULT_SITE_URL = "https://parksportsandparadise.com";
export const SITE_URL = ((process.env.NEXT_PUBLIC_SITE_URL || "").trim() ||
  DEFAULT_SITE_URL).replace(/\/+$/, "");

export type NavChild = { label: string; href: string; description?: string };
export type NavItem = { label: string; href: string; children?: NavChild[] };

export const PRIMARY_NAV: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Destinations",
    href: "/destinations",
    // hrefs match the live Sanity `destinationFamily` slugs (parks / ports /
    // paradise) — keep in sync with the CMS, not with these labels.
    children: [
      {
        label: "Theme Parks",
        href: "/destinations/parks",
        description:
          "Walt Disney World, Disneyland, Universal, SeaWorld, Aulani",
      },
      {
        label: "Cruise Lines",
        href: "/destinations/ports",
        description: "Disney Cruise Line, Royal Caribbean",
      },
      {
        label: "All-Inclusive Resorts",
        href: "/destinations/paradise",
        description: "Beach and resort escapes beyond the parks and ships",
      },
    ],
  },
  { label: "Meet the Team", href: "/meet-the-team" },
  { label: "Plan Your Vacation", href: "/plan-your-vacation" },
  { label: "Work With Us", href: "/work-with-us" },
  { label: "Blog", href: "/blog" },
];

/** The single dominant CTA, repeated across the site (§2 / ui-agent.md). */
export const PRIMARY_CTA = {
  label: "Request a Quote",
  href: "/plan-your-vacation",
} as const;

export const CONTACT = {
  email: "hello@parksportsandparadise.com",
  instagram: "https://www.instagram.com/parksportsandparadise/",
  instagramHandle: "@parksportsandparadise",
} as const;

/**
 * Agent Portal — footer utility link only (§11 #4). Interim target is the
 * embedded Sanity Studio (`/studio`) so the link resolves; set
 * `NEXT_PUBLIC_AGENT_PORTAL_URL` once the real gated portal exists.
 * NB: the plan's "Agent Portal" is the travel advisors' external portal — a
 * different system from the CMS Studio. Revisit before launch.
 */
const rawAgentPortalUrl =
  process.env.NEXT_PUBLIC_AGENT_PORTAL_URL ?? "/studio";
// Accept only an internal path or an https URL; otherwise fall back.
export const AGENT_PORTAL_URL = /^(\/|https:\/\/)/.test(rawAgentPortalUrl)
  ? rawAgentPortalUrl
  : "/studio";

/** Client-confirmed (IMPLEMENTATION_PLAN.md §4 trust bar, §11 #4). */
export const SELLER_OF_TRAVEL = [
  "FL Seller of Travel Ref. No. ST46356",
  "CA Seller of Travel Reg. No. 2173719-70",
];

export const ACCREDITATIONS = [
  "CLIA",
  "IATAN",
  "TL Network Member",
  "Universal Orlando Authorized Retailer",
];

export type FooterLink = { label: string; href: string; external?: boolean };
export type FooterColumn = { heading: string; links: FooterLink[] };

export const FOOTER_NAV: FooterColumn[] = [
  {
    heading: "Explore",
    links: [
      { label: "Theme Parks", href: "/destinations/parks" },
      { label: "Cruise Lines", href: "/destinations/ports" },
      { label: "All-Inclusive Resorts", href: "/destinations/paradise" },
      { label: "Trip Inspiration", href: "/blog" },
    ],
  },
  {
    heading: "Agency",
    links: [
      { label: "Meet the Team", href: "/meet-the-team" },
      { label: "Work With Us", href: "/work-with-us" },
      { label: "Plan Your Vacation", href: "/plan-your-vacation" },
      { label: "Agent Portal", href: AGENT_PORTAL_URL, external: true },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];
