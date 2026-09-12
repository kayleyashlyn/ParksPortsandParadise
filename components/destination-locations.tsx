import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

import { SanityImage } from "@/components/sanity-image";
import type { DestinationLocation } from "@/lib/sanity.queries";
import { PRIMARY_CTA } from "@/lib/site";

/**
 * Locations for one destination family, broken out as sections on the SAME page
 * (IMPLEMENTATION_PLAN.md §4–5) — never sub-pages. Each card carries up to two
 * independent links: the card-wide "stretched link" (a real anchor on the
 * heading, visually behaving as a whole-card click target) straight to the
 * Vacation Request Form with the destination pre-filled (`?destination=`),
 * and an optional secondary "Learn more" link out to the location's own
 * official site when `officialWebsiteUrl` is set. The primary link-weight
 * text CTA stays the dominant affordance; "Learn more" is deliberately
 * smaller/quieter so it never competes with the page's one dominant
 * "Request a Quote" CTA.
 *
 * Server Component. Renders nothing when the family has no locations yet — the
 * page shows its own "coming soon" copy in that case.
 */
export function DestinationLocations({
  familyTitle,
  locations,
}: {
  familyTitle: string;
  locations: DestinationLocation[];
}) {
  if (locations.length === 0) return null;

  // Readable in-page anchors, de-duplicated so repeated (or punctuation-only)
  // location names can't collide on `id` / `aria-labelledby`.
  const seen = new Map<string, number>();
  const anchors = locations.map((location) => {
    const base = slugify(location.name) || location._key;
    const n = (seen.get(base) ?? 0) + 1;
    seen.set(base, n);
    return n === 1 ? base : `${base}-${n}`;
  });

  return (
    <div className="space-y-16">
      {locations.map((location, i) => {
        const anchor = anchors[i];
        const ctaLabel = location.ctaLabel?.trim() || PRIMARY_CTA.label;
        const href = `${PRIMARY_CTA.href}?destination=${encodeURIComponent(
          location.name,
        )}`;

        return (
          <section
            key={location._key}
            id={anchor}
            aria-labelledby={`${anchor}-heading`}
            className="scroll-mt-24"
          >
            <div className="group relative grid items-center gap-6 rounded-lg border border-border bg-card p-4 transition-[box-shadow,background-color] hover:bg-brand-blush/10 hover:shadow-[0_20px_40px_-18px_rgba(115,147,185,0.45)] sm:p-5 md:grid-cols-2 md:gap-8">
              <div
                className={`relative ${i % 2 === 1 ? "md:order-2" : ""}`}
              >
                {/* Decorative Sand Gold accent square — offset toward the
                    outer edge and alternating with the image's L/R order per
                    row. It's earlier in source order than the photo below, so
                    with the default z-index:auto stacking (no explicit
                    z-index — that would escape to the nearest *positioned*
                    ancestor's stacking context, which here is well above this
                    pair and would risk painting behind the card's own
                    background) the photo naturally paints over it, leaving
                    only the peeking corner visible. Clearly secondary to the
                    photo and copy. */}
                <div
                  aria-hidden
                  className={`absolute h-16 w-16 rounded-md bg-brand-secondary sm:h-20 sm:w-20 ${
                    i % 2 === 1
                      ? "-bottom-3 -right-3 sm:-bottom-4 sm:-right-4"
                      : "-bottom-3 -left-3 sm:-bottom-4 sm:-left-4"
                  }`}
                />
                <div
                  className="relative aspect-[4/3] overflow-hidden rounded-md bg-muted shadow-[0_25px_50px_-20px_rgba(115,147,185,0.5)]"
                >
                  <SanityImage
                    image={location.image}
                    alt={location.image.alt ?? location.name}
                    aspect={4 / 3}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </div>

              <div>
                <h2 className="text-2xl text-foreground sm:text-3xl">
                  <Link
                    id={`${anchor}-heading`}
                    href={href}
                    className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {location.name}
                  </Link>
                </h2>
                {location.blurb ? (
                  <p className="mt-3 max-w-prose text-pretty text-muted-foreground">
                    {location.blurb}
                  </p>
                ) : null}
                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 group-hover:underline">
                    {ctaLabel}
                    <ArrowRight aria-hidden className="h-4 w-4" />
                    <span className="sr-only">for {location.name}</span>
                  </span>
                  {location.officialWebsiteUrl ? (
                    <a
                      href={location.officialWebsiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative z-10 inline-flex items-center gap-1 text-xs text-muted-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      Learn more
                      <ExternalLink aria-hidden className="h-3.5 w-3.5" />
                      <span className="sr-only">
                        about {location.name} (opens in a new tab)
                      </span>
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </section>
        );
      })}
      <span className="sr-only">
        Every {familyTitle} option above links to our Vacation Request Form.
      </span>
    </div>
  );
}

/** URL/anchor-safe slug from a location name (for in-page #anchors). */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
