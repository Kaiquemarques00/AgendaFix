import { describe, expect, it } from "vitest";

import { getStatusActionOptions } from "./status-actions";

describe("getStatusActionOptions", () => {
  it("returns only valid transitions for received", () => {
    expect(getStatusActionOptions("received")).toEqual([
      { status: "in_analysis", label: "Em análise" },
    ]);
  });

  it("returns multiple options for in_repair", () => {
    const options = getStatusActionOptions("in_repair");
    expect(options.map((option) => option.status)).toEqual([
      "waiting_parts",
      "ready_pickup",
      "in_analysis",
    ]);
  });

  it("returns pt-BR labels for every option", () => {
    const options = getStatusActionOptions("in_analysis");
    expect(options).toEqual([
      { status: "in_repair", label: "Em reparo" },
      { status: "received", label: "Recebido" },
    ]);
  });
});
