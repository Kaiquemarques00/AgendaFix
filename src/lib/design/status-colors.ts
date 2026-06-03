import type { ServiceOrderStatus } from "@/types/database";

export const STATUS_COLORS: Record<
  ServiceOrderStatus,
  { bg: string; text: string }
> = {
  received: { bg: "#F1F5F9", text: "#475569" },
  in_analysis: { bg: "#E0F2FE", text: "#0369A1" },
  in_repair: { bg: "#DBEAFE", text: "#1D4ED8" },
  waiting_parts: { bg: "#FEF3C7", text: "#B45309" },
  ready_pickup: { bg: "#DCFCE7", text: "#15803D" },
  delivered: { bg: "#DCFCE7", text: "#15803D" },
};
