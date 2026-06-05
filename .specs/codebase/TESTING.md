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
| E2E          | Manual | Auth, portal (`/acompanhar`, `/consultar`) |

## Portal do Cliente (manual)

| Fluxo | Como testar |
| ----- | ----------- |
| Link válido | Painel → copiar link → `/acompanhar/{token}` exibe OS, stepper, timeline, notas |
| Token inválido | `/acompanhar/00000000-0000-4000-8000-000000000099` → "Ordem não encontrada" |
| Realtime | Alterar status/nota no painel → portal atualiza sem reload (< 3s) |
| Consulta | `/consultar` → OS-2026-0001 + últimos 4 dígitos do telefone do seed → redirect |
| Lookup inválido | Dados incorretos → mensagem genérica (sem expor se OS existe) |
| Lighthouse | Página `/acompanhar/{token}` em mobile → performance > 80 |

## Realtime (T7)

`src/lib/supabase/realtime.test.ts` — mock de channel Supabase, reconnect e cleanup.
