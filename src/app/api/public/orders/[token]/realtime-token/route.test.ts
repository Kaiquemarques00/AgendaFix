import { beforeEach, describe, expect, it, vi } from "vitest";

const mockCreatePublicRealtimeToken = vi.fn();

vi.mock("@/lib/public/realtime-token", () => ({
  createPublicRealtimeToken: (...args: unknown[]) =>
    mockCreatePublicRealtimeToken(...args),
}));

import { GET } from "./route";

describe("GET /api/public/orders/[token]/realtime-token", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreatePublicRealtimeToken.mockResolvedValue("signed-jwt");
  });

  it("retorna 404 para token inválido", async () => {
    const response = await GET(new Request("http://test"), {
      params: Promise.resolve({ token: "invalid" }),
    });

    expect(response.status).toBe(404);
    expect(mockCreatePublicRealtimeToken).not.toHaveBeenCalled();
  });

  it("retorna accessToken para token válido", async () => {
    const token = "c0000000-0000-4000-8000-000000000001";
    const response = await GET(new Request("http://test"), {
      params: Promise.resolve({ token }),
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      accessToken: "signed-jwt",
    });
    expect(mockCreatePublicRealtimeToken).toHaveBeenCalledWith(token);
  });
});
