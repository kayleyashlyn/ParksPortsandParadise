import type { Metadata } from "next";

import { VacationRequestForm } from "@/components/vacation-request-form";

export const metadata: Metadata = {
  title: "Plan Your Vacation | Parks Ports & Paradise",
  description:
    "Tell us about your trip — destinations, dates, budget, and who's coming — and a Parks Ports & Paradise advisor will build a custom quote. Free, no obligation.",
};

export default async function PlanYourVacationPage({
  searchParams,
}: {
  searchParams: Promise<{ destination?: string | string[] }>;
}) {
  const { destination } = await searchParams;
  const destinationParam = Array.isArray(destination)
    ? destination[0]
    : destination;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:py-20">
      <header>
        <h1 className="text-balance text-4xl sm:text-5xl">Plan your vacation</h1>
        <p className="mt-4 text-pretty text-muted-foreground">
          A few quick questions so we can match you with the right advisor and
          start building your quote. Takes about two minutes — no payment, no
          obligation.
        </p>
      </header>

      <div className="mt-10">
        <VacationRequestForm destinationParam={destinationParam} />
      </div>
    </div>
  );
}
