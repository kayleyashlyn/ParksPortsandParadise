import type { Metadata } from "next";
import Link from "next/link";

import { TeamGrid } from "@/components/team-grid";
import { Button } from "@/components/ui/button";
import { getActiveAgents } from "@/lib/sanity.queries";
import { pageMetadata } from "@/lib/seo";
import { PRIMARY_CTA } from "@/lib/site";

export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: "Meet the Team",
  description:
    "The advisors behind Parks Ports & Paradise — the people who plan your theme park, cruise, and all-inclusive trips.",
  path: "/meet-the-team",
});

export default async function MeetTheTeamPage() {
  const agents = await getActiveAgents();
  // Founders / leadership render in their own row above the advisors.
  const leadership = agents.filter((agent) => agent.teamGroup === "leadership");
  const advisors = agents.filter((agent) => agent.teamGroup !== "leadership");

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <h1 className="text-balance text-4xl sm:text-5xl">Meet the Team</h1>
        <p className="mt-4 text-pretty text-muted-foreground">
          Every trip we plan is handled by a real advisor. Here are the people
          who will build yours.
        </p>
      </header>

      <div className="mt-12">
        {agents.length > 0 ? (
          <div className="space-y-16">
            {leadership.length > 0 ? <TeamGrid agents={leadership} /> : null}
            {advisors.length > 0 ? <TeamGrid agents={advisors} /> : null}
          </div>
        ) : (
          <p className="text-muted-foreground">
            Our advisor profiles are being updated — check back soon.
          </p>
        )}
      </div>

      <section className="mt-16 rounded-lg border border-border bg-muted/50 px-6 py-10 text-center sm:px-10">
        <h2 className="text-2xl sm:text-3xl">Ready to start planning?</h2>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">
          Tell us about your trip and one of our advisors will put together a
          free quote.
        </p>
        <div className="mt-6">
          <Button asChild variant="secondary" size="lg">
            <Link href={PRIMARY_CTA.href}>{PRIMARY_CTA.label}</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
