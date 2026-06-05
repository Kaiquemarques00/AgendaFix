import { describe, expect, it } from "vitest";

import type { OrderNote, StatusHistory } from "@/types/database";

import {
  REALTIME_FALLBACK_MESSAGE,
  appendHistoryEntry,
  appendNoteEntry,
} from "./order-tracking-view";
import { shouldShowRealtimeFallback } from "@/hooks/use-order-subscription";

const baseHistory: Omit<StatusHistory, "id" | "from_status" | "to_status" | "created_at"> = {
  service_order_id: "order-1",
  changed_by: null,
};

const baseNote: Omit<OrderNote, "id" | "content" | "created_at"> = {
  service_order_id: "order-1",
  created_by: null,
};

describe("shouldShowRealtimeFallback", () => {
  it("does not show banner before threshold", () => {
    expect(shouldShowRealtimeFallback(0)).toBe(false);
    expect(shouldShowRealtimeFallback(1)).toBe(false);
    expect(shouldShowRealtimeFallback(2)).toBe(false);
  });

  it("shows banner after 3 consecutive failures", () => {
    expect(shouldShowRealtimeFallback(3)).toBe(true);
    expect(shouldShowRealtimeFallback(4)).toBe(true);
  });
});

describe("REALTIME_FALLBACK_MESSAGE", () => {
  it("uses design copy for persistent realtime failure", () => {
    expect(REALTIME_FALLBACK_MESSAGE).toBe(
      "Atualizações automáticas indisponíveis"
    );
  });
});

describe("appendHistoryEntry", () => {
  it("appends new history without mutating original", () => {
    const history: StatusHistory[] = [
      {
        ...baseHistory,
        id: "h1",
        from_status: null,
        to_status: "received",
        created_at: "2026-06-01T10:00:00.000Z",
      },
    ];
    const next: StatusHistory = {
      ...baseHistory,
      id: "h2",
      from_status: "received",
      to_status: "in_analysis",
      created_at: "2026-06-01T11:00:00.000Z",
    };

    const result = appendHistoryEntry(history, next);

    expect(result).toHaveLength(2);
    expect(result[1]).toEqual(next);
    expect(history).toHaveLength(1);
  });
});

describe("appendNoteEntry", () => {
  it("appends new note without mutating original", () => {
    const notes: OrderNote[] = [
      {
        ...baseNote,
        id: "n1",
        content: "Primeira",
        created_at: "2026-06-01T10:00:00.000Z",
      },
    ];
    const next: OrderNote = {
      ...baseNote,
      id: "n2",
      content: "Segunda",
      created_at: "2026-06-01T11:00:00.000Z",
    };

    const result = appendNoteEntry(notes, next);

    expect(result).toHaveLength(2);
    expect(result[1]).toEqual(next);
    expect(notes).toHaveLength(1);
  });
});
