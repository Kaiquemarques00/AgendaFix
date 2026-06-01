import { describe, expect, it, vi, beforeEach } from "vitest";

const mockGetPublicOrderByToken = vi.fn();
const mockCreatePublicServerClient = vi.fn();

vi.mock("@/lib/supabase/public-server", () => ({
  createPublicServerClient: (...args: unknown[]) =>
    mockCreatePublicServerClient(...args),
}));

vi.mock("@/lib/public/order-details", () => ({
  getPublicOrderByToken: (...args: unknown[]) =>
    mockGetPublicOrderByToken(...args),
}));

import { GET, isValidPublicToken } from "./route";

describe("isValidPublicToken", () => {
  it("aceita UUID v4", () => {
    expect(
      isValidPublicToken("c0000000-0000-4000-8000-000000000001")
    ).toBe(true);
  });

  it("rejeita token inválido", () => {
    expect(isValidPublicToken("not-a-token")).toBe(false);
  });
});

describe("GET /api/public/orders/[token]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreatePublicServerClient.mockReturnValue({});
  });

  it("retorna 404 genérico para token inválido", async () => {
    const response = await GET(new Request("http://test"), {
      params: Promise.resolve({ token: "invalid" }),
    });

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: "Ordem não encontrada",
    });
    expect(mockCreatePublicServerClient).not.toHaveBeenCalled();
  });

  it("retorna order + history + notes para token válido", async () => {
    const payload = {
      order: {
        id: "order-1",
        public_token: "c0000000-0000-4000-8000-000000000001",
      },
      history: [],
      notes: [],
    };
    mockGetPublicOrderByToken.mockResolvedValue(payload);

    const token = "c0000000-0000-4000-8000-000000000001";
    const response = await GET(new Request("http://test"), {
      params: Promise.resolve({ token }),
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(payload);
    expect(mockCreatePublicServerClient).toHaveBeenCalledWith(token);
  });

  it("retorna 404 quando ordem não existe", async () => {
    mockGetPublicOrderByToken.mockResolvedValue(null);

    const response = await GET(new Request("http://test"), {
      params: Promise.resolve({
        token: "c0000000-0000-4000-8000-000000000002",
      }),
    });

    expect(response.status).toBe(404);
  });
});
