import Link from "next/link";

import { SanityImage } from "@/components/sanity-image";
import type { DestinationFamily } from "@/lib/sanity.queries";

/**
 * One destination-family card — hero image + title + short description, the
 * whole card a single link to that family's page (no competing CTA, per the
 * one-dominant-CTA brand rule). Used by the homepage grid and the
 * `/destinations` index. Href uses the live CMS slug.
 */
export function DestinationFamilyCard({
  family,
  sizes,
  headingLevel = "h3",
}: {
  family: DestinationFamily;
  sizes: string;
  /** `h3` under the homepage grid's `h2`; `h2` on the standalone `/destinations` index. */
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;

  return (
    <Link
      href={`/destinations/${family.slug}`}
      className="group block overflow-hidden rounded-lg border border-border bg-card transition-[box-shadow,background-color] hover:bg-brand-blush/10 hover:shadow-[0_20px_40px_-18px_rgba(115,147,185,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <SanityImage
          image={family.heroImage}
          alt={family.heroImage.alt ?? family.title}
          aspect={4 / 3}
          sizes={sizes}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <Heading className="text-xl text-foreground">{family.title}</Heading>
        {family.shortDescription ? (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {family.shortDescription}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
