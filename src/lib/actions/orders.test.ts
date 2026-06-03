import { beforeEach, describe, expect, it, vi } from "vitest";

import type { OrderNote, ServiceOrder } from "@/types/database";

const mockGetUser = vi.fn();
const mockFrom = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser: mockGetUser },
    from: mockFrom,
  })),
}));

import {
  addOrderNote,
  createOrder,
  updateOrderStatus,
} from "./orders";

const WORKSHOP_ID = "a0000000-0000-4000-8000-000000000001";
const USER_ID = "f0000000-0000-4000-8000-000000000001";
const ORDER_ID = "b0000000-0000-4000-8000-000000000099";

const validCreateInput = {
  order_number: "OS-2026-0099",
  customer_name: "Maria Silva",
  customer_phone: "(11) 99988-7766",
  device: "Celular",
  brand: "Samsung",
  model: "Galaxy A54",
  reported_issue: "Tela não liga após queda",
};

const sampleOrder: ServiceOrder = {
  id: ORDER_ID,
  workshop_id: WORKSHOP_ID,
  order_number: validCreateInput.order_number,
  public_token: "c0000000-0000-4000-8000-0000000099",
  customer_name: validCreateInput.customer_name,
  customer_phone: "11999887766",
  device: validCreateInput.device,
  brand: validCreateInput.brand,
  model: validCreateInput.model,
  reported_issue: validCreateInput.reported_issue,
  status: "received",
  created_at: "2026-06-01T12:00:00.000Z",
  updated_at: "2026-06-01T12:00:00.000Z",
};

function mockAuthUser() {
  mockGetUser.mockResolvedValue({
    data: { user: { id: USER_ID } },
    error: null,
  });
}

function mockNoAuth() {
  mockGetUser.mockResolvedValue({
    data: { user: null },
    error: { message: "not authenticated" },
  });
}

function mockWorkshopMembership() {
  const membershipResult = {
    data: { workshop_id: WORKSHOP_ID },
    error: null,
  };
  return {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(membershipResult),
    maybeSingle: vi.fn().mockResolvedValue(membershipResult),
  };
}

function mockFromHandlers(
  handlers: Record<string, () => Record<string, unknown>>
) {
  mockFrom.mockImplementation((table: string) => {
    const handler = handlers[table];
    if (!handler) {
      throw new Error(`Unexpected table: ${table}`);
    }
    return handler();
  });
}

describe("createOrder", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("cria ordem com status received, telefone normalizado e histórico inicial", async () => {
    mockAuthUser();

    const historyInsert = vi.fn().mockResolvedValue({ error: null });
    const ordersInsert = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: sampleOrder,
          error: null,
        }),
      }),
    });

    mockFromHandlers({
      workshop_users: mockWorkshopMembership,
      service_orders: () => ({ insert: ordersInsert }),
      status_history: () => ({ insert: historyInsert }),
    });

    const result = await createOrder(validCreateInput);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe("received");
      expect(result.data.public_token).toBeTruthy();
      expect(result.data.customer_phone).toBe("11999887766");
    }

    expect(ordersInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        workshop_id: WORKSHOP_ID,
        status: "received",
        customer_phone: "11999887766",
      })
    );

    expect(historyInsert).toHaveBeenCalledWith({
      service_order_id: ORDER_ID,
      from_status: null,
      to_status: "received",
      changed_by: USER_ID,
    });
  });

  it("rejeita número de OS duplicado", async () => {
    mockAuthUser();

    mockFromHandlers({
      workshop_users: mockWorkshopMembership,
      service_orders: () => ({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { code: "23505", message: "duplicate" },
            }),
          }),
        }),
      }),
    });

    const result = await createOrder(validCreateInput);

    expect(result).toEqual({
      success: false,
      error: "Número da OS já existe",
      code: "DUPLICATE_ORDER_NUMBER",
    });
  });

  it("usa workshop_id da sessão (RLS via membership)", async () => {
    mockAuthUser();

    const ordersInsert = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: sampleOrder,
          error: null,
        }),
      }),
    });

    mockFromHandlers({
      workshop_users: mockWorkshopMembership,
      service_orders: () => ({ insert: ordersInsert }),
      status_history: () => ({
        insert: vi.fn().mockResolvedValue({ error: null }),
      }),
    });

    await createOrder(validCreateInput);

    expect(ordersInsert).toHaveBeenCalledWith(
      expect.objectContaining({ workshop_id: WORKSHOP_ID })
    );
  });

  it("retorna erro quando não autenticado", async () => {
    mockNoAuth();

    const result = await createOrder(validCreateInput);

    expect(result).toEqual({
      success: false,
      error: "Não autenticado",
      code: "UNAUTHORIZED",
    });
    expect(mockFrom).not.toHaveBeenCalled();
  });
});

describe("updateOrderStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("atualiza status em transição válida", async () => {
    mockAuthUser();

    const update = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { ...sampleOrder, status: "in_analysis" },
            error: null,
          }),
        }),
      }),
    });

    mockFromHandlers({
      workshop_users: mockWorkshopMembership,
      service_orders: () => ({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: sampleOrder,
              error: null,
            }),
          }),
        }),
        update,
      }),
    });

    const result = await updateOrderStatus(ORDER_ID, "in_analysis");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe("in_analysis");
    }
    expect(update).toHaveBeenCalledWith({ status: "in_analysis" });
  });

  it("bloqueia transição inválida com mensagem clara", async () => {
    mockAuthUser();

    mockFromHandlers({
      workshop_users: mockWorkshopMembership,
      service_orders: () => ({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: sampleOrder,
              error: null,
            }),
          }),
        }),
        update: vi.fn(),
      }),
    });

    const result = await updateOrderStatus(ORDER_ID, "delivered");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe("INVALID_TRANSITION");
      expect(result.error).toContain("Recebido");
      expect(result.error).toContain("Entregue");
      expect(result.error).toContain("Em análise");
    }
  });
});

describe("addOrderNote", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("persiste nota com created_by da sessão", async () => {
    mockAuthUser();

    const note: OrderNote = {
      id: "e0000000-0000-4000-8000-000000000099",
      service_order_id: ORDER_ID,
      content: "Aguardando peça.",
      created_by: USER_ID,
      created_at: "2026-06-01T12:00:00.000Z",
    };

    const notesInsert = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: note, error: null }),
      }),
    });

    mockFromHandlers({
      workshop_users: mockWorkshopMembership,
      service_orders: () => ({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: ORDER_ID },
              error: null,
            }),
          }),
        }),
      }),
      order_notes: () => ({ insert: notesInsert }),
    });

    const result = await addOrderNote(ORDER_ID, "Aguardando peça.");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.content).toBe("Aguardando peça.");
      expect(result.data.created_by).toBe(USER_ID);
      expect(result.data.created_at).toBeTruthy();
    }

    expect(notesInsert).toHaveBeenCalledWith({
      service_order_id: ORDER_ID,
      content: "Aguardando peça.",
      created_by: USER_ID,
    });
  });

  it("rejeita observação acima de 500 caracteres", async () => {
    mockAuthUser();

    const result = await addOrderNote(ORDER_ID, "x".repeat(501));

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe("VALIDATION_ERROR");
      expect(result.error).toContain("500");
    }
    expect(mockFrom).not.toHaveBeenCalled();
  });
});
