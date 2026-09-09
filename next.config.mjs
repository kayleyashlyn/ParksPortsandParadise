/** @type {import('next').NextConfig} */

/*
 * Content-Security-Policy — now ENFORCED (was Report-Only). Verified against the
 * deployed site: no violations on `/`, the vacation form, the homepage Instagram
 * embed, or `/studio`. The only console noise on prod was a Sanity *CORS* issue
 * (the deploy URL wasn't in the project's allowed origins — unrelated to CSP).
 *
 * Two policies, because the embedded Sanity Studio needs a much looser policy
 * than the marketing site should run:
 *
 * - `marketingCsp` — every route EXCEPT `/studio/*`. No `'unsafe-eval'` in
 *   production (the built client bundle has no `eval` outside `/studio`);
 *   `next dev` needs it for HMR, so it's added back only when
 *   `NODE_ENV === "development"`. No `blob:`, tight `connect-src` / `frame-src`.
 *   `'unsafe-inline'` stays (Next has no nonce infra here).
 * - `studioCsp` — `/studio/*` only. Adds `'unsafe-eval'`, `blob:` (workers +
 *   image previews), `wss://*.sanity.io` (realtime), `*.sanity-cdn.com` (Studio
 *   bundle + bridge), `lh3.googleusercontent.com` (Google-account avatars).
 *
 * Hosts: Sanity read API (`*.apicdn.sanity.io`), Google Analytics via
 * `@next/third-parties` (`googletagmanager.com` + `*.google-analytics.com` /
 * `*.analytics.google.com`), SnapWidget (`snapwidget.com`, homepage Instagram
 * iframe), Unsplash (interim placeholder imagery — BRAND_KIT.md). No `report-to`
 * endpoint is wired; violations surface in the browser console only. Roll back
 * by switching a `Content-Security-Policy` key to
 * `Content-Security-Policy-Report-Only`.
 */
// `next dev` compiles client code with eval-based HMR; the production bundle
// does not (verified: no `eval` / `new Function` in the built non-Studio chunks).
const devUnsafeEval =
  process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : "";

const marketingCsp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  `script-src 'self' 'unsafe-inline'${devUnsafeEval} https://www.googletagmanager.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://cdn.sanity.io https://images.unsplash.com https://plus.unsplash.com https://www.googletagmanager.com https://*.google-analytics.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.apicdn.sanity.io https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com",
  "frame-src 'self' https://snapwidget.com",
  "worker-src 'self'",
  "manifest-src 'self'",
  "media-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const studioCsp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.sanity-cdn.com",
  "style-src 'self' 'unsafe-inline' https://*.sanity-cdn.com",
  "img-src 'self' data: blob: https://cdn.sanity.io https://*.sanity-cdn.com https://lh3.googleusercontent.com",
  "font-src 'self' data: https://*.sanity-cdn.com",
  "connect-src 'self' https://*.sanity.io wss://*.sanity.io https://*.apicdn.sanity.io https://*.api.sanity.io https://*.sanity-cdn.com",
  "frame-src 'self' https://*.sanity.io",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "media-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

/*
 * Baseline security headers — enforced on every route. Safe with the current
 * stack (no cross-origin framing, no camera/mic/geo use).
 * HSTS deliberately omits `preload` — that's a near-permanent commitment
 * (apex + every subdomain HTTPS-only, slow to reverse). Add `; preload` and
 * submit to hstspreload.org only once the client confirms that's wanted.
 */
const baselineHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        // Studio route — the looser policy. Listed first so it wins for /studio*.
        source: "/studio/:path*",
        headers: [
          ...baselineHeaders,
          { key: "Content-Security-Policy", value: studioCsp },
        ],
      },
      {
        // Everything else — the strict marketing policy. Negative lookahead
        // keeps `/studio*` on the entry above.
        source: "/((?!studio).*)",
        headers: [
          ...baselineHeaders,
          { key: "Content-Security-Policy", value: marketingCsp },
        ],
      },
    ];
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
