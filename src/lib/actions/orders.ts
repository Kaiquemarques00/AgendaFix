"use server";

import {
  canTransition,
  getAllowedTransitions,
  getStatusLabel,
} from "@/lib/domain/status-machine";
import { createClient } from "@/lib/supabase/server";
import type { OrderNote, ServiceOrder, ServiceOrderStatus, StatusHistory } from "@/types/database";
import {
  addNoteSchema,
  createOrderSchema,
  updateStatusSchema,
} from "@/lib/validations/orders";

import { normalizePhone } from "@/lib/utils/phone";

import type { ActionResult } from "./types";

export type OrderFilters = {
  status?: ServiceOrderStatus;
  page?: number;
  pageSize?: number;
};

export type OrdersResult = {
  orders: ServiceOrder[];
  total: number;
  needsWorkshopSetup?: boolean;
};

export type OrderDetailResult = {
  order: ServiceOrder;
  history: StatusHistory[];
  notes: OrderNote[];
};

async function getAuthenticatedContext(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return null;
  }

  const { data: membership, error: membershipError } = await supabase
    .from("workshop_users")
    .select("workshop_id")
    .eq("id", user.id)
    .maybeSingle();

  if (membershipError || !membership?.workshop_id) {
    return null;
  }

  return { user, workshopId: membership.workshop_id as string };
}

export async function createOrder(
  input: unknown
): Promise<ActionResult<ServiceOrder>> {
  const parsed = createOrderSchema.safeParse(input);
  if (!parsed.success) {
    const message =
      parsed.error.issues[0]?.message ?? "Dados da ordem inválidos";
    return { success: false, error: message, code: "VALIDATION_ERROR" };
  }

  const supabase = await createClient();
  const auth = await getAuthenticatedContext(supabase);
  if (!auth) {
    return { success: false, error: "Não autenticado", code: "UNAUTHORIZED" };
  }

  const { data: order, error: orderError } = await supabase
    .from("service_orders")
    .insert({
      workshop_id: auth.workshopId,
      order_number: parsed.data.order_number.trim(),
      customer_name: parsed.data.customer_name.trim(),
      customer_phone: normalizePhone(parsed.data.customer_phone),
      device: parsed.data.device.trim(),
      brand: parsed.data.brand.trim(),
      model: parsed.data.model.trim(),
      reported_issue: parsed.data.reported_issue.trim(),
      status: "received",
    })
    .select()
    .single();

  if (orderError) {
    if (orderError.code === "23505") {
      return {
        success: false,
        error: "Número da OS já existe",
        code: "DUPLICATE_ORDER_NUMBER",
      };
    }
    return {
      success: false,
      error: "Não foi possível criar a ordem",
      code: "DB_ERROR",
    };
  }

  const { error: historyError } = await supabase.from("status_history").insert({
    service_order_id: order.id,
    from_status: null,
    to_status: "received",
    changed_by: auth.user.id,
  });

  if (historyError) {
    await supabase.from("service_orders").delete().eq("id", order.id);
    return {
      success: false,
      error: "Não foi possível registrar o histórico inicial",
      code: "DB_ERROR",
    };
  }

  return { success: true, data: order as ServiceOrder };
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: ServiceOrderStatus
): Promise<ActionResult<ServiceOrder>> {
  const parsed = updateStatusSchema.safeParse({ orderId, newStatus });
  if (!parsed.success) {
    const message =
      parsed.error.issues[0]?.message ?? "Dados de status inválidos";
    return { success: false, error: message, code: "VALIDATION_ERROR" };
  }

  const supabase = await createClient();
  const auth = await getAuthenticatedContext(supabase);
  if (!auth) {
    return { success: false, error: "Não autenticado", code: "UNAUTHORIZED" };
  }

  const { data: current, error: fetchError } = await supabase
    .from("service_orders")
    .select("*")
    .eq("id", parsed.data.orderId)
    .single();

  if (fetchError || !current) {
    return {
      success: false,
      error: "Ordem não encontrada",
      code: "NOT_FOUND",
    };
  }

  const currentStatus = current.status as ServiceOrderStatus;

  if (!canTransition(currentStatus, parsed.data.newStatus)) {
    const fromLabel = getStatusLabel(currentStatus);
    const toLabel = getStatusLabel(parsed.data.newStatus);
    const allowed = getAllowedTransitions(currentStatus)
      .map((status) => getStatusLabel(status))
      .join(", ");
    return {
      success: false,
      error: `Não é possível alterar de ${fromLabel} para ${toLabel}. Transições permitidas: ${allowed}.`,
      code: "INVALID_TRANSITION",
    };
  }

  const { data: updated, error: updateError } = await supabase
    .from("service_orders")
    .update({ status: parsed.data.newStatus })
    .eq("id", parsed.data.orderId)
    .select()
    .single();

  if (updateError || !updated) {
    return {
      success: false,
      error: "Não foi possível atualizar o status",
      code: "DB_ERROR",
    };
  }

  return { success: true, data: updated as ServiceOrder };
}

