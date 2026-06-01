import { describe, expect, it, vi } from "vitest";

import { getPublicOrderByToken } from "./order-details";

function createMockSupabase(options: {
  order: Record<string, unknown> | null;
  orderError?: unknown;
  history?: unknown[];
  notes?: unknown[];
}) {
  const historyChain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockResolvedValue({ data: options.history ?? [] }),
  };

  const notesChain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockResolvedValue({ data: options.notes ?? [] }),
  };

  return {
    from: vi.fn((table: string) => {
      if (table === "service_orders") {
        return {
          select: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: options.order,
              error: options.orderError ?? null,
            }),
          }),
        };
      }
      if (table === "status_history") {
        return historyChain;
      }
      if (table === "order_notes") {
        return notesChain;
      }
      throw new Error(`Unexpected table: ${table}`);
    }),
  };
}

describe("getPublicOrderByToken", () => {
  it("retorna ordem sem workshop_id, histórico e notas", async () => {
    const supabase = createMockSupabase({
      order: {
        id: "order-1",
        order_number: "OS-001",
        public_token: "token-1",
        customer_name: "Maria",
        customer_phone: "11999990000",
        device: "Celular",
        brand: "Samsung",
        model: "A54",
        reported_issue: "Tela quebrada",
        status: "received",
        created_at: "2026-06-01T00:00:00Z",
        updated_at: "2026-06-01T00:00:00Z",
      },
      history: [{ id: "h1", service_order_id: "order-1" }],
      notes: [{ id: "n1", service_order_id: "order-1", content: "Ok" }],
    });

    const result = await getPublicOrderByToken(supabase as never);

    expect(result).not.toBeNull();
    expect(result?.order).not.toHaveProperty("workshop_id");
    expect(result?.history).toHaveLength(1);
    expect(result?.notes).toHaveLength(1);
  });

  it("retorna null quando ordem não existe", async () => {
    const supabase = createMockSupabase({ order: null });

    const result = await getPublicOrderByToken(supabase as never);

    expect(result).toBeNull();
  });
});
