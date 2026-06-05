import { describe, expect, it } from "vitest";

import {
  STATUS_STEP_ORDER,
  getStepState,
} from "./status-stepper";

describe("STATUS_STEP_ORDER", () => {
  it("defines all 6 status steps in workflow order", () => {
    expect(STATUS_STEP_ORDER).toHaveLength(6);
    expect(STATUS_STEP_ORDER).toEqual([
      "received",
      "in_analysis",
      "in_repair",
      "waiting_parts",
      "ready_pickup",
      "delivered",
    ]);
  });
});

describe("getStepState", () => {
  it("marks earlier steps as completed", () => {
    expect(getStepState("in_repair", "received")).toBe("completed");
    expect(getStepState("in_repair", "in_analysis")).toBe("completed");
  });

  it("marks current step as current", () => {
    expect(getStepState("in_repair", "in_repair")).toBe("current");
  });

  it("marks later steps as upcoming", () => {
    expect(getStepState("in_repair", "waiting_parts")).toBe("upcoming");
    expect(getStepState("in_repair", "delivered")).toBe("upcoming");
  });

  it("handles first and last status correctly", () => {
    expect(getStepState("received", "received")).toBe("current");
    expect(getStepState("received", "in_analysis")).toBe("upcoming");
    expect(getStepState("delivered", "ready_pickup")).toBe("completed");
    expect(getStepState("delivered", "delivered")).toBe("current");
  });
});
