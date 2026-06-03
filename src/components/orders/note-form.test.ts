import { describe, expect, it } from "vitest";

import {
  NOTE_MAX_LENGTH,
  validateNoteContent,
} from "./note-form";

describe("validateNoteContent", () => {
  it("accepts valid note content", () => {
    expect(validateNoteContent("Peça chegou, iniciaremos o reparo amanhã.")).toEqual({
      valid: true,
      remaining: NOTE_MAX_LENGTH - "Peça chegou, iniciaremos o reparo amanhã.".length,
    });
  });

  it("rejects empty content", () => {
    const result = validateNoteContent("");
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("rejects content above 500 characters", () => {
    const result = validateNoteContent("a".repeat(NOTE_MAX_LENGTH + 1));
    expect(result.valid).toBe(false);
    expect(result.remaining).toBe(-1);
  });
});
