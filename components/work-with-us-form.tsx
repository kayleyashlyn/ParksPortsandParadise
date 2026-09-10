"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Check, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CONTACT } from "@/lib/site";
import { workWithUsSchema, type WorkWithUsInput } from "@/lib/workWithUsSchema";

declare global {
  interface Window {
    // `dataLayer` is declared globally by @next/third-parties (GA4 tag lives in
    // app/layout.tsx); only `gtag` needs augmenting here.
    gtag?: (...args: unknown[]) => void;
  }
}

export function WorkWithUsForm() {
  const [status, setStatus] = React.useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  // Honeypot — a hidden field real users never fill. Kept out of RHF/Zod.
  const [company, setCompany] = React.useState("");

  // On success the <form> is unmounted and replaced by the confirmation panel;
  // move focus to its heading so it isn't dropped to <body>. (The panel is
  // also role="status" so it's announced even if focus isn't followed.)
  const successHeadingRef = React.useRef<HTMLHeadingElement>(null);
  React.useEffect(() => {
    if (status === "success") successHeadingRef.current?.focus();
  }, [status]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkWithUsInput>({
    resolver: zodResolver(workWithUsSchema),
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      experience: "",
      travelFocus: "",
    },
  });

  async function onValid(values: WorkWithUsInput) {
    if (company) {
      // Bot: pretend success, send nothing.
      setStatus("success");
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch("/api/work-with-us", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error(String(res.status));
      const result = (await res.json().catch(() => ({}))) as {
        delivered?: boolean;
      };
      // Recruiting-funnel event — only once the message actually reached the
      // inbox (until Resend is configured the route returns `delivered: false`).
      // `gtag` only exists after the visitor accepts analytics cookies, so this
      // is a safe no-op otherwise.
      if (result.delivered !== false) {
        window.gtag?.("event", "submit_application", {
          form_id: "work_with_us",
        });
      }
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-lg border border-border bg-muted/50 p-8 text-center"
      >
        <div
          aria-hidden
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground"
        >
          <Check className="h-6 w-6" />
        </div>
        <h2
          ref={successHeadingRef}
          tabIndex={-1}
          className="mt-4 text-2xl focus:outline-none"
        >
          Thanks — we&rsquo;ve got it
        </h2>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">
          Thanks for reaching out about joining Parks Ports &amp; Paradise. One
          of us will get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onValid)}
      className="rounded-lg border border-border bg-card p-6 sm:p-8"
    >
      <p className="text-xs text-muted-foreground">
        Fields marked <span className="text-destructive">*</span> are required.
      </p>

      <div className="mt-6 space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField
            label="First name"
            required
            autoComplete="given-name"
            error={errors.firstName?.message}
            {...register("firstName")}
          />
          <TextField
            label="Last name"
            required
            autoComplete="family-name"
            error={errors.lastName?.message}
            {...register("lastName")}
          />
          <TextField
            label="Email"
            type="email"
            required
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <TextField
            label="Phone"
            type="tel"
            hint="Optional"
            autoComplete="tel"
            error={errors.phone?.message}
            {...register("phone")}
          />
        </div>

        <TextAreaField
          label="Are you currently a travel agent? If so, how long and which company?"
          required
          rows={3}
          error={errors.experience?.message}
          {...register("experience")}
        />

        <TextAreaField
          label="What type of travel do you plan to book?"
          hint="Optional — e.g. cruises, all-inclusive, Walt Disney products"
          rows={2}
          error={errors.travelFocus?.message}
          {...register("travelFocus")}
        />
      </div>

      {/* Honeypot — off-screen and not tabbable; real people leave it blank. */}
      <div className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor="pp-company">Company (leave this blank)</label>
        <input
          id="pp-company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      {status === "error" && (
        <p
          role="alert"
          className="mt-6 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          Something went wrong sending your message. Please try again, or email{" "}
          <a
            className="underline underline-offset-2"
            href={`mailto:${CONTACT.email}`}
          >
            {CONTACT.email}
          </a>
          .
        </p>
      )}

      <div className="mt-8">
        <Button
          type="submit"
          variant="secondary"
          size="lg"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending…
            </>
          ) : (
            "Send message"
          )}
        </Button>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */

function RequiredMark() {
  return (
    <>
      {" "}
      <span aria-hidden className="text-destructive">
        *
      </span>
    </>
  );
}

function TextField({
  label,
  error,
  hint,
  required,
  className,
  ...props
}: React.ComponentProps<"input"> & {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
}) {
  const id = props.id ?? props.name;
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div>
      <Label htmlFor={id}>
        {label}
        {required ? <RequiredMark /> : null}
      </Label>
      <Input
        id={id}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn("mt-1.5", className)}
        {...props}
      />
      {hint && !error ? (
        <p id={`${id}-hint`} className="mt-1 text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function TextAreaField({
  label,
  error,
  hint,
  required,
  className,
  ...props
}: React.ComponentProps<"textarea"> & {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
}) {
  const id = props.id ?? props.name;
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div>
      <Label htmlFor={id}>
        {label}
        {required ? <RequiredMark /> : null}
      </Label>
      <textarea
        id={id}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          "mt-1.5 flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
      {hint && !error ? (
        <p id={`${id}-hint`} className="mt-1 text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
