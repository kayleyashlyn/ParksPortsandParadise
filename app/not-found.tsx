import Link from "next/link";

import { Button } from "@/components/ui/button";
import { PRIMARY_CTA } from "@/lib/site";

/**
 * Custom 404 — renders inside the root layout (still gets the header/footer),
 * so a mistyped or dead link doesn't dump a visitor onto Next.js's bare,
 * unbranded default page. Deliberately simple: no fetches, since this can
 * render for a route that itself failed to resolve.
 */
export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        404
      </p>
      <h1 className="mt-2 text-4xl sm:text-5xl">We can&apos;t find that page</h1>
      <p className="mx-auto mt-4 max-w-md text-muted-foreground">
        The page you&apos;re looking for may have moved or no longer exists.
        Let&apos;s get you back on track.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button asChild size="lg">
          <Link href={PRIMARY_CTA.href}>{PRIMARY_CTA.label}</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
