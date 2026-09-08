"use client";

import { useId, useState } from "react";

import { Button } from "@/components/ui/button";

/**
 * Low-friction single-field newsletter capture (IMPLEMENTATION_PLAN.md §2).
 * Presentational for now — TODO: wire to a real subscribe endpoint. Endpoint /
 * GA4 event ownership sits with forms-agent / seo-agent, not ui-agent.
 */
export function NewsletterForm() {
  const id = useId();
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <p role="status" className="text-sm text-muted-foreground">
        Thanks — we&apos;ll be in touch.
      </p>
    );
  }

  return (
    <form
      className="flex w-full max-w-sm flex-col gap-2 sm:flex-row"
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
    >
      <label htmlFor={id} className="sr-only">
        Email address
      </label>
      <input
        id={id}
        type="email"
        required
        autoComplete="email"
        placeholder="you@example.com"
        className="h-9 min-w-0 flex-1 rounded-md border border-input bg-transparent px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <Button type="submit" variant="outline" className="shrink-0">
        Subscribe
      </Button>
    </form>
  );
}
