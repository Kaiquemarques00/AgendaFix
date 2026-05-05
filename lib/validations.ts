import { z } from 'zod'

export const orderStatusSchema = z.enum([
  'received',
  'diagnosing',
  'waiting_approval',
  'in_repair',
  'ready',
  'delivered',
  'cancelled',
])

const trimmedString = z.string().trim().min(1)

export const createOrderSchema = z.object({
  business_id: trimmedString,
  customer_name: trimmedString,
  customer_phone: trimmedString,
  device_type: trimmedString,
  device_model: trimmedString,
  reported_issue: trimmedString,
  technical_notes: z.string().trim().min(1).nullable().optional(),
  estimated_delivery_date: z.string().trim().min(1).nullable().optional(),
})

export const updateOrderStatusSchema = z.object({
  id: trimmedString,
  status: orderStatusSchema,
})

export const publicTokenSchema = trimmedString

export type OrderStatusInput = z.infer<typeof orderStatusSchema>
export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>
