"use client";

import Image from "next/image";

import { urlForImage } from "@/lib/sanity.image";
import type { SanityImage as SanityImageValue } from "@/lib/sanity.queries";

/**
 * `next/image` wrapped around the Sanity image CDN. Client component because
 * `next/image` needs a non-serializable `loader` function to resize via Sanity
 * rather than Next's optimizer.
 *
 * Always used as `fill` inside a parent that sets the aspect ratio; pass the
 * same ratio as `aspect` so the Sanity crop is hotspot-aware at every
 * breakpoint. Alt text is caller-supplied (today: the sibling title/label —
 * see the homepage components).
 */
export function SanityImage({
  image,
  alt,
  aspect,
  sizes,
  className,
  priority = false,
}: {
  image: SanityImageValue;
  alt: string;
  /** width / height, e.g. 4 / 3. When set, Sanity does a hotspot crop to it. */
  aspect?: number;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      src={urlForImage(image).width(1600).auto("format").url()}
      loader={({ width, quality }) => {
        const builder = urlForImage(image)
          .width(width)
          .quality(quality || 75)
          .auto("format");
        return (
          aspect
            ? builder.height(Math.round(width / aspect)).fit("crop")
            : builder.fit("max")
        ).url();
      }}
    />
  );
}
