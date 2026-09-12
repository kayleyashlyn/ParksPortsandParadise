"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PRIMARY_CTA, PRIMARY_NAV } from "@/lib/site";

function navLinkClass(active: boolean) {
  return cn(
    "inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-foreground/75 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    active && "text-foreground",
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const [mobileSubOpen, setMobileSubOpen] = useState(false);
  // Only one nav item has a flyout (ui-agent.md: one flyout max).
  const flyoutRef = useRef<HTMLLIElement>(null);
  const flyoutTriggerRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);

  // Close every menu on route change.
  useEffect(() => {
    setMobileOpen(false);
    setFlyoutOpen(false);
    setMobileSubOpen(false);
  }, [pathname]);

  // Desktop flyout: dismiss on outside click, on Escape (focus back to the
  // trigger), or when focus leaves the flyout entirely (Tab / Shift+Tab out).
  useEffect(() => {
    if (!flyoutOpen) return;
    const node = flyoutRef.current;
    function onPointer(e: MouseEvent) {
      if (node && !node.contains(e.target as Node)) {
        setFlyoutOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setFlyoutOpen(false);
        flyoutTriggerRef.current?.focus();
      }
    }
    function onFocusOut(e: FocusEvent) {
      // relatedTarget is null when focus leaves the document (e.g. to browser
      // chrome) — don't close in that case.
      if (
        node &&
        e.relatedTarget instanceof Node &&
        !node.contains(e.relatedTarget)
      ) {
        setFlyoutOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    node?.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
      node?.removeEventListener("focusout", onFocusOut);
    };
  }, [flyoutOpen]);

  // While the mobile panel is open: lock scroll, make the rest of the page
  // `inert` (so a screen reader / keyboard user can't wander behind it), move
  // focus into the panel, trap Tab within [toggle + panel], and close on Escape.
  useEffect(() => {
    if (!mobileOpen) return;

    document.body.style.overflow = "hidden";

    const header = headerRef.current;
    const inerted = Array.from(document.body.children).filter(
      (el) =>
        el !== header && el.tagName !== "SCRIPT" && el.tagName !== "STYLE",
    );
    inerted.forEach((el) => el.setAttribute("inert", ""));

    // Toggle first so Shift+Tab from the first link reaches the close button,
    // then the panel's own focusables (skipping any inside the collapsed
    // sub-menu, which have no `offsetParent`).
    const focusables = () =>
      [
        menuToggleRef.current,
        ...Array.from(
          mobilePanelRef.current?.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled])',
          ) ?? [],
        ).filter((el) => el.offsetParent !== null),
      ].filter((el): el is HTMLElement => el != null);

    // Move focus into the panel (first link after the toggle).
    focusables()[1]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        menuToggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      const f = focusables();
      if (f.length === 0) return;
      const first = f[0];
      const last = f[f.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (!active || active === first || !f.includes(active))) {
        e.preventDefault();
        last.focus();
      } else if (
        !e.shiftKey &&
        (!active || active === last || !f.includes(active))
      ) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    // If the viewport grows to `md` while the panel is open, close it — the
    // panel becomes `display:none` there and would otherwise leave the page
    // inert and scroll-locked with no visible way out.
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("resize", onResize);
      inerted.forEach((el) => el.removeAttribute("inert"));
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70"
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:shadow focus:ring-2 focus:ring-ring"
      >
        Skip to content
      </a>

      <div className="mx-auto flex h-20 max-w-[1400px] items-center gap-3 px-4 sm:gap-6 sm:px-6 lg:h-24 lg:px-8">
        <Link
          href="/"
          aria-label="Parks Ports & Paradise — home"
          data-analytics-id="site-logo"
          className="flex min-w-0 items-center gap-2.5 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {/* The circular seal has too much fine text to read at header size, so
              it only shows where there's room (sm+); the wordmark carries the
              brand on mobile. A horizontal logo lockup would let both show at
              every width — see TODO.md. Sized to read as a real mark (not a
              favicon) within the header bar, stepping up again at lg (desktop)
              where there's room to spare; intrinsic width/height scaled to
              match so next/image doesn't upscale a small source. */}
          <Image
            src="/images/logos/logo-primary.png"
            alt=""
            aria-hidden
            width={160}
            height={200}
            priority
            className="hidden h-14 w-auto sm:block lg:h-20"
          />
          <span className="truncate font-heading text-sm leading-none text-foreground sm:text-xl">
            Parks Ports &amp; Paradise
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden flex-1 md:block">
          <ul className="flex items-center justify-center gap-1">
            {PRIMARY_NAV.map((item) =>
              item.children ? (
                <li key={item.href} ref={flyoutRef} className="relative">
                  <button
                    ref={flyoutTriggerRef}
                    type="button"
                    aria-expanded={flyoutOpen}
                    aria-controls="destinations-flyout"
                    onClick={() => setFlyoutOpen((v) => !v)}
                    className={navLinkClass(pathname.startsWith(item.href))}
                  >
                    {item.label}
                    <ChevronDown
                      aria-hidden
                      className={cn(
                        "h-4 w-4 transition-transform",
                        flyoutOpen && "rotate-180",
                      )}
                    />
                  </button>
                  <div
                    id="destinations-flyout"
                    hidden={!flyoutOpen}
                    className="absolute left-1/2 top-full z-50 mt-2 w-80 -translate-x-1/2 rounded-lg border border-border bg-popover p-2 text-popover-foreground shadow-lg"
                  >
                    <Link
                      href={item.href}
                      className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                    >
                      All destinations
                    </Link>
                    <div className="my-1 h-px bg-border" />
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block rounded-md px-3 py-2 hover:bg-muted"
                      >
                        <span className="block text-sm font-medium">
                          {child.label}
                        </span>
                        {child.description ? (
                          <span className="mt-0.5 block text-xs text-muted-foreground">
                            {child.description}
                          </span>
                        ) : null}
                      </Link>
                    ))}
                  </div>
                </li>
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className={navLinkClass(pathname === item.href)}
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <Button asChild variant="secondary" size="sm" className="sm:h-9 sm:px-4">
            <Link href={PRIMARY_CTA.href}>{PRIMARY_CTA.label}</Link>
          </Button>
          <Button
            ref={menuToggleRef}
            type="button"
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => {
              // Safari/Firefox (macOS) don't focus a <button> on click, so on
              // close focus would be lost to <body>. Put it back on the toggle
              // explicitly. (Opening moves focus into the panel via the effect;
              // route-change close goes through the [pathname] effect, not here,
              // so it still lets focus flow to the new page.)
              if (mobileOpen) menuToggleRef.current?.focus();
              setMobileOpen((v) => !v);
            }}
          >
            {mobileOpen ? (
              <X aria-hidden className="h-5 w-5" />
            ) : (
              <Menu aria-hidden className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      <div
        id="mobile-nav"
        ref={mobilePanelRef}
        hidden={!mobileOpen}
        className="border-t border-border bg-background md:hidden"
      >
        <nav
          aria-label="Mobile"
          className="mx-auto max-w-[1400px] px-4 py-4 sm:px-6"
        >
          <ul className="flex flex-col gap-1">
            {PRIMARY_NAV.map((item) =>
              item.children ? (
                <li key={item.href}>
                  <button
                    type="button"
                    aria-expanded={mobileSubOpen}
                    onClick={() => setMobileSubOpen((v) => !v)}
                    className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-medium hover:bg-muted"
                  >
                    {item.label}
                    <ChevronDown
                      aria-hidden
                      className={cn(
                        "h-4 w-4 transition-transform",
                        mobileSubOpen && "rotate-180",
                      )}
                    />
                  </button>
                  <ul
                    hidden={!mobileSubOpen}
                    className="ml-3 border-l border-border pl-3"
                  >
                    <li>
                      <Link
                        href={item.href}
                        className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
                      >
                        All destinations
                      </Link>
                    </li>
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
          <Button asChild variant="secondary" className="mt-3 w-full">
            <Link href={PRIMARY_CTA.href}>{PRIMARY_CTA.label}</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
