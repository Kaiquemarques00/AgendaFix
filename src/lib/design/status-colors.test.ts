import { describe, expect, it } from "vitest";

import { STATUS_COLORS } from "./status-colors";

const ALL_STATUSES = [
  "received",
  "in_analysis",
  "in_repair",
  "waiting_parts",
  "ready_pickup",
  "delivered",
] as const;

describe("STATUS_COLORS", () => {
  it("defines colors for every service order status", () => {
    for (const status of ALL_STATUSES) {
      expect(STATUS_COLORS[status]).toEqual(
        expect.objectContaining({
          bg: expect.stringMatching(/^#[0-9A-F]{6}$/i),
          text: expect.stringMatching(/^#[0-9A-F]{6}$/i),
        })
      );
    }
  });
});
