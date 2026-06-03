import { describe, expect, it } from "vitest";

import { buildPublicOrderUrl } from "./copy-link-button";

describe("buildPublicOrderUrl", () => {
  it("builds full public tracking URL", () => {
    expect(
      buildPublicOrderUrl(
        "c0000000-0000-4000-8000-000000000001",
        "http://localhost:3000"
      )
    ).toBe(
      "http://localhost:3000/acompanhar/c0000000-0000-4000-8000-000000000001"
    );
  });

  it("removes trailing slash from origin", () => {
    expect(
      buildPublicOrderUrl("token-123", "https://agendafix.dev/")
    ).toBe("https://agendafix.dev/acompanhar/token-123");
  });
});
