import { decodeJwt } from "jose";
import { afterEach, describe, expect, it } from "vitest";

import { createPublicRealtimeToken } from "./realtime-token";

const TEST_SECRET = "test-jwt-secret-for-realtime-token-tests";

describe("createPublicRealtimeToken", () => {
  afterEach(() => {
    delete process.env.SUPABASE_JWT_SECRET;
  });

  it("embeds public_token and anon role in JWT claims", async () => {
    process.env.SUPABASE_JWT_SECRET = TEST_SECRET;

    const token = await createPublicRealtimeToken(
      "c0000000-0000-4000-8000-000000000001"
    );
    const claims = decodeJwt(token);

    expect(claims.public_token).toBe(
      "c0000000-0000-4000-8000-000000000001"
    );
    expect(claims.role).toBe("anon");
    expect(claims.exp).toBeTypeOf("number");
  });

  it("throws when SUPABASE_JWT_SECRET is missing", async () => {
    await expect(
      createPublicRealtimeToken("c0000000-0000-4000-8000-000000000001")
    ).rejects.toThrow("SUPABASE_JWT_SECRET");
  });
});
