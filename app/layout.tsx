import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Parks Ports & Paradise",
  description:
    "Parks Ports & Paradise — website rebuild. Project scaffold; page content pending brand-kit delivery.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
