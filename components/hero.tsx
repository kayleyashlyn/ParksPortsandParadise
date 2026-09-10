import Link from "next/link";

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

  if (!poster) {
    return (
      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <h1 className="max-w-3xl text-balance text-4xl font-medium sm:text-5xl lg:text-6xl">
          Parks, Ports, and Paradise
        </h1>
        <p className="mt-4 max-w-prose text-pretty text-lg text-muted-foreground">
          Tell us where you want to go — we&rsquo;ll handle the details.
        </p>
        <div className="mt-8">{cta}</div>
      </section>
    );
  }

  return (
    <section className="relative isolate flex min-h-[65vh] items-center overflow-hidden bg-muted sm:min-h-[72vh]">
      <div className="absolute inset-0 -z-10">
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
      </div>

      <div className="mx-auto w-full max-w-[1400px] px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-28">
        <h1 className="max-w-3xl text-balance text-4xl font-medium sm:text-5xl lg:text-6xl">
          Parks, Ports, and Paradise
        </h1>
        <p className="mt-4 max-w-prose text-pretty text-lg text-white [text-shadow:0_1px_3px_rgb(0_0_0/0.5)]">
          Tell us where you want to go — we&rsquo;ll handle the details.
        </p>
        <div className="mt-8">{cta}</div>
      </div>
    </section>
  );
}
