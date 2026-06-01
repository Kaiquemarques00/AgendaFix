import { beforeEach, describe, expect, it, vi } from "vitest";

import { resetLookupRateLimitForTests } from "@/lib/utils/lookup-rate-limit";

const mockHeaders = vi.fn();
const mockFrom = vi.fn();
const mockCreateServiceClient = vi.fn();

vi.mock("next/headers", () => ({
  headers: () => mockHeaders(),
}));

vi.mock("@/lib/supabase/service", () => ({
  createServiceClient: () => mockCreateServiceClient(),
}));

import { lookupOrder } from "./public-lookup";

describe("lookupOrder", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetLookupRateLimitForTests();
    mockHeaders.mockResolvedValue({
      get: (name: string) =>
        name === "x-forwarded-for" ? "203.0.113.1" : null,
    });
    mockCreateServiceClient.mockReturnValue({ from: mockFrom });
  });

  it("retorna token quando OS e últimos 4 dígitos coincidem", async () => {
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: [
            {
              public_token: "c0000000-0000-4000-8000-000000000001",
              customer_phone: "11988887766",
            },
          ],
          error: null,
        }),
      }),
    });

    const result = await lookupOrder("OS-2026-0001", "7766");

    expect(result).toEqual({
      success: true,
      data: { token: "c0000000-0000-4000-8000-000000000001" },
    });
  });

  it("retorna erro genérico quando combinação é inválida", async () => {
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: [
            {
              public_token: "c0000000-0000-4000-8000-000000000001",
              customer_phone: "11988887766",
            },
          ],
          error: null,
        }),
      }),
    });

    const result = await lookupOrder("OS-2026-0001", "0000");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe("NOT_FOUND");
      expect(result.error).toContain("Não foi possível localizar");
    }
  });

  it("aplica rate limit após 5 falhas", async () => {
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
    });

    for (let i = 0; i < 5; i++) {
      await lookupOrder("OS-X", "1234");
    }

    const blocked = await lookupOrder("OS-X", "1234");

    expect(blocked).toEqual({
      success: false,
      error: "Muitas tentativas. Aguarde alguns minutos.",
      code: "RATE_LIMITED",
    });
    expect(mockFrom).toHaveBeenCalledTimes(5);
  });
});
