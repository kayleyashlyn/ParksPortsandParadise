import type { AccreditationBadge } from "@/lib/sanity.queries";

/**
 * Homepage trust / accreditation bar — sits directly below the hero
 * (IMPLEMENTATION_PLAN.md §4; the footer keeps a secondary text copy). Server
 * Component; badges come from `getAccreditationBadges()`.
 *
 * Renders labels as text. TODO(ui-agent): render `badgeImage` artwork when the
 * client supplies real seals — that also needs `badgeImage.asset->metadata.dimensions`
 * added to the query projection so `next/image` gets intrinsic sizes.
 */
export function TrustBar({ badges }: { badges: AccreditationBadge[] }) {
  if (badges.length === 0) return null;

  return (
    <section
      aria-label="Accreditations and registrations"
      className="border-y border-border bg-muted/50"
    >
      <ul className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 py-6 sm:px-6 lg:px-8">
        {badges.map((badge) => {
          const label = (
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
                  className="rounded-sm transition-colors hover:[&_span]:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {label}
                </a>
              ) : (
                label
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
