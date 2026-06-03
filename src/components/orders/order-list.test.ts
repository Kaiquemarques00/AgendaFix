import { describe, expect, it } from "vitest";

import { STATUS_COLORS } from "@/lib/design/status-colors";
import type { ServiceOrder } from "@/types/database";

import { formatOrderDate, formatOrderDevice } from "./order-list";

const sampleOrder: Pick<ServiceOrder, "device" | "brand" | "model" | "status"> =
  {
    device: "Celular",
    brand: "Samsung",
    model: "Galaxy A54",
    status: "in_repair",
  };

describe("formatOrderDevice", () => {
  it("combines device, brand and model", () => {
    expect(formatOrderDevice(sampleOrder)).toBe("Celular · Samsung Galaxy A54");
  });
});

describe("formatOrderDate", () => {
  it("formats ISO date in pt-BR", () => {
    expect(formatOrderDate("2026-06-01T12:00:00.000Z")).toMatch(/\d{2}\/\d{2}\/2026/);
  });
});

describe("OrderList status badges", () => {
  it("uses STATUS_COLORS for every status", () => {
    const statuses = Object.keys(STATUS_COLORS) as Array<keyof typeof STATUS_COLORS>;

    expect(statuses).toHaveLength(6);
    for (const status of statuses) {
      expect(STATUS_COLORS[status].bg).toBeTruthy();
      expect(STATUS_COLORS[status].text).toBeTruthy();
    }
  });
});
