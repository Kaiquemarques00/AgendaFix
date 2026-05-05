export type OrderStatus =
  | 'received'
  | 'diagnosing'
  | 'waiting_approval'
  | 'in_repair'
  | 'ready'
  | 'delivered'
  | 'cancelled'

export type Order = {
  id: string
  business_id: string

  customer_name: string
  customer_phone: string

  device_type: string
  device_model: string

  reported_issue: string
  technical_notes: string | null

  status: OrderStatus
  estimated_delivery_date: string | null

  public_token: string

  created_at: string
  updated_at: string
}

export type CreateOrderInput = Pick<
  Order,
  | 'business_id'
  | 'customer_name'
  | 'customer_phone'
  | 'device_type'
  | 'device_model'
  | 'reported_issue'
  | 'technical_notes'
  | 'estimated_delivery_date'
>

export type UpdateOrderStatusInput = Pick<Order, 'id' | 'status'>

export type PublicOrderStatusView = Pick<
  Order,
  'device_type' | 'device_model' | 'status' | 'estimated_delivery_date'
>
