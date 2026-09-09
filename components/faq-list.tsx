import { Plus } from "lucide-react";

/**
 * Progressive-disclosure FAQ built on native `<details>` / `<summary>` — no
 * client JS, keyboard- and screen-reader-friendly by default. Server Component.
 */
export function FaqList({
  items,
}: {
  items: { q: string; a: React.ReactNode }[];
}) {
  return (
    <div className="divide-y divide-border rounded-lg border border-border">
      {items.map((item) => (
        <details key={item.q} className="group px-4 py-3 sm:px-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-1 text-sm font-medium text-foreground [&::-webkit-details-marker]:hidden">
            {item.q}
            <Plus
              aria-hidden
              className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-45"
            />
          </summary>
          <div className="pb-1 pt-2 text-sm text-muted-foreground">
            {item.a}
          </div>
        </details>
      ))}
    </div>
  );
}
