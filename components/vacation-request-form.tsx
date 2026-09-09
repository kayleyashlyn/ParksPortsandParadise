"use client";

import * as React from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type FieldPath,
  type UseFormRegisterReturn,
  useForm,
} from "react-hook-form";
import { Check, ChevronLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  BUDGET_OPTIONS,
  CELEBRATING_OPTIONS,
  DATES_FLEXIBLE_OPTIONS,
  DESTINATION_OPTIONS,
  DISCOUNT_OPTIONS,
  matchDestinationOption,
  PRIORITY_OPTIONS,
  ROOMS_OPTIONS,
  vacationRequestSchema,
  type VacationRequestInput,
} from "@/lib/vacationRequestSchema";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

type Values = VacationRequestInput;

const STEPS: {
  id: string;
  title: string;
  fields: FieldPath<Values>[];
}[] = [
  {
    id: "contact",
    title: "Your details",
    fields: ["firstName", "lastName", "email", "phone"],
  },
  { id: "destination", title: "Where to", fields: ["destinations"] },
  {
    id: "dates",
    title: "Dates & budget",
    fields: ["checkInDate", "checkOutDate", "datesFlexible", "budget"],
  },
  {
    id: "trip",
    title: "Trip style",
    fields: ["celebrating", "discounts", "priorities"],
  },
  {
    id: "party",
    title: "Your party",
    fields: ["partySize", "agesUnder18", "roomsNeeded", "referral"],
  },
];

const today = new Date().toISOString().slice(0, 10);

