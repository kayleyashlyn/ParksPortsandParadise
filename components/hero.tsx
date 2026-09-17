import Link from "next/link";

import { HeroScrollFade } from "@/components/hero-scroll-fade";
import { HeroVideo } from "@/components/hero-video";
import { SanityImage } from "@/components/sanity-image";
import { Button } from "@/components/ui/button";
import type { SiteSettings } from "@/lib/sanity.queries";
import { PRIMARY_CTA } from "@/lib/site";

/**
 * Homepage hero. When the editor has set a hero image in Site Settings it's a
 * full-bleed visual (image, plus an optional muted looping video over it on
 * motion-OK desktop); otherwise it falls back to a plain text hero on the page
 * background. Copy is the same either way.
 *
 * Server Component — the poster image (the LCP element) is server-rendered;
 * `HeroVideo` is the only client leaf.
 */
export function Hero({ settings }: { settings: SiteSettings | null }) {
  const poster = settings?.heroPoster ?? null;

  const cta = (
    <Button asChild variant="secondary" size="lg">
      <Link href={PRIMARY_CTA.href}>{PRIMARY_CTA.label}</Link>
    </Button>
  );

  const eyebrow = (
    <p className="text-xs font-semibold uppercase tracking-[0.2em]">
      Family Travel Planning
    </p>
  );

  // `onDark`: the photo hero needs the gold accent to clear WCAG AA against
  // the scrim (verified — the gold swatch fails badly on a light/white
  // background, so the plain-background fallback keeps the accent span the
  // same color as the rest of the headline instead).
  const headline = (onDark: boolean) => (
    <h1 className="max-w-3xl text-balance text-4xl font-medium sm:text-5xl lg:text-6xl">
      The trip they&rsquo;ll be talking about{" "}
      <span
        className={
          onDark
            ? "font-heading italic text-brand-secondary [text-shadow:0_1px_4px_rgb(0_0_0/0.6)]"
            : "font-heading italic"
        }
      >
        for years
      </span>
    </h1>
  );

  const microcopy = (
    <p className="mt-4 text-sm">
      No planning fees, ever. Just tell us what your family loves.
    </p>
  );

  if (!poster) {
    return (
      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="text-muted-foreground">{eyebrow}</div>
        <div className="mt-4">{headline(false)}</div>
        <p className="mt-4 max-w-prose text-pretty text-lg text-muted-foreground">
          Tell us where you want to go — we&rsquo;ll handle the details.
        </p>
        <div className="mt-8">{cta}</div>
        <div className="text-muted-foreground">{microcopy}</div>
      </section>
    );
  }

  return (
    <section className="relative isolate flex min-h-[65vh] items-center overflow-hidden bg-muted sm:min-h-[72vh]">
      <HeroScrollFade>
        <SanityImage
          image={poster}
          alt={poster.alt ?? ""}
          aspect={16 / 9}
          sizes="100vw"
          priority
          className="object-cover"
        />
        {settings?.heroVideoUrl ? (
          <HeroVideo
            src={settings.heroVideoUrl}
            type={settings.heroVideoMimeType}
          />
        ) : null}
        {/* Scrim: the text is vertically centered, so the mid band has to be
            heavy enough on its own for white body copy to clear WCAG AA
            (4.5:1) over a bright photo — not just the bottom edge. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/55 to-black/40"
        />
      </HeroScrollFade>

      <div className="mx-auto w-full max-w-[1400px] px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-28">
        <div className="text-white/80 [text-shadow:0_1px_3px_rgb(0_0_0/0.5)]">
          {eyebrow}
        </div>
        <div className="mt-4 text-white [text-shadow:0_1px_4px_rgb(0_0_0/0.6)]">
          {headline(true)}
        </div>
        <p className="mt-4 max-w-prose text-pretty text-lg text-white [text-shadow:0_1px_3px_rgb(0_0_0/0.5)]">
          Tell us where you want to go — we&rsquo;ll handle the details.
        </p>
        <div className="mt-8">{cta}</div>
        <div className="text-white/80 [text-shadow:0_1px_3px_rgb(0_0_0/0.5)]">
          {microcopy}
        </div>
      </div>
    </section>
  );
}
