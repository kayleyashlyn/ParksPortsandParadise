import type { Config } from "tailwindcss";

/**
 * Brand design tokens are LIVE as of 2026-09-08 (partial brand-kit delivery).
 *
 * - The shadcn/ui semantic tokens below read `hsl(var(--*))` from
 *   app/globals.css, where `--primary` / `--secondary` / `--ring` / `--muted`
 *   are now set to the Parks Ports & Paradise palette from BRAND_KIT.md.
 * - `colors.brand.*` exposes the exact hex values for cases that need them
 *   directly.
 * - `fontFamily` reads the next/font CSS variables set in app/layout.tsx
 *   (--font-heading = Playfair Display, --font-body = Inter).
 *
 * Still outstanding from the brand kit: logo files, brand photography.
 * BRAND_KIT.md is the source of truth for hex / type / radius values.
 */
const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Exact brand hex from BRAND_KIT.md (use when a raw value is needed).
        brand: {
          primary: "#004b49", // Deep Teal — primary buttons, hero text, branding
          secondary: "#e28743", // Warm Amber — accents, highlights, secondary
          surface: "#f4f6f6", // Light Gray — card backgrounds / layout blocks
        },
      },
      fontFamily: {
        // Body — Inter (sans). Headings — Playfair Display (serif).
        sans: [
          "var(--font-body)",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        heading: [
          "var(--font-heading)",
          '"Playfair Display"',
          "Georgia",
          "Cambria",
          "serif",
        ],
        serif: [
          "var(--font-heading)",
          '"Playfair Display"',
          "Georgia",
          "serif",
        ],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
