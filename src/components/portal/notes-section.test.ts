import { describe, expect, it } from "vitest";

import type { OrderNote } from "@/types/database";

import {
  NOTES_EMPTY_MESSAGE,
  sortNotesChronologically,
} from "./notes-section";

const baseNote: Omit<OrderNote, "id" | "content" | "created_at"> = {
  service_order_id: "order-1",
  created_by: null,
};

describe("NOTES_EMPTY_MESSAGE", () => {
  it("uses friendly empty state copy", () => {
    expect(NOTES_EMPTY_MESSAGE).toBe(
      "Nenhuma mensagem da assistência ainda"
    );
  });
});

describe("sortNotesChronologically", () => {
  it("sorts notes oldest to newest", () => {
    const notes: OrderNote[] = [
      {
        ...baseNote,
        id: "n2",
        content: "Segunda mensagem",
        created_at: "2026-06-02T10:00:00.000Z",
      },
      {
        ...baseNote,
        id: "n1",
        content: "Primeira mensagem",
        created_at: "2026-06-01T10:00:00.000Z",
      },
    ];

    const sorted = sortNotesChronologically(notes);

    expect(sorted.map((note) => note.id)).toEqual(["n1", "n2"]);
  });

  it("returns single note unchanged in order", () => {
    const notes: OrderNote[] = [
      {
        ...baseNote,
        id: "n1",
        content: "Única mensagem",
        created_at: "2026-06-01T10:00:00.000Z",
      },
    ];

    expect(sortNotesChronologically(notes)).toEqual(notes);
  });

  it("does not mutate original array", () => {
    const notes: OrderNote[] = [
      {
        ...baseNote,
        id: "n2",
        content: "B",
        created_at: "2026-06-02T10:00:00.000Z",
      },
      {
        ...baseNote,
        id: "n1",
        content: "A",
        created_at: "2026-06-01T10:00:00.000Z",
      },
    ];

    const copy = [...notes];
    sortNotesChronologically(notes);

    expect(notes).toEqual(copy);
  });
});
