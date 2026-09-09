import { Resend } from "resend";

/**
 * Shared transactional-email helper for the site's form API routes
 * (Vacation Request Form, Work With Us application). One implementation of the
 * Resend call so behaviour can't drift between forms.
 *
 * - Recipient (`EMAIL_TO`, default hello@parksportsandparadise.com) is a Google
 *   Workspace inbox monitored by Paige/Ashley — Resend only sends.
 * - `EMAIL_FROM` must be an address on a domain verified in Resend (SPF/DKIM
 *   DNS records added alongside the existing Workspace MX — see TODO.md).
 * - `replyTo` is the submitter's own email so the team can just hit Reply.
 *
 * Without `RESEND_API_KEY` this is a no-op that returns `{ delivered: false }`;
 * the caller is expected to log the (valid) submission so nothing is lost.
 */
export async function sendNotification(opts: {
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
      console.error("[notify] Resend error:", error);
      return { delivered: false };
    }
    return { delivered: true };
  } catch (err) {
    console.error("[notify] email send threw:", err);
    return { delivered: false };
  }
}

/** Minimal HTML escape for interpolating plain text into the email's `<pre>`. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** `"Label: value"` with an em dash for empty values — shared summary helper. */
export function summaryLine(
  label: string,
  value: string | undefined | null,
): string {
  return `${label}: ${value && value.length > 0 ? value : "—"}`;
}
