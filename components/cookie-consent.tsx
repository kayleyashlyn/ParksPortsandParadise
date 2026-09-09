"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  CONSENT_REOPEN_EVENT,
  hasGpcSignal,
  readConsentCookie,
  writeConsentCookie,
} from "@/lib/consent";

/**
 * Opt-in analytics cookie banner. The site loads no analytics until the visitor
 * presses "Accept", so this is a genuine choice, not a fake "we use cookies" bar.
 *
 * Shown when: no stored choice yet AND the browser isn't sending a Global
 * Privacy Control signal (a GPC signal is honoured silently as a decline). The
 * footer "Cookie settings" control re-opens it via `CONSENT_REOPEN_EVENT` so a
 * visitor can change their mind.
 *
 * Non-modal: it doesn't trap focus or block the page — the privacy-preserving
 * default is already in effect while it's open.
 */
export function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (readConsentCookie() === null && !hasGpcSignal()) {
      setOpen(true);
    }
    const reopen = () => setOpen(true);
    window.addEventListener(CONSENT_REOPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_REOPEN_EVENT, reopen);
  }, []);

  if (!open) return null;

  const choose = (value: "granted" | "denied") => {
    writeConsentCookie(value);
    setOpen(false);
  };

  return (
    <div
      role="region"
      aria-label="Analytics cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card p-4 shadow-[0_-4px_20px_-8px_rgba(0,0,0,0.2)] sm:p-5"
    >
      <div className="mx-auto flex max-w-[1400px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p className="text-sm text-muted-foreground">
          We use Google Analytics to understand how the site is used. It only
          runs if you accept. See our{" "}
          <Link
            href="/privacy"
            className="font-medium text-primary underline underline-offset-4"
          >
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => choose("denied")}
          >
            Decline
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => choose("granted")}
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
