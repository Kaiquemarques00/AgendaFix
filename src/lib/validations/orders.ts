import { z } from "zod";

import type { ServiceOrderStatus } from "@/types/database";

const serviceOrderStatusSchema = z.enum(
  [
    "received",
    "in_analysis",
    "in_repair",
    "waiting_parts",
    "ready_pickup",
    "delivered",
  ],
  { message: "Status inválido" }
);

export const createOrderSchema = z.object({
  order_number: z
    .string()
    .min(1, "Informe o número da OS")
    .max(20, "Número da OS deve ter no máximo 20 caracteres"),
  customer_name: z
    .string()
    .min(2, "Nome do cliente deve ter pelo menos 2 caracteres")
    .max(100, "Nome do cliente deve ter no máximo 100 caracteres"),
  customer_phone: z
    .string()
    .min(10, "Telefone deve ter pelo menos 10 dígitos")
    .max(15, "Telefone deve ter no máximo 15 caracteres"),
  device: z
    .string()
    .min(2, "Equipamento deve ter pelo menos 2 caracteres")
    .max(50, "Equipamento deve ter no máximo 50 caracteres"),
  brand: z
    .string()
    .min(1, "Informe a marca")
    .max(50, "Marca deve ter no máximo 50 caracteres"),
  model: z
    .string()
    .min(1, "Informe o modelo")
    .max(50, "Modelo deve ter no máximo 50 caracteres"),
  reported_issue: z
    .string()
    .min(5, "Descreva o defeito com pelo menos 5 caracteres")
    .max(500, "Defeito relatado deve ter no máximo 500 caracteres"),
});

export const updateStatusSchema = z.object({
  orderId: z.string().uuid("ID da ordem inválido"),
  newStatus: serviceOrderStatusSchema,
});

export const addNoteSchema = z.object({
  content: z
    .string()
    .min(1, "Informe a observação")
    .max(500, "Máximo de 500 caracteres por observação"),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
export type AddNoteInput = z.infer<typeof addNoteSchema>;

export { serviceOrderStatusSchema };

export function parseServiceOrderStatus(
  value: string
): ServiceOrderStatus | null {
  const result = serviceOrderStatusSchema.safeParse(value);
  return result.success ? result.data : null;
}
