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
 */
export function TrustBar({ badges }: { badges: AccreditationBadge[] }) {
  if (badges.length === 0) return null;

  return (
    <section
      aria-label="Accreditations and registrations"
      className="border-y border-border bg-muted/50"
    >
      <ul className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-center gap-x-8 gap-y-4 px-4 py-6 sm:px-6 lg:px-8">
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
    </section>
  );
}
