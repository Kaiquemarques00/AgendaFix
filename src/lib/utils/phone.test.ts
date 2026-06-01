import { describe, expect, it } from "vitest";

import { getPhoneLast4, normalizePhone, phoneEndsWith } from "./phone";

describe("normalizePhone", () => {
  it("remove formatação", () => {
    expect(normalizePhone("(11) 99988-7766")).toBe("11999887766");
  });
});

describe("getPhoneLast4", () => {
  it("retorna últimos 4 dígitos", () => {
    expect(getPhoneLast4("11999887766")).toBe("7766");
    expect(getPhoneLast4("(11) 99988-7766")).toBe("7766");
  });
});

describe("phoneEndsWith", () => {
  it("aceita match com ou sem formatação", () => {
    expect(phoneEndsWith("11999887766", "7766")).toBe(true);
    expect(phoneEndsWith("(11) 99988-7766", "7766")).toBe(true);
  });

  it("rejeita quando últimos 4 não coincidem", () => {
    expect(phoneEndsWith("11999887766", "0001")).toBe(false);
  });

  it("rejeita last4 inválido", () => {
    expect(phoneEndsWith("11999887766", "776")).toBe(false);
  });
});
