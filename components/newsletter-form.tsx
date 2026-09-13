"use client";

import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { NEWSLETTER_FREEBIE } from "@/lib/site";

declare global {
  interface Window {
    // See components/vacation-request-form.tsx — `gtag` is injected by
    // seo-agent once analytics consent is granted; this stays a no-op until
    // then.
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Low-friction single-field newsletter capture (IMPLEMENTATION_PLAN.md §2),
 * repurposed 2026-09-13 as one of the two surfaces (with `<NewsletterPopup>`)
 * that post to `/api/newsletter`, which stores the email as a
 * `newsletterSubscriber` doc in Sanity. Source tag "footer" distinguishes
 * this from the popup in those records.
 */
export function NewsletterForm() {
  const id = useId();
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">(
    "idle",
  );
  const [company, setCompany] = useState(""); // honeypot, kept off-screen

  if (status === "done") {
    return (
      <div role="status" className="text-sm text-foreground/80">
        <p>Thanks — check your inbox for the checklist.</p>
        <a
          href={NEWSLETTER_FREEBIE.fileHref}
          className="mt-1 inline-block underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
        >
          Download it now
        </a>
      </div>
    );
  }

  return (
    <form
      className="flex w-full max-w-sm flex-col gap-2 sm:flex-row"
      onSubmit={async (e) => {
        e.preventDefault();
        if (company) {
          setStatus("done");
          return;
        }
        const email = new FormData(e.currentTarget).get("email");
        setStatus("submitting");
        try {
          const res = await fetch("/api/newsletter", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, source: "footer" }),
          });
          if (!res.ok) throw new Error(String(res.status));
          window.gtag?.("event", "newsletter_signup", { source: "footer" });
          setStatus("done");
        } catch {
          setStatus("error");
        }
      }}
    >
      <label htmlFor={id} className="sr-only">
        Email address
      </label>
      <input
        id={id}
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="you@example.com"
        className="h-9 min-w-0 flex-1 rounded-md border border-input bg-transparent px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      {/* Honeypot — hidden from sighted and keyboard users, bots fill it. */}
      <input
        type="text"
        name="company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <Button
        type="submit"
        variant="outline"
        className="shrink-0"
        disabled={status === "submitting"}
      >
        Subscribe
      </Button>
      {status === "error" && (
        <p role="alert" className="text-xs text-destructive sm:basis-full">
          Something went wrong — please try again.
        </p>
      )}
    </form>
  );
}
