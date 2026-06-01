import { z } from "zod";

export const lookupOrderSchema = z.object({
  orderNumber: z
    .string()
    .min(1, "Informe o número da OS")
    .max(20, "Número da OS inválido"),
  phoneLast4: z
    .string()
    .regex(/^\d{4}$/, "Informe os 4 últimos dígitos do telefone"),
});

export type LookupOrderInput = z.infer<typeof lookupOrderSchema>;
