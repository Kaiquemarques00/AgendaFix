const MAX_FAILED_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000;

type AttemptWindow = {
  failures: number;
  windowStart: number;
};

const attemptsByKey = new Map<string, AttemptWindow>();

function pruneExpired(now: number) {
  for (const [key, entry] of attemptsByKey) {
    if (now - entry.windowStart >= WINDOW_MS) {
      attemptsByKey.delete(key);
    }
  }
}

export function isLookupRateLimited(clientKey: string): boolean {
  const now = Date.now();
  pruneExpired(now);

  const entry = attemptsByKey.get(clientKey);
  if (!entry) {
    return false;
  }

  if (now - entry.windowStart >= WINDOW_MS) {
    attemptsByKey.delete(clientKey);
    return false;
  }

  return entry.failures >= MAX_FAILED_ATTEMPTS;
}

export function recordLookupFailure(clientKey: string): void {
  const now = Date.now();
  pruneExpired(now);

  const entry = attemptsByKey.get(clientKey);
  if (!entry || now - entry.windowStart >= WINDOW_MS) {
    attemptsByKey.set(clientKey, { failures: 1, windowStart: now });
    return;
  }

  entry.failures += 1;
}

export function clearLookupAttempts(clientKey: string): void {
  attemptsByKey.delete(clientKey);
}

/** Expõe limites para testes. */
export function getLookupRateLimitConfig() {
  return { maxFailedAttempts: MAX_FAILED_ATTEMPTS, windowMs: WINDOW_MS };
}

/** Limpa estado entre testes. */
export function resetLookupRateLimitForTests(): void {
  attemptsByKey.clear();
}
