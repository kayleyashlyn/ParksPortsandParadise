/**
 * Scaffold landing page — placeholder only.
 * Real homepage sections (hero, trust bar, destination grid, testimonials,
 * Instagram feed, single "Request a Quote" CTA) are owned by `ui-agent` per
 * CLAUDE.md and IMPLEMENTATION_PLAN.md §9. Do not build them here.
 */
export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center gap-6 px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-widest text-brand-secondary">
        Scaffold ready
      </p>
      <h1 className="text-4xl text-brand-primary sm:text-5xl">
        Parks Ports and Paradise
      </h1>
      <p className="text-muted-foreground">
        Next.js App Router + Tailwind + Sanity scaffold. Brand tokens from{" "}
        <code>BRAND_KIT.md</code> are wired into <code>tailwind.config.ts</code>{" "}
        and <code>app/globals.css</code>. Page building is owned by{" "}
        <code>ui-agent</code> — see <code>IMPLEMENTATION_PLAN.md</code> §4.
      </p>
      <div className="flex flex-wrap gap-3">
        <button type="button" className="btn-primary">
          Request a Quote
        </button>
        <button type="button" className="btn-secondary">
          Explore Destinations
        </button>
      </div>
    </main>
  );
}
