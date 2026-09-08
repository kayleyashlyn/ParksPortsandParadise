import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
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
  title: "Parks Ports & Paradise",
  description:
    "Family vacation planning for theme parks, cruises, and all-inclusive resorts. Tell us about your trip and our advisors build a custom quote — free.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="flex min-h-dvh flex-col antialiased">
        <SiteHeader />
        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
