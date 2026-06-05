import { describe, expect, it } from "vitest";

import {
  TRACKING_PAGE_ROBOTS,
  buildTrackingPageTitle,
} from "./page";

describe("buildTrackingPageTitle", () => {
  it("includes order number in page title", () => {
    expect(buildTrackingPageTitle("OS-2026-0042")).toBe(
      "Acompanhar reparo — OS-2026-0042"
    );
  });
});

describe("TRACKING_PAGE_ROBOTS", () => {
  it("prevents indexing of private tracking pages", () => {
    expect(TRACKING_PAGE_ROBOTS).toEqual({
      index: false,
      follow: false,
    });
  });
});
