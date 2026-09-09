import Link from "next/link";

import { SanityImage } from "@/components/sanity-image";
import { formatPostDate } from "@/lib/blog";
import type { PostListItem } from "@/lib/sanity.queries";

/**
 * One blog post on the `/blog` index — optional hero image + date + title +
 * excerpt, the whole card a single link (no competing CTA, per the
 * one-dominant-CTA brand rule).
 */
export function PostCard({
  post,
  sizes,
  headingLevel = "h2",
}: {
  post: PostListItem;
  sizes: string;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {post.mainImage ? (
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          <SanityImage
            image={post.mainImage}
            alt={post.mainImage.alt ?? post.title}
            aspect={16 / 9}
            sizes={sizes}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <time dateTime={post.publishedAt}>
            {formatPostDate(post.publishedAt)}
          </time>
        </p>
        <Heading className="mt-1 text-xl text-foreground">{post.title}</Heading>
        {post.excerpt ? (
          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
            {post.excerpt}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
