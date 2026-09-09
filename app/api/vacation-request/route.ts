import { NextResponse } from "next/server";
import { Resend } from "resend";

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

  const data = parsed.data;
  const { delivered } = await sendNotification({
    subject: `New vacation request — ${data.firstName} ${data.lastName}`,
    text: formatSummary(data),
    replyTo: data.email,
  });

  if (!delivered) {
    // The submission is valid and captured in the logs — it just wasn't
    // emailed (no RESEND_API_KEY, unverified sending domain, or a Resend
    // error). Surface it loudly so nothing is lost.
    console.error(
      "[vacation-request] VALID submission NOT delivered:\n" +
        formatSummary(data),
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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Send the advisor notification via Resend.
 *
 * - Recipient (`EMAIL_TO`, default hello@parksportsandparadise.com) is a Google
 *   Workspace inbox monitored by Paige/Ashley — Resend only sends.
 * - `EMAIL_FROM` must be an address on a domain verified in Resend (SPF/DKIM
 *   DNS records added alongside the existing Workspace MX — see TODO.md).
 * - `replyTo` is the traveller's own email so advisors can just hit Reply.
 *
 * Without `RESEND_API_KEY` this is a no-op that returns `{ delivered: false }`
 * (the route still logs the submission), so dev/preview work without a key.
 */
async function sendNotification(opts: {
  subject: string;
  text: string;
  replyTo: string;
}): Promise<{ delivered: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.EMAIL_TO || "hello@parksportsandparadise.com";
  const from =
    process.env.EMAIL_FROM ||
    "Parks Ports & Paradise <no-reply@parksportsandparadise.com>";

  if (!apiKey) {
    return { delivered: false };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: opts.replyTo,
      subject: opts.subject,
      text: opts.text,
      html: `<pre style="font:14px/1.5 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;white-space:pre-wrap;margin:0">${escapeHtml(
        opts.text,
      )}</pre>`,
    });

    if (error) {
      console.error("[vacation-request] Resend error:", error);
      return { delivered: false };
    }
    return { delivered: true };
  } catch (err) {
    console.error("[vacation-request] email send threw:", err);
    return { delivered: false };
  }
}
