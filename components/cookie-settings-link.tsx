"use client";

import { CONSENT_REOPEN_EVENT } from "@/lib/consent";

/**
 * Footer control that re-opens the cookie banner so a visitor can change their
 * analytics choice at any time (referenced by the Privacy Policy §6). Client
 * leaf inside the otherwise-Server-Component footer.
 */
export function CookieSettingsLink() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(CONSENT_REOPEN_EVENT))}
      className="text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
    >
      Cookie settings
    </button>
  );
}
