import { DestinationFamilyCard } from "@/components/destination-family-card";
import type { DestinationFamily } from "@/lib/sanity.queries";

/**
 * Homepage curated destination-family grid (IMPLEMENTATION_PLAN.md §4 / §9).
 * Server Component — data is fetched by the page and passed in. Each card is a
 * single link (no competing CTA); links use the live CMS slug.
 */
export function DestinationFamilyGrid({
  families,
}: {
  families: DestinationFamily[];
}) {
  if (families.length === 0) return null;

  return (
    // Full-bleed, very light Blush wash — part of the homepage's alternating
    // section-band rhythm (Hero / TrustBar hairline / this / InstagramFeed).
    <div className="bg-brand-blush/5">
      <section
        aria-labelledby="destinations-heading"
        className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8"
      >
        {/* Sand Gold kicker — a dot accent rather than gold text, since the
            raw brand.secondary swatch is far too light to clear WCAG AA as
            text on this background; text stays muted-foreground. */}
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand-secondary" />
          Where we go
        </p>
        <h2 id="destinations-heading" className="mt-2 text-3xl sm:text-4xl">
          Where to next?
        </h2>
        <p className="mt-3 max-w-prose text-muted-foreground">
          Three ways to get away — pick a direction and we build the trip
          around you.
        </p>

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {families.map((family) => (
            <li key={family._id}>
              <DestinationFamilyCard
                family={family}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
