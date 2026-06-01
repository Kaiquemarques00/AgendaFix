# Testing — Agenda Fix

## Gate Check Commands

| Gate  | Command           |
| ----- | ----------------- |
| quick | `npm run test`    |
| build | `npm run build`   |
| lint  | `npm run lint`    |

## Test Types

| Layer        | Tool   | Location              |
| ------------ | ------ | --------------------- |
| Unit         | Vitest | `src/**/*.test.ts`    |
| E2E          | Manual | Auth, portal (futuro) |

## Realtime (T7)

`src/lib/supabase/realtime.test.ts` — mock de channel Supabase, reconnect e cleanup.
