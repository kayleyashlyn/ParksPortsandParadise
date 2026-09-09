import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toPlainText } from "@portabletext/react";

import { JsonLd } from "@/components/json-ld";
import { PostBody } from "@/components/portable-text";
import { SanityImage } from "@/components/sanity-image";
import { Button } from "@/components/ui/button";
import { formatPostDate } from "@/lib/blog";
import { urlForImage } from "@/lib/sanity.image";
import { getPostBySlug, getPostSlugs } from "@/lib/sanity.queries";
import { blogPostingJsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { PRIMARY_CTA, SITE_NAME } from "@/lib/site";

export const revalidate = 60;

/** 1200×630 crop of a Sanity image for OpenGraph / structured data. */
function ogCrop(image: Parameters<typeof urlForImage>[0]): string {
  return urlForImage(image).width(1200).height(630).fit("crop").url();
}

/** Plain-text summary for meta description when there's no excerpt. */
function derivedDescription(post: {
  excerpt: string | null;
  body: Parameters<typeof PostBody>[0]["value"] | null;
}): string {
  if (post.excerpt) return post.excerpt;
  const text = post.body ? toPlainText(post.body) : "";
  return text.length > 157 ? `${text.slice(0, 157).trimEnd()}…` : text;
}

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found" };

  return pageMetadata({
    title: post.title,
    description:
      derivedDescription(post) ||
      `A post from the ${SITE_NAME} advisor team.`,
    path: `/blog/${post.slug}`,
    ogImage: post.mainImage ? ogCrop(post.mainImage) : undefined,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const path = `/blog/${post.slug}`;

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Trip Inspiration", path: "/blog" },
          { name: post.title, path },
        ])}
      />
      <JsonLd
        data={blogPostingJsonLd({
          title: post.title,
          description: derivedDescription(post) || null,
          path,
          datePublished: post.publishedAt,
          dateModified: post._updatedAt,
          author: post.author,
          image: post.mainImage ? ogCrop(post.mainImage) : null,
        })}
      />

      <Link
        href="/blog"
        className="inline-flex w-fit items-center gap-1.5 rounded-sm text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ArrowLeft aria-hidden className="h-4 w-4" />
        All posts
      </Link>

      <header className="mt-6">
        <h1 className="text-balance text-4xl sm:text-5xl">{post.title}</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          <time dateTime={post.publishedAt}>
            {formatPostDate(post.publishedAt)}
          </time>
          {post.author ? <> · {post.author}</> : null}
        </p>
      </header>

      {post.mainImage ? (
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-lg bg-muted">
          <SanityImage
            image={post.mainImage}
            alt={post.mainImage.alt ?? post.title}
            aspect={16 / 9}
            sizes="(min-width: 768px) 768px, 100vw"
            priority
            className="object-cover"
          />
        </div>
      ) : null}

      {post.body && post.body.length > 0 ? (
        <div className="prose prose-slate mt-10 max-w-none prose-headings:font-heading prose-headings:text-foreground prose-h2:mt-10 prose-h2:text-2xl prose-h3:text-xl prose-a:text-primary prose-strong:text-foreground">
          <PostBody value={post.body} />
        </div>
      ) : null}

      <section className="mt-16 rounded-lg border border-border bg-muted/50 px-6 py-10 text-center sm:px-10">
        <h2 className="text-2xl sm:text-3xl">Planning a trip like this?</h2>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">
          Tell us what you have in mind and an advisor will build a free quote
          around it.
        </p>
        <div className="mt-6">
          <Button asChild variant="secondary" size="lg">
            <Link href={PRIMARY_CTA.href}>{PRIMARY_CTA.label}</Link>
          </Button>
        </div>
      </section>
    </article>
  );
}
