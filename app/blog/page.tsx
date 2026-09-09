import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/json-ld";
import { PostCard } from "@/components/post-card";
import { Button } from "@/components/ui/button";
import { getPosts } from "@/lib/sanity.queries";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { PRIMARY_CTA } from "@/lib/site";

// ISR — re-pull CMS content at most once a minute (matches the rest of the site).
export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: "Trip Inspiration",
  description:
    "Planning tips, destination guides, and trip inspiration from the Parks Ports & Paradise advisor team.",
  path: "/blog",
});

export default async function BlogIndexPage() {
  const posts = await getPosts();

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Trip Inspiration", path: "/blog" },
        ])}
      />

      <header className="max-w-2xl">
        <h1 className="text-balance text-4xl sm:text-5xl">Trip Inspiration</h1>
        <p className="mt-4 text-pretty text-muted-foreground">
          Planning tips, destination guides, and stories from our advisors — the
          things worth knowing before you go.
        </p>
      </header>

      <div className="mt-12">
        {posts.length > 0 ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post._id} className="flex">
                <PostCard
                  post={post}
                  headingLevel="h2"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">
            New posts are on the way — check back soon.
          </p>
        )}
      </div>

      <section className="mt-16 rounded-lg border border-border bg-muted/50 px-6 py-10 text-center sm:px-10">
        <h2 className="text-2xl sm:text-3xl">Ready to plan your own trip?</h2>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">
          Tell us where you want to go and an advisor will put together a free
          quote.
        </p>
        <div className="mt-6">
          <Button asChild variant="secondary" size="lg">
            <Link href={PRIMARY_CTA.href}>{PRIMARY_CTA.label}</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
