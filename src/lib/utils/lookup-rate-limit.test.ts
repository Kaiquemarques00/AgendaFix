import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  getLookupRateLimitConfig,
  isLookupRateLimited,
  recordLookupFailure,
  resetLookupRateLimitForTests,
} from "./lookup-rate-limit";

describe("lookup rate limit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetLookupRateLimitForTests();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("bloqueia após 5 tentativas falhas na janela de 10 minutos", () => {
    const { maxFailedAttempts } = getLookupRateLimitConfig();
    const key = "client-1";

    for (let i = 0; i < maxFailedAttempts; i++) {
      expect(isLookupRateLimited(key)).toBe(false);
      recordLookupFailure(key);
    }

    expect(isLookupRateLimited(key)).toBe(true);
  });

  it("libera após expirar a janela", () => {
    const { maxFailedAttempts, windowMs } = getLookupRateLimitConfig();
    const key = "client-2";

    for (let i = 0; i < maxFailedAttempts; i++) {
      recordLookupFailure(key);
    }

    expect(isLookupRateLimited(key)).toBe(true);

    vi.advanceTimersByTime(windowMs + 1);

    expect(isLookupRateLimited(key)).toBe(false);
  });
});
