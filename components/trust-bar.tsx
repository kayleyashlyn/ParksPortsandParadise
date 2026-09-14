import { SanityImage } from "@/components/sanity-image";
import type { AccreditationBadge } from "@/lib/sanity.queries";

/**
 * Homepage trust / accreditation bar — sits directly below the hero
 * (IMPLEMENTATION_PLAN.md §4; the footer keeps a secondary text copy). Server
 * Component; badges come from `getAccreditationBadges()`.
 *
 * Renders `badgeImage` artwork when the editor has uploaded a logo/seal (per
 * the schema: "leave blank to render as text-only"); falls back to the label
 * as plain text otherwise (e.g. the Seller of Travel registration numbers,
 * which have no artwork). No `aspect` is passed to `SanityImage` — badge art
 * isn't hotspot-cropped, so it's scaled to fit (`object-contain`) inside a
 * fixed box rather than cropped to a ratio.
 *
 * Slate Blue accent (2026-09-14, client decision — site had too little
 * color): `border-primary` top/bottom rules replace the previous taupe
 * hairline, plus a small `text-primary` eyebrow label above the badges row.
 * `text-primary` is the contrast-tuned deepened Slate Blue (`--primary` in
 * app/globals.css, ~#5074a0), already used for links/CTAs and clears WCAG AA
 * 4.5:1 on white — not the raw `colors.brand.primary` swatch.
 */
export function TrustBar({ badges }: { badges: AccreditationBadge[] }) {
  if (badges.length === 0) return null;

  return (
    <section
      aria-label="Accreditations and registrations"
      className="border-b-2 border-t-2 border-primary"
    >
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-wider text-primary">
          Accredited &amp; Trusted
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {badges.map((badge) => {
            const content = badge.badgeImage ? (
              <div className="relative h-10 w-28 sm:h-12 sm:w-32">
                <SanityImage
                  image={badge.badgeImage}
                  alt={badge.badgeImage.alt ?? badge.label}
                  sizes="128px"
                  className="object-contain"
                />
              </div>
            ) : (
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {badge.label}
              </span>
            );
            return (
              <li key={badge._id}>
                {badge.linkUrl ? (
                  <a
                    href={badge.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-sm transition-colors hover:[&_span]:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {content}
                  </a>
                ) : (
                  content
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
