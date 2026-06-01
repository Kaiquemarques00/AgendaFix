import { describe, expect, it } from "vitest";

import type { ServiceOrderStatus } from "@/types/database";

import {
  STATUS_LABELS,
  canTransition,
  getAllowedTransitions,
  getStatusLabel,
} from "./status-machine";

const ALL_STATUSES: ServiceOrderStatus[] = [
  "received",
  "in_analysis",
  "in_repair",
  "waiting_parts",
  "ready_pickup",
  "delivered",
];

describe("canTransition", () => {
  const allowed: Array<[ServiceOrderStatus, ServiceOrderStatus]> = [
    ["received", "in_analysis"],
    ["in_analysis", "in_repair"],
    ["in_analysis", "received"],
    ["in_repair", "waiting_parts"],
    ["in_repair", "ready_pickup"],
    ["in_repair", "in_analysis"],
    ["waiting_parts", "in_repair"],
    ["ready_pickup", "delivered"],
    ["ready_pickup", "in_repair"],
    ["delivered", "ready_pickup"],
  ];

  it.each(allowed)("permite %s → %s", (from, to) => {
    expect(canTransition(from, to)).toBe(true);
  });

  const forbidden: Array<[ServiceOrderStatus, ServiceOrderStatus]> = [
    ["received", "delivered"],
    ["received", "in_repair"],
    ["received", "ready_pickup"],
    ["received", "waiting_parts"],
    ["in_analysis", "delivered"],
    ["in_analysis", "ready_pickup"],
    ["in_analysis", "waiting_parts"],
    ["in_repair", "received"],
    ["in_repair", "delivered"],
    ["waiting_parts", "received"],
    ["waiting_parts", "delivered"],
    ["waiting_parts", "ready_pickup"],
    ["ready_pickup", "received"],
    ["ready_pickup", "in_analysis"],
    ["ready_pickup", "waiting_parts"],
    ["delivered", "received"],
    ["delivered", "in_analysis"],
    ["delivered", "in_repair"],
    ["delivered", "waiting_parts"],
    ["delivered", "delivered"],
    ["received", "received"],
  ];

  it.each(forbidden)("bloqueia %s → %s", (from, to) => {
    expect(canTransition(from, to)).toBe(false);
  });
});

describe("getAllowedTransitions", () => {
  it("retorna próximos status permitidos para cada estado", () => {
    expect(getAllowedTransitions("received")).toEqual(["in_analysis"]);
    expect(getAllowedTransitions("in_analysis")).toEqual([
      "in_repair",
      "received",
    ]);
    expect(getAllowedTransitions("in_repair")).toEqual([
      "waiting_parts",
      "ready_pickup",
      "in_analysis",
    ]);
    expect(getAllowedTransitions("waiting_parts")).toEqual(["in_repair"]);
    expect(getAllowedTransitions("ready_pickup")).toEqual([
      "delivered",
      "in_repair",
    ]);
    expect(getAllowedTransitions("delivered")).toEqual(["ready_pickup"]);
  });

  it("não inclui o status atual", () => {
    for (const status of ALL_STATUSES) {
      expect(getAllowedTransitions(status)).not.toContain(status);
    }
  });
});

describe("getStatusLabel", () => {
  it("retorna labels pt-BR para todos os status", () => {
    expect(getStatusLabel("received")).toBe("Recebido");
    expect(getStatusLabel("in_analysis")).toBe("Em análise");
    expect(getStatusLabel("in_repair")).toBe("Em reparo");
    expect(getStatusLabel("waiting_parts")).toBe("Aguardando peça");
    expect(getStatusLabel("ready_pickup")).toBe("Pronto para retirada");
    expect(getStatusLabel("delivered")).toBe("Entregue");
  });

  it("exporta STATUS_LABELS com todas as chaves", () => {
    expect(Object.keys(STATUS_LABELS).sort()).toEqual(
      [...ALL_STATUSES].sort()
    );
  });
});
