/**
 * Analytics cookie-consent state — a first-party, opt-in gate for GA4.
 *
 * The site loads **no** analytics until the visitor explicitly accepts, so the
 * privacy-preserving default (nothing) needs no action. The choice is stored in
 * a plain first-party cookie (not `localStorage`) so it is a genuine "cookie
 * choice" and could be read server-side later if needed.
 *
 * A Global Privacy Control signal (`navigator.globalPrivacyControl`) is treated
 * as a standing request to decline: when one is present and the visitor has not
 * made an explicit choice, analytics stays off and the banner is not shown.
 */

export const CONSENT_COOKIE = "ppp-analytics-consent";
export type ConsentValue = "granted" | "denied";

/** 180 days — long enough not to nag, short enough to re-ask within a year. */
const MAX_AGE_SECONDS = 60 * 60 * 24 * 180;

/** Fired on `window` whenever the stored choice changes, so the analytics
 *  loader and the banner stay in sync without a shared store. */
export const CONSENT_CHANGE_EVENT = "ppp:consent-change";
/** Fired on `window` by the footer "Cookie settings" control to re-open the
 *  banner after a choice has already been made. */
export const CONSENT_REOPEN_EVENT = "ppp:consent-reopen";

export function readConsentCookie(): ConsentValue | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${CONSENT_COOKIE}=`));
  const value = match?.split("=")[1];
  return value === "granted" || value === "denied" ? value : null;
}

export function writeConsentCookie(value: ConsentValue): void {
  if (typeof document === "undefined") return;
  document.cookie =
    `${CONSENT_COOKIE}=${value}; path=/; max-age=${MAX_AGE_SECONDS}; ` +
    `samesite=lax${location.protocol === "https:" ? "; secure" : ""}`;
  window.dispatchEvent(
    new CustomEvent<ConsentValue>(CONSENT_CHANGE_EVENT, { detail: value }),
  );
}

/** True when the browser is sending a Global Privacy Control signal. */
export function hasGpcSignal(): boolean {
  return (
    typeof navigator !== "undefined" &&
    (navigator as Navigator & { globalPrivacyControl?: boolean })
      .globalPrivacyControl === true
  );
}
