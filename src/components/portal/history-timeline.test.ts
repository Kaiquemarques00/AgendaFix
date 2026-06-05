import { describe, expect, it } from "vitest";

import type { StatusHistory } from "@/types/database";

import {
  formatPortalHistoryEvent,
  getCurrentHistoryIndex,
} from "./history-timeline";

const baseEntry: Omit<StatusHistory, "id" | "from_status" | "to_status" | "created_at"> = {
  service_order_id: "order-1",
  changed_by: null,
};

describe("formatPortalHistoryEvent", () => {
  it("formats initial status without from_status", () => {
    const entry: StatusHistory = {
      ...baseEntry,
      id: "h1",
      from_status: null,
      to_status: "received",
      created_at: "2026-06-01T10:00:00.000Z",
    };

    expect(formatPortalHistoryEvent(entry)).toBe("Recebido");
  });

  it("formats status transition as target label", () => {
    const entry: StatusHistory = {
      ...baseEntry,
      id: "h2",
      from_status: "received",
      to_status: "in_analysis",
      created_at: "2026-06-01T11:00:00.000Z",
    };

    expect(formatPortalHistoryEvent(entry)).toBe("Em análise");
  });
});

describe("getCurrentHistoryIndex", () => {
  it("returns -1 for empty history", () => {
    expect(getCurrentHistoryIndex([])).toBe(-1);
  });

  it("returns 0 for single event", () => {
    const history: StatusHistory[] = [
      {
        ...baseEntry,
        id: "h1",
        from_status: null,
        to_status: "received",
        created_at: "2026-06-01T10:00:00.000Z",
      },
    ];

    expect(getCurrentHistoryIndex(history)).toBe(0);
  });

  it("returns last index for multiple events", () => {
    const history: StatusHistory[] = [
      {
        ...baseEntry,
        id: "h1",
        from_status: null,
        to_status: "received",
        created_at: "2026-06-01T10:00:00.000Z",
      },
      {
        ...baseEntry,
        id: "h2",
        from_status: "received",
        to_status: "in_analysis",
        created_at: "2026-06-01T11:00:00.000Z",
      },
      {
        ...baseEntry,
        id: "h3",
        from_status: "in_analysis",
        to_status: "in_repair",
        created_at: "2026-06-01T12:00:00.000Z",
      },
    ];

    expect(getCurrentHistoryIndex(history)).toBe(2);
  });
});

describe("formatHistoryDateTime integration", () => {
  it("formats dates in pt-BR dd/MM/yyyy HH:mm pattern", async () => {
    const { formatHistoryDateTime } = await import("@/components/orders/order-list");
    const formatted = formatHistoryDateTime("2026-03-15T14:30:00.000Z");

    expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    expect(formatted).toMatch(/\d{2}:\d{2}/);
  });
});
