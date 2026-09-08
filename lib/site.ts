/**
 * Central site configuration — navigation, footer, and confirmed business facts.
 * Sources: IMPLEMENTATION_PLAN.md §4 (sitemap/nav + trust bar) and §11
 * (client-confirmed answers). Hard rules (ui-agent.md): one dropdown level /
 * one flyout max; exactly one dominant CTA ("Request a Quote"); Agent Portal is
 * a footer utility link, never primary nav.
 */

export type NavChild = { label: string; href: string; description?: string };
export type NavItem = { label: string; href: string; children?: NavChild[] };

export const PRIMARY_NAV: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Destinations",
    href: "/destinations",
    children: [
      {
        label: "Theme Parks",
        href: "/destinations/theme-parks",
        description:
          "Walt Disney World, Disneyland, Universal, SeaWorld, Aulani",
      },
      {
        label: "Cruise Lines",
        href: "/destinations/cruise-lines",
        description: "Disney Cruise Line, Royal Caribbean",
      },
      {
        label: "All-Inclusive Resorts",
        href: "/destinations/all-inclusive-resorts",
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
export const AGENT_PORTAL_URL =
  process.env.NEXT_PUBLIC_AGENT_PORTAL_URL ?? "/studio";

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
      { label: "Theme Parks", href: "/destinations/theme-parks" },
      { label: "Cruise Lines", href: "/destinations/cruise-lines" },
      {
        label: "All-Inclusive Resorts",
        href: "/destinations/all-inclusive-resorts",
      },
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
