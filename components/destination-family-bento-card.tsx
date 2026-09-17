import Link from "next/link";

import { SanityImage } from "@/components/sanity-image";
import type { DestinationFamily } from "@/lib/sanity.queries";

/**
 * Homepage-only destination-family card: full-bleed photo with a bottom
 * scrim and an overlaid title/caption, used in the bento-style "Where to
 * next?" grid. Deliberately a separate component from
 * `DestinationFamilyCard` (the plain image-card used on the standalone
 * `/destinations` index) so restyling the homepage grid can't change that
 * page's look.
 *
 * The whole card stays a single link — no button-styled element inside it —
 * so it never competes with the page's one dominant CTA.
 */
export function DestinationFamilyBentoCard({
  family,
  sizes,
  aspect,
  size = "lg",
  headingLevel = "h3",
}: {
  family: DestinationFamily;
  sizes: string;
  /** width / height for the card's photo — varies by bento slot. */
  aspect: number;
  /**
   * `lg` (default) for the tall/wide slots; `sm` for the two smaller slots —
   * tighter type and padding so the title + caption fit inside the card's
   * shorter height instead of clipping against `overflow-hidden` (that
   * happened at mobile width, where the 2-up small cards are short enough
   * that a 2-line title pushed its top line above the card).
   */
  size?: "lg" | "sm";
  /** `h3` under the grid's `h2` (default, matches `DestinationFamilyCard`'s convention). */
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;

  return (
    <Link
      href={`/destinations/${family.slug}`}
      className="group relative block h-full overflow-hidden rounded-lg border border-border bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative h-full w-full" style={{ aspectRatio: aspect }}>
        <SanityImage
          image={family.heroImage}
          alt={family.heroImage.alt ?? family.title}
          aspect={aspect}
          sizes={sizes}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      {/* Bottom scrim: heavy enough at the label band for white text to clear
          WCAG AA over a bright photo, tapering off higher up the card. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 via-40% to-transparent"
      />
      <div className={size === "sm" ? "absolute inset-x-0 bottom-0 p-4" : "absolute inset-x-0 bottom-0 p-5"}>
        <Heading
          className={
            size === "sm"
              ? "font-heading text-lg italic leading-tight text-white underline decoration-brand-secondary decoration-2 underline-offset-4 [text-shadow:0_1px_3px_rgb(0_0_0/0.5)]"
              : "font-heading text-2xl italic text-white underline decoration-brand-secondary decoration-2 underline-offset-4 [text-shadow:0_1px_3px_rgb(0_0_0/0.5)]"
          }
        >
          {family.title}
        </Heading>
        {family.shortDescription ? (
          <p
            className={
              size === "sm"
                ? "mt-1 line-clamp-1 text-xs text-white/90 [text-shadow:0_1px_3px_rgb(0_0_0/0.5)]"
                : "mt-1 line-clamp-2 text-sm text-white/90 [text-shadow:0_1px_3px_rgb(0_0_0/0.5)]"
            }
          >
            {family.shortDescription}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
