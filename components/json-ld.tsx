/**
 * Renders a JSON-LD `<script>` for structured data. Server component — the
 * object is serialized once at render time. Only pass values that are already
 * public on the page (schema.org markup, never secrets or PII).
 *
 * `<` is escaped so a stray string value can't break out of the `<script>`.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
