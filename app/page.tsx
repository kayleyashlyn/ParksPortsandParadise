/**
 * Placeholder landing route. Intentionally minimal — real homepage sections
 * (hero, trust bar, destination grid, etc. per IMPLEMENTATION_PLAN.md §9) are
 * blocked on refreshed brand-kit delivery. See CLAUDE.md.
 */
export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-4 p-8">
      <h1 className="text-2xl font-semibold">Parks Ports &amp; Paradise</h1>
      <p className="text-sm text-muted-foreground">
        Scaffold is in place (Next.js App Router, Tailwind, shadcn/ui, Sanity,
        React Hook Form + Zod). Page and component work starts once the refreshed
        brand kit is delivered.
      </p>
      <p className="text-sm text-muted-foreground">
        Sanity Studio is mounted at <code className="font-medium">/studio</code>.
      </p>
    </main>
  );
}