export function VacationRequestForm({
  destinationParam,
}: {
  destinationParam?: string;
}) {
  const [stepIndex, setStepIndex] = React.useState(0);
  const [status, setStatus] = React.useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  // Honeypot — a hidden field real users never fill. Kept out of RHF/Zod.
  const [company, setCompany] = React.useState("");

  const {
    register,
    handleSubmit,
    trigger,
    clearErrors,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(vacationRequestSchema),
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      destinations: (() => {
        const match = matchDestinationOption(destinationParam);
        return match ? [match] : [];
      })(),
      checkInDate: "",
      checkOutDate: "",
      discounts: [],
      priorities: [],
      partySize: "",
      agesUnder18: "",
      referral: "",
    },
  });

  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;
  const progress = Math.round(((stepIndex + 1) / STEPS.length) * 100);

  async function goNext() {
    const ok = await trigger(step.fields, { shouldFocus: true });
    if (ok) {
      // Don't carry this step's (now-passing) validation state into the next.
      clearErrors();
      setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    }
  }

  function goBack() {
    clearErrors();
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  async function onValid(values: Values) {
    if (company) {
      // Bot: pretend success, send nothing.
      setStatus("success");
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch("/api/vacation-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error(String(res.status));
      // GA4 conversion event. `gtag` is injected by seo-agent's analytics
      // setup; until then these are safe no-ops. A missing event is a bug
      // (forms-agent.md) — the call site lives here on purpose.
      window.gtag?.("event", "generate_lead", {
        form_id: "vacation_request",
        currency: "USD",
      });
      window.dataLayer?.push({ event: "vacation_request_submitted" });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-border bg-muted/50 p-8 text-center">
        <div
          aria-hidden
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground"
        >
          <Check className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-2xl">Request received</h2>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">
          Thanks! One of our advisors will reach out soon to start planning your
          trip. Nothing else to do right now.
        </p>
        <div className="mt-6">
          <Button asChild variant="secondary">
            <Link href="/destinations">Keep browsing destinations</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onValid)}
      className="rounded-lg border border-border bg-card p-6 sm:p-8"
    >
      <div>
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-sm font-semibold">{step.title}</p>
          <p className="text-xs text-muted-foreground">
            Step {stepIndex + 1} of {STEPS.length}
          </p>
        </div>
        <div
          role="progressbar"
          aria-valuenow={stepIndex + 1}
          aria-valuemin={1}
          aria-valuemax={STEPS.length}
          aria-label={`Step ${stepIndex + 1} of ${STEPS.length}`}
          className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"
        >
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {step.id === "contact" && (
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField
              label="First name"
              autoComplete="given-name"
              error={errors.firstName?.message}
              {...register("firstName")}
            />
            <TextField
              label="Last name"
              autoComplete="family-name"
              error={errors.lastName?.message}
              {...register("lastName")}
            />
            <TextField
              label="Email"
              type="email"
              autoComplete="email"
              error={errors.email?.message}
              {...register("email")}
            />
            <TextField
              label="Phone"
              type="tel"
              autoComplete="tel"
              error={errors.phone?.message}
              {...register("phone")}
            />
          </div>
        )}

        {step.id === "destination" && (
          <OptionGroup
            type="checkbox"
            legend="Where are you wanting to visit?"
            description="Choose one or more."
            options={DESTINATION_OPTIONS}
            field={register("destinations")}
            error={errors.destinations?.message}
            columns
          />
        )}

        {step.id === "dates" && (
          <>
            <div className="grid gap-6 sm:grid-cols-2">
              <TextField
                label="Preferred check-in"
                type="date"
                min={today}
                hint="Optional"
                error={errors.checkInDate?.message}
                {...register("checkInDate")}
              />
              <TextField
                label="Preferred check-out"
                type="date"
                min={today}
                hint="Optional"
                error={errors.checkOutDate?.message}
                {...register("checkOutDate")}
              />
            </div>
            <OptionGroup
              type="radio"
              legend="Are your dates flexible?"
              options={DATES_FLEXIBLE_OPTIONS}
              field={register("datesFlexible")}
              error={errors.datesFlexible?.message}
            />
            <OptionGroup
              type="radio"
              legend="Budget (excluding flights)"
              options={BUDGET_OPTIONS}
              field={register("budget")}
              error={errors.budget?.message}
              columns
            />
          </>
        )}

        {step.id === "trip" && (
          <>
            <OptionGroup
              type="radio"
              legend="Celebrating anything special?"
              description="Optional."
              options={CELEBRATING_OPTIONS}
              field={register("celebrating")}
              error={errors.celebrating?.message}
              columns
            />
            <OptionGroup
              type="checkbox"
              legend="Discount eligibility"
              description="Optional — select any that apply."
              options={DISCOUNT_OPTIONS}
              field={register("discounts")}
              error={errors.discounts?.message}
              columns
            />
            <OptionGroup
              type="checkbox"
              legend="Trip priorities"
              description="Optional — select any that apply."
              options={PRIORITY_OPTIONS}
              field={register("priorities")}
              error={errors.priorities?.message}
              columns
            />
          </>
        )}

        {step.id === "party" && (
          <>
            <div className="grid gap-6 sm:grid-cols-2">
              <TextField
                label="Party size"
                inputMode="numeric"
                placeholder="e.g. 2 adults, 2 kids"
                error={errors.partySize?.message}
                {...register("partySize")}
              />
              <TextField
                label="Ages of anyone under 18"
                placeholder="e.g. 8, 5, 2"
                hint="Optional"
                error={errors.agesUnder18?.message}
                {...register("agesUnder18")}
              />
            </div>
            <OptionGroup
              type="radio"
              legend="Rooms needed"
              description="Optional."
              options={ROOMS_OPTIONS}
              field={register("roomsNeeded")}
              error={errors.roomsNeeded?.message}
            />
            <TextField
              label="How did you hear about us?"
              hint="Optional"
              error={errors.referral?.message}
              {...register("referral")}
            />
          </>
        )}
      </div>

      {/* Honeypot — visually hidden, off the tab order, ignored by real users. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          Company
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </label>
      </div>

      {status === "error" && (
        <p
          role="alert"
          className="mt-6 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          Something went wrong sending your request. Please try again, or email{" "}
          <a
            className="underline underline-offset-2"
            href="mailto:hello@parksportsandparadise.com"
          >
            hello@parksportsandparadise.com
          </a>
          .
        </p>
      )}

      <div className="mt-8 flex items-center justify-between gap-3">
        {stepIndex > 0 ? (
          <Button type="button" variant="ghost" onClick={goBack}>
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
        ) : (
          <span aria-hidden />
        )}

        {isLast ? (
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
              "Submit request"
            )}
          </Button>
        ) : (
          <Button type="button" variant="secondary" size="lg" onClick={goNext}>
            Continue
          </Button>
        )}
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */

function TextField({
  label,
  error,
  hint,
  className,
  ...props
}: React.ComponentProps<"input"> & {
  label: string;
  error?: string;
  hint?: string;
}) {
  const id = props.id ?? props.name;
  const describedBy = error
    ? `${id}-error`
    : hint
      ? `${id}-hint`
      : undefined;

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
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

function OptionGroup({
  legend,
  description,
  type,
  options,
  field,
  error,
  columns = false,
}: {
  legend: string;
  description?: string;
  type: "checkbox" | "radio";
  options: readonly string[];
  field: UseFormRegisterReturn;
  error?: string;
  columns?: boolean;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-medium">{legend}</legend>
      {description ? (
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      ) : null}
      <div
        className={cn(
          "mt-2 grid gap-2",
          columns && "sm:grid-cols-2",
        )}
      >
        {options.map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-start gap-2.5 rounded-md border border-input p-2.5 text-sm transition-colors hover:bg-muted/60 has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring"
          >
            <input
              type={type}
              value={option}
              className="mt-0.5 accent-primary"
              {...field}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-destructive">{error}</p>
      ) : null}
    </fieldset>
  );
}
