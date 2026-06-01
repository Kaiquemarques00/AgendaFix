import type { ServiceOrderStatus } from "@/types/database";

export const STATUS_LABELS: Record<ServiceOrderStatus, string> = {
  received: "Recebido",
  in_analysis: "Em análise",
  in_repair: "Em reparo",
  waiting_parts: "Aguardando peça",
  ready_pickup: "Pronto para retirada",
  delivered: "Entregue",
};

const ALLOWED_TRANSITIONS: Record<
  ServiceOrderStatus,
  readonly ServiceOrderStatus[]
> = {
  received: ["in_analysis"],
  in_analysis: ["in_repair", "received"],
  in_repair: ["waiting_parts", "ready_pickup", "in_analysis"],
  waiting_parts: ["in_repair"],
  ready_pickup: ["delivered", "in_repair"],
  delivered: ["ready_pickup"],
};

export function canTransition(
  from: ServiceOrderStatus,
  to: ServiceOrderStatus
): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}

export function getAllowedTransitions(
  from: ServiceOrderStatus
): ServiceOrderStatus[] {
  return [...ALLOWED_TRANSITIONS[from]];
}

export function getStatusLabel(
  status: ServiceOrderStatus,
  locale: "pt-BR" = "pt-BR"
): string {
  if (locale !== "pt-BR") {
    return status;
  }
  return STATUS_LABELS[status];
}
