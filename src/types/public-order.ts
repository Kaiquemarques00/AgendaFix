import type {
  OrderNote,
  ServiceOrder,
  StatusHistory,
} from "@/types/database";

export type PublicServiceOrder = Omit<ServiceOrder, "workshop_id">;

export type OrderWithDetails = {
  order: PublicServiceOrder;
  history: StatusHistory[];
  notes: OrderNote[];
};
