"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createOrder } from "@/lib/actions/orders";
import {
  createOrderSchema,
  type CreateOrderInput,
} from "@/lib/validations/orders";

export type OrderFormValues = CreateOrderInput;

export const emptyOrderFormValues: OrderFormValues = {
  order_number: "",
  customer_name: "",
  customer_phone: "",
  device: "",
  brand: "",
  model: "",
  reported_issue: "",
};

export function getOrderFormFieldErrors(
  input: unknown
): Partial<Record<keyof OrderFormValues, string>> {
  const result = createOrderSchema.safeParse(input);
  if (result.success) {
    return {};
  }

  const errors: Partial<Record<keyof OrderFormValues, string>> = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !errors[key as keyof OrderFormValues]) {
      errors[key as keyof OrderFormValues] = issue.message;
    }
  }
  return errors;
}

const fieldClassName =
  "flex w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function OrderForm() {
  const router = useRouter();
  const [values, setValues] = useState<OrderFormValues>(emptyOrderFormValues);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof OrderFormValues, string>>
  >({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<K extends keyof OrderFormValues>(
    key: K,
    value: OrderFormValues[K]
  ) {
    setValues((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => {
      if (!current[key]) {
        return current;
      }
      const next = { ...current };
      delete next[key];
      return next;
    });
    if (submitError) {
      setSubmitError(null);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    const errors = getOrderFormFieldErrors(values);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    const result = await createOrder(values);

    if (!result.success) {
      if (result.code === "DUPLICATE_ORDER_NUMBER") {
        setFieldErrors((current) => ({
          ...current,
          order_number: result.error,
        }));
      } else {
        setSubmitError(result.error);
      }
      setIsSubmitting(false);
      return;
    }

    router.push(`/dashboard/ordens/${result.data.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <FormSection title="Dados do Cliente">
        <Field
          id="customer_name"
          label="Nome"
          value={values.customer_name}
          error={fieldErrors.customer_name}
          onChange={(value) => updateField("customer_name", value)}
        />
        <Field
          id="customer_phone"
          label="Telefone"
          value={values.customer_phone}
          error={fieldErrors.customer_phone}
          onChange={(value) => updateField("customer_phone", value)}
          placeholder="(11) 99999-9999"
        />
      </FormSection>

      <FormSection title="Dados do Equipamento">
        <Field
          id="device"
          label="Tipo de equipamento"
          value={values.device}
          error={fieldErrors.device}
          onChange={(value) => updateField("device", value)}
          placeholder="Celular, notebook, etc."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="brand"
            label="Marca"
            value={values.brand}
            error={fieldErrors.brand}
            onChange={(value) => updateField("brand", value)}
          />
          <Field
            id="model"
            label="Modelo"
            value={values.model}
            error={fieldErrors.model}
            onChange={(value) => updateField("model", value)}
          />
        </div>
        <TextAreaField
          id="reported_issue"
          label="Defeito relatado"
          value={values.reported_issue}
          error={fieldErrors.reported_issue}
          onChange={(value) => updateField("reported_issue", value)}
        />
      </FormSection>

      <FormSection title="Informações da OS">
        <Field
          id="order_number"
          label="Número da OS"
          value={values.order_number}
          error={fieldErrors.order_number}
          onChange={(value) => updateField("order_number", value)}
          placeholder="OS-2026-0001"
        />
      </FormSection>

      {submitError ? (
        <p className="text-sm text-destructive" role="alert">
          {submitError}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          href="/dashboard"
          className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-background px-2.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          Cancelar
        </Link>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando…" : "Salvar OS"}
        </Button>
      </div>
    </form>
  );
}

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <h2 className="mb-4 text-lg font-semibold text-[#0F172A]">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({
  id,
  label,
  value,
  error,
  onChange,
  placeholder,
}: {
  id: keyof OrderFormValues;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-[#0F172A]">
        {label}
      </label>
      <Input
        id={id}
        name={id}
        value={value}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function TextAreaField({
  id,
  label,
  value,
  error,
  onChange,
}: {
  id: keyof OrderFormValues;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-[#0F172A]">
        {label}
      </label>
      <textarea
        id={id}
        name={id}
        rows={4}
        value={value}
        aria-invalid={error ? true : undefined}
        className={fieldClassName}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
