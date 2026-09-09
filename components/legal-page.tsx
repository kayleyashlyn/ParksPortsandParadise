import type { ReactNode } from "react";

import { LEGAL_DRAFT, LEGAL_EFFECTIVE_DATE, LEGAL_LAST_UPDATED } from "@/lib/legal";

/**
 * Shared shell for the /privacy and /terms pages: page heading, the
 * effective / last-updated line, the "draft — pending legal review" notice
 * (while `LEGAL_DRAFT` is true), and a `prose` container for the document body.
 *
 * Server Component. The body is passed as children — plain JSX headings and
 * paragraphs styled by `@tailwindcss/typography`.
 */
export function LegalPage({
  title,
  intro,
  children,
}: {
  title: string;
  /** One-line description under the heading. */
  intro: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <h1 className="text-balance text-4xl sm:text-5xl">{title}</h1>
        <p className="mt-4 text-pretty text-muted-foreground">{intro}</p>
        <p className="mt-4 text-sm text-muted-foreground">
          Effective date: {LEGAL_EFFECTIVE_DATE}
          <br />
          Last updated: {LEGAL_LAST_UPDATED}
        </p>
      </header>

      {LEGAL_DRAFT ? (
        <div
          role="note"
          className="mt-8 rounded-lg border border-secondary bg-secondary/15 p-4 text-sm text-foreground"
        >
          <p className="font-semibold">Draft — pending legal review</p>
          <p className="mt-1 text-muted-foreground">
            This is starting-point copy that reflects how the site works, not
            legal advice. A travel-industry / privacy attorney will review it and
            replace every bracketed placeholder before launch.
          </p>
        </div>
      ) : null}

      <div className="prose prose-slate mt-10 max-w-none prose-headings:font-heading prose-headings:text-foreground prose-h2:mt-10 prose-h2:text-2xl prose-h3:text-xl prose-a:text-primary prose-strong:text-foreground">
        {children}
      </div>
    </div>
  );
}
