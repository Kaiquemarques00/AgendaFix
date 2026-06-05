import { describe, expect, it } from "vitest";

import { TRACKING_PAGE_ROBOTS } from "@/app/acompanhar/[token]/page";

import { CONSULT_PAGE_TITLE } from "./page";

describe("CONSULT_PAGE_TITLE", () => {
  it("uses consult page title", () => {
    expect(CONSULT_PAGE_TITLE).toBe("Consultar ordem");
  });
});

describe("consultar page metadata", () => {
  it("reuses noindex robots from tracking pages", () => {
    expect(TRACKING_PAGE_ROBOTS).toEqual({
      index: false,
      follow: false,
    });
  });
});
