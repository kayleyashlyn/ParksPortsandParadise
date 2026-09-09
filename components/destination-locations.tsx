import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SanityImage } from "@/components/sanity-image";
import type { DestinationLocation } from "@/lib/sanity.queries";
import { PRIMARY_CTA } from "@/lib/site";

/**
 * Locations for one destination family, broken out as sections on the SAME page
 * (IMPLEMENTATION_PLAN.md §4–5) — never sub-pages. Each entry is a single link
 * straight to the Vacation Request Form with the destination pre-filled
 * (`?destination=`); the affordance is link-weight text, not a button, so it
 * doesn't compete with the page's one dominant "Request a Quote" CTA.
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
            <Link
              href={href}
              className="group grid items-center gap-6 rounded-lg border border-border bg-card p-4 transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-5 md:grid-cols-2 md:gap-8"
            >
              <div
                className={`relative aspect-[4/3] overflow-hidden rounded-md bg-muted ${
                  i % 2 === 1 ? "md:order-2" : ""
                }`}
              >
                <SanityImage
                  image={location.image}
                  alt={location.image.alt ?? location.name}
                  aspect={4 / 3}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div>
                <h2
                  id={`${anchor}-heading`}
                  className="text-2xl text-foreground sm:text-3xl"
                >
                  {location.name}
                </h2>
                {location.blurb ? (
                  <p className="mt-3 max-w-prose text-pretty text-muted-foreground">
                    {location.blurb}
                  </p>
                ) : null}
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 group-hover:underline">
                  {ctaLabel}
                  <ArrowRight aria-hidden className="h-4 w-4" />
                  <span className="sr-only">for {location.name}</span>
                </span>
              </div>
            </Link>
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
