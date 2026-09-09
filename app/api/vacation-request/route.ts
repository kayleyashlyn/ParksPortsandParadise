import { NextResponse } from "next/server";

import {
  vacationRequestSchema,
  type VacationRequestInput,
} from "@/lib/vacationRequestSchema";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON" },
      { status: 400 },
    );
  }

  // Honeypot: silently accept and drop obvious bot submissions.
  if (
    body &&
    typeof body === "object" &&
    "company" in body &&
    (body as { company?: unknown }).company
  ) {
    return NextResponse.json({ ok: true });
  }

  const parsed = vacationRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const summary = formatSummary(parsed.data);
  const { delivered } = await sendNotification(summary, parsed.data.email);

  if (!delivered) {
    // The submission is valid and captured in the logs — it just wasn't
    // emailed, because no email provider is wired yet (see TODO.md). Surface
    // it loudly so it isn't lost during the scaffold phase.
    console.error(
      "[vacation-request] VALID submission NOT delivered — email provider not configured:\n" +
        summary,
    );
  }

  return NextResponse.json({ ok: true, delivered });
}

function line(label: string, value: string | undefined | null) {
  return `${label}: ${value && value.length > 0 ? value : "—"}`;
}

function formatSummary(data: VacationRequestInput): string {
  return [
    "New Vacation Request",
    "",
    "CONTACT",
    line("Name", `${data.firstName} ${data.lastName}`),
    line("Email", data.email),
    line("Phone", data.phone),
    "",
    "DESTINATIONS",
    data.destinations.join(", "),
    "",
    "DATES & BUDGET",
    line("Check-in", data.checkInDate),
    line("Check-out", data.checkOutDate),
    line("Dates flexible", data.datesFlexible),
    line("Budget", data.budget),
    "",
    "TRIP DETAILS",
    line("Celebrating", data.celebrating),
    line("Discount eligibility", data.discounts?.join(", ")),
    line("Priorities", data.priorities?.join(", ")),
    "",
    "PARTY",
    line("Party size", data.partySize),
    line("Ages under 18", data.agesUnder18),
    line("Rooms needed", data.roomsNeeded),
    line("Referral source", data.referral),
  ].join("\n");
}

/**
 * Send the advisor notification to hello@parksportsandparadise.com.
 *
 * TODO(forms-agent): wire the chosen provider (Resend or SendGrid — still an
 * open decision; see .env.example / TODO.md). Kept provider-agnostic on purpose
 * — do NOT npm-install a provider SDK until the client picks one.
 */
async function sendNotification(
  summary: string,
  replyTo: string,
): Promise<{ delivered: boolean }> {
  const apiKey = process.env.EMAIL_PROVIDER_API_KEY;
  const to = process.env.EMAIL_TO || "hello@parksportsandparadise.com";
  const from = process.env.EMAIL_FROM || "noreply@parksportsandparadise.com";

  if (!apiKey) {
    return { delivered: false };
  }

  // Placeholder for the real provider call, e.g.:
  //   await resend.emails.send({ to, from, replyTo, subject, text: summary });
  void to;
  void from;
  void replyTo;
  console.warn(
    "[vacation-request] EMAIL_PROVIDER_API_KEY is set but no provider is wired yet.",
  );
  return { delivered: false };
}
