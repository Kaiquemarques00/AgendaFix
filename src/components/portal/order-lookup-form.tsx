"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { lookupOrder } from "@/lib/actions/public-lookup";
import { lookupOrderSchema } from "@/lib/validations/public-lookup";

export function buildTrackingRedirectPath(token: string): string {
  return `/acompanhar/${token}`;
}

export function normalizePhoneLast4Input(value: string): string {
  return value.replace(/\D/g, "").slice(0, 4);
}

export function validateLookupFormInput(orderNumber: string, phoneLast4: string) {
  return lookupOrderSchema.safeParse({ orderNumber, phoneLast4 });
}

export function OrderLookupForm() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState("");
  const [phoneLast4, setPhoneLast4] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const normalizedPhone = normalizePhoneLast4Input(phoneLast4);
    const validation = validateLookupFormInput(orderNumber, normalizedPhone);

    if (!validation.success) {
      setError(validation.error.issues[0]?.message ?? "Dados inválidos");
      return;
    }

    setIsSubmitting(true);

    const result = await lookupOrder(
      validation.data.orderNumber,
      validation.data.phoneLast4
    );

    if (!result.success) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    router.push(buildTrackingRedirectPath(result.data.token));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="order-number" className="text-sm font-medium text-[#0F172A]">
          Número da OS
        </label>
        <Input
          id="order-number"
          name="orderNumber"
          type="text"
          autoComplete="off"
          required
          placeholder="Digite o número da sua OS"
          value={orderNumber}
          onChange={(event) => {
            setOrderNumber(event.target.value);
            if (error) {
              setError(null);
            }
          }}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="phone-last4" className="text-sm font-medium text-[#0F172A]">
          Últimos 4 dígitos do telefone
        </label>
        <Input
          id="phone-last4"
          name="phoneLast4"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          required
          maxLength={4}
          placeholder="0000"
          value={phoneLast4}
          onChange={(event) => {
            setPhoneLast4(normalizePhoneLast4Input(event.target.value));
            if (error) {
              setError(null);
            }
          }}
        />
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Buscando…" : "Consultar ordem"}
      </Button>
    </form>
  );
}
