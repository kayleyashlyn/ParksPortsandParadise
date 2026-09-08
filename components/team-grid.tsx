import { SanityImage } from "@/components/sanity-image";
import type { AgentProfile } from "@/lib/sanity.queries";

/**
 * "Meet the Team" advisor grid (IMPLEMENTATION_PLAN.md §4 / §7 — a self-service
 * collection, no per-agent routes). Server Component; agents come from
 * `getActiveAgents()` (active only, ordered by `order` then name).
 *
 * Cards are display-only — not links — so nothing competes with the site's one
 * CTA. Scales to ~20 agents.
 */
export function TeamGrid({ agents }: { agents: AgentProfile[] }) {
  if (agents.length === 0) return null;

  return (
    <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {agents.map((agent) => (
        <li key={agent._id} className="flex flex-col">
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-muted">
            <SanityImage
              image={agent.photo}
              alt={agent.name}
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
                    className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground"
                  >
                    {specialty}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
