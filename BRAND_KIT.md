# Brand Kit Specs

## 🎨 Color Palette
Updated 2026-09-08 from client materials — these **supersede** the earlier
`#004b49` / `#e28743` values (which did not match the delivered logo art).
Wired into `tailwind.config.ts` (`colors.brand.*`, exact hex) and
`app/globals.css` (the shadcn CSS variables, as HSL).

| Hex | Name | Role | Token |
|---|---|---|---|
| `#7393b9` | Slate Blue | Primary — wordmark, primary buttons, links, focus ring | `--primary`, `--ring`, `brand.primary` |
| `#dfca94` | Sand Gold | Secondary — accents, highlights, the sparkle motif | `--secondary`, `brand.secondary` |
| `#b1a294` | Warm Taupe | Borders / dividers — hairlines, the scalloped badge outline | `--border`, `--input`, `brand.taupe` |
| `#fad8d6` | Blush | Soft accent — tags, hover washes (used as a light tint) | `--accent`, `brand.blush` |
| `#ffffff` | White | Background / surface | `--background`, `--card`, `--popover` |

`--muted` is a very light warm tint in the Warm Taupe family. Body ink
(`--foreground`) stays a near-neutral dark for legibility — the client palette
does not specify a text colour. Dark-mode variants lighten Slate Blue and keep
Sand Gold; Blush is dropped to a neutral in dark mode.

**Accessibility note:** the `--primary` / `--ring` tokens use a *deepened* shade
of Slate Blue (`hsl(213 33% 47%)`, ≈ `#5074a0`) so `text-primary` on white and
white text on `bg-primary` clear WCAG AA (≈ 4.8:1). The exact client swatch
`#7393b9` remains available as `colors.brand.primary` for large fills and
decorative use where contrast rules don't apply.

## 🔤 Typography
- **Headings Font:** `Playfair Display` (Serif font family)
- **Body Font:** `Inter` (Sans-serif font family)

## 📐 Styling Guidelines
- **Border Radius:** `0.5rem` (Rounded corners for cards, buttons, inputs)
- **Buttons:** Solid primary color for primary actions, outlined amber for secondary actions.

## 🖼️ Brand Assets
Delivered 2026-09-08. Logo source files are PNG at 1080×1350. Reference from the
app with a root-relative path (e.g. `/images/logos/logo-primary.png`).

| Asset | Path | Use |
|---|---|---|
| Primary logo | `public/images/logos/logo-primary.png` | Full-colour badge — default placement on light/neutral backgrounds |
| White logo | `public/images/logos/logo-white.png` | Reversed mark — solid white badge, text/sparkles knocked out. For dark backgrounds and photo overlays. Derived 2026-09-08 from `logo-outline.png` (see note). |
| Black logo | `public/images/logos/logo-black.png` | Solid black badge with white detail — for light backgrounds / one-colour / print |
| Outline logo | `public/images/logos/logo-outline.png` | White fill + dark linework, transparent ground. Original of the file first delivered as `logo-white.png`; suits mid-tone/coloured backgrounds. |

### Favicon
Generated 2026-09-08 from `~/Downloads/favicon.PNG` (the sparkle motif), tight-cropped
and squared on white. Next.js App Router picks these up automatically — no
`metadata.icons` wiring needed.

| File | Size | Purpose |
|---|---|---|
| `app/icon.png` | 512×512 | Standard favicon (`<link rel="icon">`) |
| `app/apple-icon.png` | 180×180 | iOS home-screen icon |
| `app/favicon.ico` | 16/32/48/64 | Legacy `/favicon.ico` |
| `public/favicon.png` | 512×512 | Squared copy for non-Next references |

### Note — white logo (resolved 2026-09-08)
The file first delivered as `logo-white.png` was actually a white-fill + dark-
linework mark on a transparent ground — unusable on dark backgrounds (the dark
detail vanishes). It was renamed to `logo-outline.png`, and a true reversed
`logo-white.png` was derived from it: colour channels forced to `#ffffff`, and
per-pixel alpha weighted by source luminance so the dark text/sparkles/dividers
punch through as transparent knockouts. Confirm against the client's official
reversed lockup if/when one is supplied.

## 📷 Placeholder Imagery
Interim art direction for scaffolding and layout **only**, pending the client's
brand photography. Generic stock **must not** ship on destination-family
location cards — every location image must depict that specific location
(IMPLEMENTATION_PLAN.md §4; `sanity/schemaTypes/destinationFamily.ts`; enforced
by `qa-agent`).

| Category | Source | Direction |
|---|---|---|
| Theme Parks | Unsplash — `https://unsplash.com` | Upscale theme park / fantasy castle aesthetic |
| Cruise Lines | Unsplash — `https://unsplash.com` | Luxury cruise ship / ocean liner deck |
| Resorts | Unsplash — `https://unsplash.com` | Premium coastal resort / infinity pool |

Before these render in-app: pick concrete image URLs
(`https://images.unsplash.com/photo-…`) or an Unsplash collection per category,
and add `images.unsplash.com` to `next.config.mjs` → `images.remotePatterns`.
