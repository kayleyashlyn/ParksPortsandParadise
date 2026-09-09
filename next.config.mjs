/** @type {import('next').NextConfig} */

/*
 * Content-Security-Policy — shipped as **Report-Only** for now.
 *
 * It cannot be verified against the deployed site + embedded Sanity Studio +
 * SnapWidget from here, so it only logs violations (browser console /
 * `report-to`) rather than blocking. Once the deployed site is confirmed clean —
 * check `/`, the vacation form, the homepage Instagram section, and `/studio`
 * (login, editing, image upload) — rename the header key from
 * `Content-Security-Policy-Report-Only` to `Content-Security-Policy` to enforce.
 *
 * Hosts allowed:
 * - Sanity: `*.sanity.io` (+ `apicdn`/`api` subdomains, `wss:` for Studio
 *   realtime) and `*.sanity-cdn.com` (Studio's own bundle/bridge + assets)
 * - Google Analytics via `@next/third-parties`: googletagmanager.com (script),
 *   *.google-analytics.com / *.analytics.google.com (beacons)
 * - SnapWidget: snapwidget.com (homepage Instagram iframe)
 * - Unsplash: interim placeholder imagery (see BRAND_KIT.md)
 * - lh3.googleusercontent.com: Google-account avatars in Studio
 *
 * `'unsafe-inline'` (script + style): Next injects inline hydration/bootstrap
 * without nonces; Tailwind/Studio inject inline styles. `'unsafe-eval'`: the
 * embedded Sanity Studio needs it. Tightening these would mean nonce middleware
 * and splitting `/studio` onto its own header block — do that separately.
 */
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://*.sanity-cdn.com",
  "style-src 'self' 'unsafe-inline' https://*.sanity-cdn.com",
  "img-src 'self' data: blob: https://cdn.sanity.io https://*.sanity-cdn.com https://images.unsplash.com https://plus.unsplash.com https://www.googletagmanager.com https://*.google-analytics.com https://lh3.googleusercontent.com",
  "font-src 'self' data: https://*.sanity-cdn.com",
  "connect-src 'self' https://*.sanity.io wss://*.sanity.io https://*.apicdn.sanity.io https://*.api.sanity.io https://*.sanity-cdn.com https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com",
  "frame-src 'self' https://snapwidget.com https://*.sanity.io",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "media-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

/*
 * Baseline security headers — enforced on every route. These are all safe with
 * the current stack (no cross-origin framing, no camera/mic/geo use).
 * HSTS carries `preload`: the domain and its subdomains must be HTTPS-only
 * before submitting to the preload list — drop `preload` if that's not certain.
 */
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Content-Security-Policy-Report-Only", value: csp },
];

const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  images: {
    remotePatterns: [
      // Sanity-hosted image assets
      { protocol: "https", hostname: "cdn.sanity.io" },
      // Unsplash placeholder imagery (BRAND_KIT.md § Placeholder Imagery).
      // Note: photo files are served from images.unsplash.com / plus.unsplash.com,
      // not the bare unsplash.com marketing domain.
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "plus.unsplash.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
