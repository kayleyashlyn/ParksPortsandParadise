"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Check, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NEWSLETTER_FREEBIE } from "@/lib/site";

declare global {
  interface Window {
    // See components/vacation-request-form.tsx.
    gtag?: (...args: unknown[]) => void;
  }
}

// Client-side form only validates the email; `source` is fixed below rather
// than asked of the visitor — see lib/newsletterSchema.ts for the full shape
// the API route validates against.
const formSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});
type FormValues = z.infer<typeof formSchema>;

const DISMISSED_KEY = "ppp-newsletter-popup-dismissed";
const SHOW_DELAY_MS = 8000;

/**
 * One-time freebie-download popup (IMPLEMENTATION_PLAN §2 newsletter capture,
 * repurposed 2026-09-13). Shares `/api/newsletter` + the
 * `newsletterSubscriber` Sanity doc with the footer field
 * (`components/newsletter-form.tsx`) — "freebie-popup" in the `source` field
 * is what tells them apart.
 *
 * Shows once per browser (localStorage flag) after a short delay, on any
 * page. Silently does nothing if localStorage is unavailable (private
 * browsing) — it's a nice-to-have, not worth breaking the page over.
 */
export function NewsletterPopup() {
  const pathname = usePathname();
  // Never on the CMS Studio (editors don't need a lead-capture popup while
  // they're writing content) — mounted in the root layout alongside
  // <SiteHeader>/<SiteFooter> since /studio has no layout of its own yet
  // (see TODO.md).
  const isStudio = pathname?.startsWith("/studio") ?? false;

  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = React.useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [company, setCompany] = React.useState(""); // honeypot

  React.useEffect(() => {
    if (isStudio) return;
    let alreadyDismissed = false;
    try {
      alreadyDismissed = localStorage.getItem(DISMISSED_KEY) === "1";
    } catch {
      // Storage unavailable — treat as "not dismissed" but we still won't be
      // able to remember that, so worst case it reappears next visit.
    }
    if (alreadyDismissed) return;
    const timer = setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isStudio]);

  function dismiss() {
    setOpen(false);
    try {
      localStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // Ignore — see effect above.
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: { email: "" },
  });

  if (isStudio) return null;

  async function onValid(values: FormValues) {
    if (company) {
      setStatus("success");
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email, source: "freebie-popup" }),
      });
      if (!res.ok) throw new Error(String(res.status));
      window.gtag?.("event", "newsletter_signup", { source: "freebie-popup" });
      setStatus("success");
    } catch {
      setStatus("error");
    }
    // Either way, don't show it again on this browser.
    try {
      localStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // Ignore.
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) dismiss();
        else setOpen(next);
      }}
    >
      <DialogContent className="sm:max-w-md">
        {status === "success" ? (
          <div role="status" className="py-2 text-center">
            <div
              aria-hidden
              className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground"
            >
              <Check className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-xl">You&rsquo;re in</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              We&rsquo;ve sent it to your inbox — or grab it right now below.
            </p>
            <Button asChild className="mt-5">
              <a href={NEWSLETTER_FREEBIE.fileHref}>
                Download {NEWSLETTER_FREEBIE.title}
              </a>
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{NEWSLETTER_FREEBIE.title}</DialogTitle>
              <DialogDescription>
                {NEWSLETTER_FREEBIE.description}
              </DialogDescription>
            </DialogHeader>
            <form
              noValidate
              onSubmit={handleSubmit(onValid)}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <Label htmlFor="popup-email">Email address</Label>
                <Input
                  id="popup-email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={!!errors.email || undefined}
                  aria-describedby={errors.email ? "popup-email-error" : undefined}
                  {...register("email")}
                />
                {errors.email && (
                  <p id="popup-email-error" role="alert" className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
              {/* Honeypot — hidden from sighted and keyboard users. */}
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
              {status === "error" && (
                <p role="alert" className="text-sm text-destructive">
                  Something went wrong — please try again.
                </p>
              )}
              <div className="flex items-center justify-end gap-2">
                <Button type="button" variant="ghost" onClick={dismiss}>
                  No thanks
                </Button>
                <Button type="submit" disabled={status === "submitting"}>
                  {status === "submitting" && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Get the {NEWSLETTER_FREEBIE.shortLabel}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
