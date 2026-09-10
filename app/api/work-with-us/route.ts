import { NextResponse } from "next/server";

import { sendNotification, summaryLine as line } from "@/lib/notify";
import { workWithUsSchema, type WorkWithUsInput } from "@/lib/workWithUsSchema";

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

  const parsed = workWithUsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const { delivered } = await sendNotification({
    subject: `New Work With Us message — ${data.firstName} ${data.lastName}`,
    text: formatSummary(data),
    replyTo: data.email,
  });

  if (!delivered) {
    // Valid submission, captured here — it just wasn't emailed (no
    // RESEND_API_KEY, unverified domain, or a Resend error). Log it loudly.
    console.error(
      "[work-with-us] VALID submission NOT delivered:\n" + formatSummary(data),
    );
  }

  return NextResponse.json({ ok: true, delivered });
}

function formatSummary(data: WorkWithUsInput): string {
  return [
    "New Work With Us message (prospective advisor)",
    "",
    "CONTACT",
    line("Name", `${data.firstName} ${data.lastName}`),
    line("Email", data.email),
    line("Phone", data.phone),
    "",
    "CURRENT TRAVEL-AGENT EXPERIENCE",
    data.experience,
    "",
    "TRAVEL THEY PLAN TO BOOK",
    data.travelFocus && data.travelFocus.length > 0 ? data.travelFocus : "—",
  ].join("\n");
}
