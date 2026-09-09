"use client";

import { useEffect, useState } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";

import {
  CONSENT_CHANGE_EVENT,
  readConsentCookie,
  type ConsentValue,
} from "@/lib/consent";

/**
 * Loads GA4 **only after** the visitor has accepted analytics cookies
 * (`components/cookie-consent.tsx`). Renders nothing — and injects no gtag
 * script — until then, so declining or ignoring the banner means zero analytics.
 *
 * `gaId` comes from the server layout (`NEXT_PUBLIC_GA4_MEASUREMENT_ID`); when
 * it is unset this component is a no-op, matching the previous behaviour.
 */
export function Analytics({ gaId }: { gaId?: string }) {
  const [consent, setConsent] = useState<ConsentValue | null>(null);

  useEffect(() => {
    setConsent(readConsentCookie());
    const onChange = (e: Event) => {
      setConsent((e as CustomEvent<ConsentValue>).detail);
    };
    window.addEventListener(CONSENT_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onChange);
  }, []);

  if (!gaId || consent !== "granted") return null;
  return <GoogleAnalytics gaId={gaId} />;
}
