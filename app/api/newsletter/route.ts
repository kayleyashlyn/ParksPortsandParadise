import { NextResponse } from "next/server";

import { newsletterSignupSchema } from "@/lib/newsletterSchema";
import { sendNotification } from "@/lib/notify";
import { writeClient } from "@/lib/sanity.writeClient";

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

  const parsed = newsletterSignupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { email, source } = parsed.data;

  // Store the subscriber in Sanity. Without SANITY_API_WRITE_TOKEN this
  // throws — treat that the same as the other forms treat a missing
  // RESEND_API_KEY: log the valid submission so nothing is lost, and still
  // report success to the visitor (their email was genuinely accepted; it's
  // an ops gap, not theirs to see).
  let delivered = true;
  try {
    await writeClient.create({
      _type: "newsletterSubscriber",
      email,
      source,
      subscribedAt: new Date().toISOString(),
    });
  } catch (err) {
    delivered = false;
    console.error(
      `[newsletter] VALID signup NOT stored (${source}): ${email}`,
      err,
    );
  }

  // Best-effort heads-up to the team inbox — reuses the shared Resend helper,
  // same env-gated no-op behavior as the other forms. Not the system of
  // record (Sanity is); just saves Paige/Ashley from having to check Studio.
  await sendNotification({
    subject: "New newsletter signup",
    text: `New newsletter signup (${source}): ${email}`,
    replyTo: email,
  });

  return NextResponse.json({ ok: true, delivered });
}
