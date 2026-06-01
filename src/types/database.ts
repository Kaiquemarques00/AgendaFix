export type ServiceOrderStatus =
  | "received"
  | "in_analysis"
  | "in_repair"
  | "waiting_parts"
  | "ready_pickup"
  | "delivered";

export type ServiceOrder = {
  id: string;
  workshop_id: string;
  order_number: string;
  public_token: string;
  customer_name: string;
  customer_phone: string;
  device: string;
  brand: string;
  model: string;
  reported_issue: string;
  status: ServiceOrderStatus;
  created_at: string;
  updated_at: string;
};

export type StatusHistory = {
  id: string;
  service_order_id: string;
  from_status: ServiceOrderStatus | null;
  to_status: ServiceOrderStatus;
  changed_by: string | null;
  created_at: string;
};

export type OrderNote = {
  id: string;
  service_order_id: string;
  content: string;
  created_by: string | null;
  created_at: string;
};

export type OrderSubscriptionData = {
  order: ServiceOrder;
  history: StatusHistory[];
  notes: OrderNote[];
};
