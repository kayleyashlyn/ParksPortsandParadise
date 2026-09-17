import { DestinationFamilyBentoCard } from "@/components/destination-family-bento-card";
import type { DestinationFamily } from "@/lib/sanity.queries";

/**
 * Homepage curated destination-family grid (IMPLEMENTATION_PLAN.md §4 / §9).
 * Server Component — data is fetched by the page and passed in. Each card is a
 * single link (no competing CTA); links use the live CMS slug.
 *
 * Bento layout: slot 1 is a tall card spanning both rows, slot 2 is a wide
 * card across the top of the remaining space, slots 3–4 sit side by side
 * beneath it. Families keep whatever order `getDestinationFamilies()`
 * returns (CMS `order` field) — this only changes each slot's on-screen
 * size/shape, not which family appears where relative to the others.
 * The bento shape only fits exactly 4 families (today's live count) —
 * any other count (an editor unpublishes or adds one) falls back to the
 * plain equal-width grid instead of rendering a lopsided bento.
 */
export function DestinationFamilyGrid({
  families,
}: {
  families: DestinationFamily[];
}) {
  if (families.length === 0) return null;

  const [tall, wide, ...rest] = families;

  return (
    // Full-bleed, very light Blush wash — part of the homepage's alternating
    // section-band rhythm (Hero / TrustBar hairline / this / InstagramFeed).
    <div className="bg-brand-blush/5">
      <section
        aria-labelledby="destinations-heading"
        className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8"
      >
        <h2 id="destinations-heading" className="text-3xl sm:text-4xl">
          Where to next?
        </h2>
        <p className="mt-3 max-w-prose text-muted-foreground">
          Four ways to get away — pick a direction and we build the trip
          around you.
        </p>

        {families.length !== 4 ? (
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {families.map((family) => (
              <li key={family._id}>
                <DestinationFamilyBentoCard
                  family={family}
                  aspect={4 / 3}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                />
              </li>
            ))}
          </ul>
        ) : (
          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            <li className="sm:row-span-2">
              <DestinationFamilyBentoCard
                family={tall}
                aspect={3 / 4}
                sizes="(min-width: 640px) 50vw, 100vw"
              />
            </li>
            <li>
              <DestinationFamilyBentoCard
                family={wide}
                aspect={16 / 9}
                sizes="(min-width: 640px) 50vw, 100vw"
              />
            </li>
            <li>
              <ul className="grid grid-cols-2 gap-6">
                {rest.map((family) => (
                  <li key={family._id}>
                    <DestinationFamilyBentoCard
                      family={family}
                      aspect={1}
                      size="sm"
                      sizes="(min-width: 640px) 25vw, 50vw"
                    />
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        )}
      </section>
    </div>
  );
}
