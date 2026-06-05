import { describe, expect, it } from "vitest";

import {
  buildTrackingRedirectPath,
  normalizePhoneLast4Input,
  validateLookupFormInput,
} from "./order-lookup-form";

describe("buildTrackingRedirectPath", () => {
  it("builds redirect path for tracking page", () => {
    expect(
      buildTrackingRedirectPath("c0000000-0000-4000-8000-000000000001")
    ).toBe("/acompanhar/c0000000-0000-4000-8000-000000000001");
  });
});

describe("normalizePhoneLast4Input", () => {
  it("keeps only digits and limits to 4 characters", () => {
    expect(normalizePhoneLast4Input("12ab34")).toBe("1234");
    expect(normalizePhoneLast4Input("123456789")).toBe("1234");
  });

  it("accepts partial input", () => {
    expect(normalizePhoneLast4Input("77")).toBe("77");
  });
});

describe("validateLookupFormInput", () => {
  it("accepts valid order number and phone last4", () => {
    const result = validateLookupFormInput("OS-2026-0042", "7766");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        orderNumber: "OS-2026-0042",
        phoneLast4: "7766",
      });
    }
  });

  it("rejects empty order number", () => {
    const result = validateLookupFormInput("", "7766");

    expect(result.success).toBe(false);
  });

  it("rejects phone last4 with fewer than 4 digits", () => {
    const result = validateLookupFormInput("OS-2026-0042", "776");

    expect(result.success).toBe(false);
  });
});
