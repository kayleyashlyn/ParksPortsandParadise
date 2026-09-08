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
  title: "Parks Ports & Paradise",
  description:
    "Parks Ports & Paradise — website rebuild. Project scaffold; page content pending brand-kit delivery.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
