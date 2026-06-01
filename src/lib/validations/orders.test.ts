import { describe, expect, it } from "vitest";

import {
  addNoteSchema,
  createOrderSchema,
  updateStatusSchema,
} from "./orders";

const validCreateOrder = {
  order_number: "OS-001",
  customer_name: "Maria Silva",
  customer_phone: "11999887766",
  device: "Celular",
  brand: "Samsung",
  model: "Galaxy A54",
  reported_issue: "Tela não liga após queda",
};

describe("createOrderSchema", () => {
  it("aceita payload válido", () => {
    const result = createOrderSchema.safeParse(validCreateOrder);
    expect(result.success).toBe(true);
  });

  it("rejeita campos obrigatórios vazios com mensagens em português", () => {
    const result = createOrderSchema.safeParse({
      order_number: "",
      customer_name: "A",
      customer_phone: "123",
      device: "A",
      brand: "",
      model: "",
      reported_issue: "abc",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues
        .map((i) => i.message)
        .join(" ")
        .toLowerCase();
      expect(messages).toContain("número da os");
      expect(messages).toContain("cliente");
      expect(messages).toContain("telefone");
      expect(messages).toContain("equipamento");
      expect(messages).toContain("marca");
      expect(messages).toContain("modelo");
      expect(messages).toContain("defeito");
    }
  });

  it("rejeita reported_issue com menos de 5 caracteres", () => {
    const result = createOrderSchema.safeParse({
      ...validCreateOrder,
      reported_issue: "abc",
    });
    expect(result.success).toBe(false);
  });
});

describe("updateStatusSchema", () => {
  it("aceita orderId UUID e status válido", () => {
    const result = updateStatusSchema.safeParse({
      orderId: "b0000000-0000-4000-8000-000000000001",
      newStatus: "in_analysis",
    });
    expect(result.success).toBe(true);
  });

  it("rejeita orderId inválido", () => {
    const result = updateStatusSchema.safeParse({
      orderId: "not-a-uuid",
      newStatus: "in_analysis",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain("ordem");
    }
  });

  it("rejeita status desconhecido", () => {
    const result = updateStatusSchema.safeParse({
      orderId: "b0000000-0000-4000-8000-000000000001",
      newStatus: "invalid_status",
    });
    expect(result.success).toBe(false);
  });
});

describe("addNoteSchema", () => {
  it("aceita conteúdo válido", () => {
    const result = addNoteSchema.safeParse({ content: "Aguardando peça." });
    expect(result.success).toBe(true);
  });

  it("rejeita conteúdo vazio", () => {
    const result = addNoteSchema.safeParse({ content: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain("observação");
    }
  });

  it("rejeita conteúdo acima de 500 caracteres", () => {
    const result = addNoteSchema.safeParse({ content: "x".repeat(501) });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain("500");
    }
  });
});
