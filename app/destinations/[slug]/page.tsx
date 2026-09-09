import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { DestinationLocations } from "@/components/destination-locations";
import { JsonLd } from "@/components/json-ld";
import { SanityImage } from "@/components/sanity-image";
import { Button } from "@/components/ui/button";
import { urlForImage } from "@/lib/sanity.image";
import {
  getDestinationFamilies,
  getDestinationFamilyBySlug,
} from "@/lib/sanity.queries";
import {
  breadcrumbJsonLd,
  destinationFamilyJsonLd,
  pageMetadata,
} from "@/lib/seo";
import { PRIMARY_CTA } from "@/lib/site";

/** 1200×630 crop of a Sanity image for OpenGraph / structured data. */
function ogCrop(image: Parameters<typeof urlForImage>[0]): string {
  return urlForImage(image).width(1200).height(630).fit("crop").url();
}

// ISR — re-pull CMS content at most once a minute (matches the homepage).
export const revalidate = 60;

/** Pre-render the known families; new ones render on-demand then cache (ISR). */
export async function generateStaticParams() {
  const families = await getDestinationFamilies();
  return families.map((family) => ({ slug: family.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const family = await getDestinationFamilyBySlug(slug);

  if (!family) {
    return { title: "Destination not found" };
  }

  return pageMetadata({
    title: family.title,
    description:
      family.shortDescription ??
      `${family.title} trips planned by Parks Ports & Paradise advisors — tell us about your trip for a free quote.`,
    path: `/destinations/${family.slug}`,
    ogImage: family.heroImage ? ogCrop(family.heroImage) : undefined,
  });
}

export default async function DestinationFamilyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const family = await getDestinationFamilyBySlug(slug);

  if (!family) notFound();

  const itemListLd = destinationFamilyJsonLd({
    name: family.title,
    description: family.shortDescription,
    path: `/destinations/${family.slug}`,
    locations: family.locations.map((location) => ({
      name: location.name,
      description: location.blurb,
      image: location.image ? ogCrop(location.image) : null,
      keywords: location.searchKeywords,
    })),
  });

  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Destinations", path: "/destinations" },
    { name: family.title, path: `/destinations/${family.slug}` },
  ]);

  return (
    <article>
      <JsonLd data={breadcrumbLd} />
      {itemListLd ? <JsonLd data={itemListLd} /> : null}

      {/* Hero — CMS-supplied family photography */}
      <header className="relative isolate overflow-hidden bg-muted">
        <div className="absolute inset-0 -z-10">
          <SanityImage
            image={family.heroImage}
            alt={family.heroImage.alt ?? family.title}
            aspect={16 / 9}
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/20"
          />
        </div>

        <div className="mx-auto flex min-h-[52vh] max-w-[1400px] flex-col justify-end px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <Link
            href="/destinations"
            className="inline-flex w-fit items-center gap-1.5 rounded-sm text-sm font-medium text-white/90 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ArrowLeft aria-hidden className="h-4 w-4" />
            All destinations
          </Link>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl text-white sm:text-5xl lg:text-6xl">
            {family.title}
          </h1>
          {family.shortDescription ? (
            <p className="mt-4 max-w-2xl text-pretty text-white/90">
              {family.shortDescription}
            </p>
          ) : null}
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8">
        {family.locations.length > 0 ? (
          <DestinationLocations
            familyTitle={family.title}
            locations={family.locations}
          />
        ) : (
          <p className="max-w-prose text-muted-foreground">
            We&apos;re still writing up the {family.title.toLowerCase()} guide.
            In the meantime, tell us where you want to go and an advisor will
            take it from there.
          </p>
        )}

        <section className="mt-16 rounded-lg border border-border bg-muted/50 px-6 py-10 text-center sm:px-10">
          <h2 className="text-2xl sm:text-3xl">Ready to plan this trip?</h2>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            Tell us about your travellers and your dates. We&apos;ll build a
            custom {family.title.toLowerCase()} quote — free.
          </p>
          <div className="mt-6">
            <Button asChild variant="secondary" size="lg">
              <Link href={PRIMARY_CTA.href}>{PRIMARY_CTA.label}</Link>
            </Button>
          </div>
        </section>
      </div>
    </article>
  );
}
