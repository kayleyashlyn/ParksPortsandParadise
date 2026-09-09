import {
  PortableText,
  type PortableTextComponents,
} from "@portabletext/react";

import { SanityImage } from "@/components/sanity-image";
import type { Post, SanityImage as SanityImageValue } from "@/lib/sanity.queries";

/**
 * Renders a blog post's Portable Text `body`. Server Component — the only
 * client boundary is `SanityImage` for inline images.
 *
 * Typography (headings, lists, links, quotes) is handled by the `prose` wrapper
 * on the page; this only overrides the block types that need real components
 * (images) or attributes (external-link `rel`/`target`).
 */
const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: SanityImageValue & { alt?: string } }) => (
      <figure className="not-prose my-8">
        <div className="relative aspect-[3/2] overflow-hidden rounded-lg bg-muted">
          <SanityImage
            image={value}
            alt={value.alt ?? ""}
            aspect={3 / 2}
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover"
          />
        </div>
      </figure>
    ),
  },
  marks: {
    link: ({ value, children }) => {
      const href: string = value?.href ?? "#";
      const external = /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {children}
        </a>
      );
    },
  },
};

export function PostBody({ value }: { value: NonNullable<Post["body"]> }) {
  return <PortableText value={value} components={components} />;
}