export async function addOrderNote(
  orderId: string,
  content: string
): Promise<ActionResult<OrderNote>> {
  const parsed = addNoteSchema.safeParse({ content });
  if (!parsed.success) {
    const message =
      parsed.error.issues[0]?.message ?? "Observação inválida";
    return { success: false, error: message, code: "VALIDATION_ERROR" };
  }

  const supabase = await createClient();
  const auth = await getAuthenticatedContext(supabase);
  if (!auth) {
    return { success: false, error: "Não autenticado", code: "UNAUTHORIZED" };
  }

  const { data: order, error: orderError } = await supabase
    .from("service_orders")
    .select("id")
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    return {
      success: false,
      error: "Ordem não encontrada",
      code: "NOT_FOUND",
    };
  }

  const { data: note, error: noteError } = await supabase
    .from("order_notes")
    .insert({
      service_order_id: orderId,
      content: parsed.data.content.trim(),
      created_by: auth.user.id,
    })
    .select()
    .single();

  if (noteError || !note) {
    return {
      success: false,
      error: "Não foi possível adicionar a observação",
      code: "DB_ERROR",
    };
  }

  return { success: true, data: note as OrderNote };
}

export async function getOrders(
  filters?: OrderFilters
): Promise<OrdersResult | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: membership, error: membershipError } = await supabase
    .from("workshop_users")
    .select("workshop_id")
    .eq("id", user.id)
    .maybeSingle();

  if (membershipError || !membership?.workshop_id) {
    return { orders: [], total: 0, needsWorkshopSetup: true };
  }

  const page = Math.max(1, filters?.page ?? 1);
  const pageSize = filters?.pageSize ?? 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("service_orders")
    .select("*", { count: "exact" })
    .eq("workshop_id", membership.workshop_id)
    .order("updated_at", { ascending: false })
    .range(from, to);

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  const { data, count, error } = await query;

  if (error) {
    return { orders: [], total: 0 };
  }

  return {
    orders: (data ?? []) as ServiceOrder[],
    total: count ?? 0,
  };
}

export async function getOrderById(
  orderId: string
): Promise<OrderDetailResult | null> {
  const supabase = await createClient();
  const auth = await getAuthenticatedContext(supabase);
  if (!auth) {
    return null;
  }

  const { data: order, error: orderError } = await supabase
    .from("service_orders")
    .select("*")
    .eq("id", orderId)
    .eq("workshop_id", auth.workshopId)
    .maybeSingle();

  if (orderError || !order) {
    return null;
  }

  const { data: history, error: historyError } = await supabase
    .from("status_history")
    .select("*")
    .eq("service_order_id", orderId)
    .order("created_at", { ascending: true });

  if (historyError) {
    return null;
  }

  const { data: notes, error: notesError } = await supabase
    .from("order_notes")
    .select("*")
    .eq("service_order_id", orderId)
    .order("created_at", { ascending: true });

  if (notesError) {
    return null;
  }

  return {
    order: order as ServiceOrder,
    history: (history ?? []) as StatusHistory[],
    notes: (notes ?? []) as OrderNote[],
  };
}
