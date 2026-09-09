import type { SiteSettings } from "@/lib/sanity.queries";
import { CONTACT } from "@/lib/site";

/**
 * Homepage Instagram feed (IMPLEMENTATION_PLAN.md §1 / §7 / §8) — a lightweight
 * SnapWidget embed, editor-togglable via the `siteSettings` singleton. Renders
 * nothing until the editor turns it on AND supplies a widget ID.
 *
 * Server Component; the SnapWidget iframe is lazy-loaded. When security headers
 * land, CSP needs `frame-src https://snapwidget.com` (tracked in TODO.md).
 */
export function InstagramFeed({ settings }: { settings: SiteSettings | null }) {
  const widgetId = settings?.instagramWidgetId?.trim();
  if (!settings?.instagramFeedEnabled || !widgetId) return null;

  return (
    <section
      aria-labelledby="instagram-heading"
      className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 id="instagram-heading" className="text-3xl sm:text-4xl">
          Follow along
        </h2>
        <a
          href={CONTACT.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-sm text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {CONTACT.instagramHandle}
        </a>
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-border bg-muted">
        <iframe
          title={`Instagram feed for ${CONTACT.instagramHandle}`}
          src={`https://snapwidget.com/embed/${encodeURIComponent(widgetId)}`}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          className="block h-[340px] w-full border-0 sm:h-[380px] lg:h-[420px]"
        />
      </div>
    </section>
  );
}
