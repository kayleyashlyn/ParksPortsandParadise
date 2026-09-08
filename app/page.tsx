/**
 * Placeholder landing route inside the global layout shell.
 * Homepage sections (hero, trust bar, destination grid, testimonials, Instagram
 * feed, single "Request a Quote" CTA) are separate `ui-agent` tasks per
 * IMPLEMENTATION_PLAN.md §9 — not built here.
 */
export default function Home() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-medium uppercase tracking-widest text-primary">
        Layout shell
      </p>
      <h1 className="mt-3 max-w-2xl text-balance text-3xl sm:text-4xl lg:text-5xl">
        Global header &amp; footer are in place
      </h1>
      <p className="mt-4 max-w-prose text-pretty text-muted-foreground">
        Header, footer, and navigation are built against the brand tokens from
        the brand kit. Homepage sections come next as their own tasks. The Sanity
        Studio is mounted at the <code>/studio</code> route.
      </p>
    </div>
  );
}
