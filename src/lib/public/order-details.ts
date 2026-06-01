import type { SupabaseClient } from "@supabase/supabase-js";

import type { OrderWithDetails, PublicServiceOrder } from "@/types/public-order";

const PUBLIC_ORDER_COLUMNS =
  "id, order_number, public_token, customer_name, customer_phone, device, brand, model, reported_issue, status, created_at, updated_at";

export async function fetchPublicOrderDetails(
  supabase: SupabaseClient,
  serviceOrderId: string
): Promise<Pick<OrderWithDetails, "history" | "notes">> {
  const [historyResult, notesResult] = await Promise.all([
    supabase
      .from("status_history")
      .select("*")
      .eq("service_order_id", serviceOrderId)
      .order("created_at", { ascending: true }),
    supabase
      .from("order_notes")
      .select("*")
      .eq("service_order_id", serviceOrderId)
      .order("created_at", { ascending: true }),
  ]);

  return {
    history: historyResult.data ?? [],
    notes: notesResult.data ?? [],
  };
}

export async function getPublicOrderByToken(
  supabase: SupabaseClient
): Promise<OrderWithDetails | null> {
  const { data: order, error } = await supabase
    .from("service_orders")
    .select(PUBLIC_ORDER_COLUMNS)
    .maybeSingle();

  if (error || !order) {
    return null;
  }

  const { history, notes } = await fetchPublicOrderDetails(supabase, order.id);

  return {
    order: order as PublicServiceOrder,
    history,
    notes,
  };
}
