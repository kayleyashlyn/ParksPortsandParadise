import Link from "next/link";

import { SanityImage } from "@/components/sanity-image";
import type { DestinationFamily } from "@/lib/sanity.queries";

/**
 * Homepage curated destination-family grid (IMPLEMENTATION_PLAN.md §4 / §9).
 * Server Component — data is fetched by the page and passed in. Whole card is
 * one link (no competing CTA); links use the live CMS slug.
 *
 * TODO(ui-agent): `lib/site.ts` PRIMARY_NAV / FOOTER_NAV still hardcode
 * `/destinations/theme-parks` etc.; reconcile those with the CMS slugs (or
 * generate the nav from `getDestinationFamilies()`) once slugs are finalized.
 */
export function DestinationFamilyGrid({
  families,
}: {
  families: DestinationFamily[];
}) {
  if (families.length === 0) return null;

  return (
    <section
      aria-labelledby="destinations-heading"
      className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8"
    >
      <h2 id="destinations-heading" className="text-3xl sm:text-4xl">
        Where to next?
      </h2>
      <p className="mt-3 max-w-prose text-muted-foreground">
        Three ways to get away — pick a direction and we build the trip around
        you.
      </p>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {families.map((family) => (
          <li key={family._id}>
            <Link
              href={`/destinations/${family.slug}`}
              className="group block overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <SanityImage
                  image={family.heroImage}
                  alt={family.title}
                  aspect={4 / 3}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="text-xl text-foreground">{family.title}</h3>
                {family.shortDescription ? (
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {family.shortDescription}
                  </p>
                ) : null}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
