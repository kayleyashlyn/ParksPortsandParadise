import Image from "next/image";
import Link from "next/link";
import { Instagram } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CookieSettingsLink } from "@/components/cookie-settings-link";
import { NewsletterForm } from "@/components/newsletter-form";
import {
  ACCREDITATIONS,
  CONTACT,
  FOOTER_NAV,
  PRIMARY_CTA,
  SELLER_OF_TRAVEL,
} from "@/lib/site";

/**
 * Global footer. Rendered on a dark surface via the `dark` class so the shadcn
 * tokens resolve to their dark values (see app/globals.css). Carries the single
 * dominant CTA (repeated per §2), a secondary copy of the accreditation /
 * Seller-of-Travel line (primary placement is the homepage trust bar, §4), the
 * Agent Portal utility link (§11 #4), and a low-friction newsletter field.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="dark border-t border-border bg-background text-foreground">
      <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 border-b border-border pb-10 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/images/logos/logo-white.png"
              alt="Parks Ports and Paradise"
              width={80}
              height={100}
              className="h-14 w-auto"
            />
            <p className="max-w-xs text-sm text-muted-foreground">
              Family vacations to the parks, ports, and paradise — planned with
              you, quoted for free.
            </p>
          </div>
          <Button asChild variant="secondary" size="lg">
            <Link href={PRIMARY_CTA.href}>{PRIMARY_CTA.label}</Link>
          </Button>
        </div>

        <div className="grid gap-10 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {FOOTER_NAV.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {col.heading}
              </h2>
              <ul className="mt-4 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      {...(link.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="text-sm text-foreground/80 underline decoration-foreground/30 underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Newsletter
            </h2>
            <p className="mt-4 text-sm text-foreground/80">
              Trip ideas and deals, no spam.
            </p>
            <div className="mt-3">
              <NewsletterForm />
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
            {SELLER_OF_TRAVEL.map((item) => (
              <li key={item}>{item}</li>
            ))}
            {ACCREDITATIONS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-col items-start gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {year} Parks Ports &amp; Paradise Travel Company. All rights
            reserved.
          </p>
          <div className="flex items-center gap-4">
            <CookieSettingsLink />
            <a
              href={CONTACT.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Instagram aria-hidden className="h-5 w-5" />
              <span className="sr-only">
                Parks Ports &amp; Paradise on Instagram
              </span>
            </a>
            <a
              href={`mailto:${CONTACT.email}`}
              className="text-xs text-muted-foreground underline decoration-muted-foreground/40 underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
            >
              {CONTACT.email}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
