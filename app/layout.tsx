import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

// Body — Inter (sans-serif) per BRAND_KIT.md
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

// Headings — Playfair Display (serif) per BRAND_KIT.md
const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: {
    default: "Parks Ports and Paradise",
    template: "%s | Parks Ports and Paradise",
  },
  description:
    "Family vacation planning for theme parks, cruises, and all-inclusive resorts. Tell us about your trip and one of our advisors builds a custom quote.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}
