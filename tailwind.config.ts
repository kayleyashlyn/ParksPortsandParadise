import type { Config } from "tailwindcss";

/**
 * Design tokens sourced verbatim from BRAND_KIT.md (client brand refresh,
 * delivered 2026-09-08). BRAND_KIT.md is the source of truth for the palette,
 * type families, and radius — do not change hex/font values here without
 * updating that file (and app/globals.css, which mirrors these tokens).
 *
 * Font families reference the next/font CSS variables set in app/layout.tsx
 * (--font-heading = Playfair Display, --font-body = Inter), falling back to
 * the named families and system stacks.
 */
const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx,mdx}",
    "./sanity/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette — exact hex from BRAND_KIT.md
        brand: {
          primary: "#004b49", // Deep Teal — primary buttons, hero text, main branding
          secondary: "#e28743", // Warm Amber — accents, highlights, secondary elements
        },

        // Semantic aliases (used by shadcn/ui-style component utilities)
        primary: {
          DEFAULT: "#004b49",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#e28743",
          foreground: "#ffffff",
        },
        background: "#ffffff", // Pure White
        foreground: "#004b49", // Deep Teal — primary text per brand kit
        muted: {
          DEFAULT: "#f4f6f6", // Light Gray — card backgrounds / layout blocks
          foreground: "#4b5563",
        },
        surface: "#f4f6f6", // alias of muted for layout blocks
      },

      fontFamily: {
        // Headings — Playfair Display (serif). Body — Inter (sans-serif).
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
        body: [
          "var(--font-body)",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },

      borderRadius: {
        // Base radius 0.5rem per BRAND_KIT.md styling guidelines
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
