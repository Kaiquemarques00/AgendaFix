"use server";

import { headers } from "next/headers";

import type { ActionResult } from "@/lib/actions/types";
import { createServiceClient } from "@/lib/supabase/service";
import {
  clearLookupAttempts,
  isLookupRateLimited,
  recordLookupFailure,
} from "@/lib/utils/lookup-rate-limit";
import { phoneEndsWith } from "@/lib/utils/phone";
import { lookupOrderSchema } from "@/lib/validations/public-lookup";

const GENERIC_LOOKUP_ERROR =
  "Não foi possível localizar a ordem. Verifique os dados informados.";

async function getLookupClientKey(): Promise<string> {
  const headerStore = await headers();
  const forwarded = headerStore.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || headerStore.get("x-real-ip");
  return ip?.trim() || "unknown";
}

export async function lookupOrder(
  orderNumber: string,
  phoneLast4: string
): Promise<ActionResult<{ token: string }>> {
  const clientKey = await getLookupClientKey();

  if (isLookupRateLimited(clientKey)) {
    return {
      success: false,
      error: "Muitas tentativas. Aguarde alguns minutos.",
      code: "RATE_LIMITED",
    };
  }

  const parsed = lookupOrderSchema.safeParse({ orderNumber, phoneLast4 });
  if (!parsed.success) {
    recordLookupFailure(clientKey);
    return {
      success: false,
      error: GENERIC_LOOKUP_ERROR,
      code: "NOT_FOUND",
    };
  }

  try {
    const supabase = createServiceClient();
    const { data: candidates, error } = await supabase
      .from("service_orders")
      .select("public_token, customer_phone")
      .eq("order_number", parsed.data.orderNumber.trim());

    if (error) {
      recordLookupFailure(clientKey);
      return {
        success: false,
        error: GENERIC_LOOKUP_ERROR,
        code: "NOT_FOUND",
      };
    }

    const matches = (candidates ?? []).filter((row) =>
      phoneEndsWith(row.customer_phone, parsed.data.phoneLast4)
    );

    if (matches.length !== 1) {
      recordLookupFailure(clientKey);
      return {
        success: false,
        error: GENERIC_LOOKUP_ERROR,
        code: "NOT_FOUND",
      };
    }

    clearLookupAttempts(clientKey);
    return {
      success: true,
      data: { token: matches[0].public_token as string },
    };
  } catch {
    recordLookupFailure(clientKey);
    return {
      success: false,
      error: GENERIC_LOOKUP_ERROR,
      code: "NOT_FOUND",
    };
  }
}
