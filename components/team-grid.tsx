import { Instagram, Mail, MapPin } from "lucide-react";

import { SanityImage } from "@/components/sanity-image";
import type { AgentProfile } from "@/lib/sanity.queries";
import { cn } from "@/lib/utils";

/**
 * "Meet the Team" advisor grid (IMPLEMENTATION_PLAN.md §4 / §7 — a self-service
 * collection, no per-agent routes). Server Component; agents come from
 * `getActiveAgents()` (active only, ordered by `order` then name).
 *
 * The card itself is not a link, so nothing competes with the site's one
 * button-weight CTA ("Request a Quote"). The advisor's own email / Instagram
 * are structured contact fields (not bio prose) and render as small, muted
 * inline text links — metadata, not calls to action. Scales to ~20 agents.
 *
 * `center` (used for the founders/leadership row on `/meet-the-team`, a small
 * group) caps the grid at 2 columns and centers it, instead of stretching
 * across the same 3-column width as the full advisor roster.
 */
export function TeamGrid({
  agents,
  center = false,
}: {
  agents: AgentProfile[];
  center?: boolean;
}) {
  if (agents.length === 0) return null;

  return (
    <ul
      className={cn(
        "grid gap-x-6 gap-y-10",
        center ? "mx-auto max-w-3xl sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3",
      )}
    >
      {agents.map((agent) => {
        // The editor may type the handle with or without a leading "@".
        const instagramHandle =
          agent.instagramHandle?.replace(/^@+/, "").trim() || null;

        return (
          <li
            key={agent._id}
            className="-m-2 flex flex-col rounded-lg p-2 transition-colors hover:bg-brand-blush/10"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-muted">
              <SanityImage
                image={agent.photo}
                alt={agent.photo.alt ?? agent.name}
                aspect={4 / 5}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>

            <div className="mt-4">
              <h2 className="text-xl text-foreground">{agent.name}</h2>
              {agent.title ? (
                <p className="mt-0.5 text-sm font-medium text-primary">
                  {agent.title}
                </p>
              ) : null}
              {agent.location ? (
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin aria-hidden className="h-3.5 w-3.5 shrink-0" />
                  {agent.location}
                </p>
              ) : null}
              {agent.bio ? (
                <p className="mt-2 line-clamp-4 text-sm text-muted-foreground">
                  {agent.bio}
                </p>
              ) : null}
              {agent.specialties.length > 0 ? (
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {agent.specialties.map((specialty) => (
                    <li
                      key={specialty}
                      className="rounded-full border border-brand-secondary/50 bg-brand-secondary/10 px-2.5 py-0.5 text-xs text-foreground"
                    >
                      {specialty}
                    </li>
                  ))}
                </ul>
              ) : null}
              {agent.email || instagramHandle ? (
                <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
                  {agent.email ? (
                    <li>
                      <a
                        href={`mailto:${agent.email}`}
                        className="inline-flex items-center gap-1.5 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                      >
                        <Mail aria-hidden className="h-3.5 w-3.5 shrink-0" />
                        <span className="break-all">{agent.email}</span>
                      </a>
                    </li>
                  ) : null}
                  {instagramHandle ? (
                    <li>
                      <a
                        href={`https://www.instagram.com/${instagramHandle}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                      >
                        <Instagram aria-hidden className="h-3.5 w-3.5 shrink-0" />
                        <span>@{instagramHandle}</span>
                      </a>
                    </li>
                  ) : null}
                </ul>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
