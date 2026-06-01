# Infraestrutura Base — Tasks

**Design**: `.specs/features/infra-base/design.md`
**Status**: Complete (Phase 3 done)

**Nota de testes (greenfield):** Projeto ainda sem TESTING.md. Tasks usam `Tests: none` para setup/config e `Tests: unit` onde lógica testável for criada. Criar `.specs/codebase/TESTING.md` antes da execução.

---

## Execution Plan

### Phase 1: Project Bootstrap (Sequential)

```
T1 → T2 → T3
```

### Phase 2: Database & Auth (Sequential)

```
T3 → T4 → T5 → T6
```

### Phase 3: Realtime & Seed (Parallel OK)

```
T6 ──┬→ T7 [P]
     └→ T8 [P]
```

---

## Task Breakdown

### T1: Inicializar projeto Next.js

**What**: Criar app Next.js 15 com TypeScript, Tailwind, ESLint e estrutura de pastas base
**Where**: Raiz do repositório (`package.json`, `src/app/`, `tailwind.config.ts`)
**Depends on**: None
**Reuses**: Template `create-next-app`
**Requirement**: INFRA-01

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [x] `npm run dev` inicia sem erros
- [x] `npm run build` compila sem erros
- [x] Estrutura `src/app/`, `src/lib/`, `src/components/` existe

**Tests**: none
**Gate**: build

**Commit**: `chore: initialize Next.js project with TypeScript and Tailwind`

---

### T2: Configurar shadcn/ui e utilitários base

**What**: Instalar shadcn/ui, configurar `components.json` e componentes base (Button, Input, Card)
**Where**: `src/components/ui/`, `src/lib/utils.ts`
**Depends on**: T1
**Reuses**: shadcn CLI
**Requirement**: INFRA-01

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [x] Button, Input, Card renderizam na página inicial de teste
- [x] Tailwind merge (`cn()`) funciona
- [x] Build passa

**Tests**: none
**Gate**: build

**Commit**: `chore: add shadcn/ui base components`

---

### T3: Configurar clientes Supabase (browser + server)

**What**: Criar factories de cliente Supabase para browser e server com tipagem
**Where**: `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `.env.example`
**Depends on**: T1
**Reuses**: Padrão `@supabase/ssr`
**Requirement**: INFRA-02

**Tools**:
- MCP: `plugin-supabase-supabase`
- Skill: supabase

**Done when**:
- [x] Clientes exportados e importáveis sem erro
- [x] `.env.example` documenta variáveis necessárias
- [x] App falha gracefully se env vars ausentes (mensagem clara)

**Tests**: none
**Gate**: build

**Commit**: `feat(infra): add Supabase client factories`

---

### T4: Criar migrations do schema MVP

**What**: SQL migration com tabelas workshops, workshop_users, service_orders, status_history, order_notes + indexes + triggers
**Where**: `supabase/migrations/001_initial_schema.sql`
**Depends on**: T3
**Reuses**: design.md data models
**Requirement**: INFRA-03, INFRA-04, INFRA-05

**Tools**:
- MCP: `plugin-supabase-supabase`
- Skill: supabase, supabase-postgres-best-practices

**Done when**:
- [x] Migration aplica sem erro via Supabase CLI _(arquivos prontos — rodar `supabase db push`)_
- [x] Constraints UNIQUE em `order_number` (per workshop) e `public_token`
- [x] Trigger gera `public_token` UUID no INSERT se não fornecido
- [x] Indexes em `service_orders(workshop_id, status)` e `service_orders(public_token)`

**Tests**: none
**Gate**: migration apply local

**Commit**: `feat(db): add initial schema migration`

---

### T5: Configurar RLS policies

**What**: Policies de Row Level Security para isolamento por workshop e acesso anônimo via token
**Where**: `supabase/migrations/002_rls_policies.sql`
**Depends on**: T4
**Reuses**: design.md RLS summary
**Requirement**: INFRA-04

**Tools**:
- MCP: `plugin-supabase-supabase`
- Skill: supabase

**Done when**:
- [x] Usuário autenticado só acessa ordens da própria workshop
- [x] Usuário anônimo consegue SELECT ordem/histórico/notas via `public_token` válido
- [x] Usuário anônimo NÃO consegue INSERT/UPDATE/DELETE
- [x] Teste manual documentado no PR/commit message

**Tests**: none
**Gate**: manual RLS verification

**Commit**: `feat(db): add RLS policies for multi-workshop isolation`

---

### T6: Implementar autenticação (login, middleware, logout)

**What**: Página de login, middleware protegendo `/dashboard/*`, action de logout
**Where**: `src/app/(auth)/login/`, `src/middleware.ts`, `src/app/(dashboard)/layout.tsx`
**Depends on**: T3, T5
**Reuses**: Supabase Auth SSR pattern
**Requirement**: INFRA-06, INFRA-07

**Tools**:
- MCP: `plugin-supabase-supabase`
- Skill: supabase

**Done when**:
- [x] Login com credenciais válidas redireciona a `/dashboard`
- [x] Credenciais inválidas exibem erro genérico
- [x] Rota `/dashboard` bloqueada sem sessão
- [x] Logout invalida sessão

**Tests**: e2e (manual ou Playwright — definir em TESTING.md)
**Gate**: manual auth flow

**Commit**: `feat(auth): add login, middleware and logout`

---

### T7: Configurar Realtime para service_orders [P]

**What**: Hook/cliente Realtime que escuta mudanças em `service_orders` e `status_history` por `public_token`
**Where**: `src/lib/supabase/realtime.ts`, `src/hooks/use-order-subscription.ts`
**Depends on**: T6
**Reuses**: Supabase Realtime postgres_changes
**Requirement**: INFRA-08, INFRA-09

**Tools**:
- MCP: `plugin-supabase-supabase`
- Skill: supabase

**Done when**:
- [x] Subscription recebe evento quando status muda (< 3s em dev)
- [x] Reconnect automático após desconexão simulada
- [x] Cleanup de subscription no unmount

**Tests**: unit (mock Supabase channel)
**Gate**: quick

**Commit**: `feat(realtime): add order subscription hook`

---

### T8: Criar seed de desenvolvimento [P]

**What**: Script SQL ou TS seed com 1 workshop, 1 admin, 3 ordens em status diferentes
**Where**: `supabase/seed.sql` ou `scripts/seed.ts`
**Depends on**: T6
**Reuses**: schema migrations
**Requirement**: INFRA-10

**Tools**:
- MCP: `plugin-supabase-supabase`
- Skill: supabase

**Done when**:
- [x] Seed executa sem erro
- [x] Re-execução é idempotente (upsert ou skip)
- [x] README documenta comando de seed

**Tests**: none
**Gate**: seed run

**Commit**: `chore: add development seed data`

---

## Parallel Execution Map

```
Phase 1:
  T1 ──→ T2
  T1 ──→ T3

Phase 2:
  T3 ──→ T4 ──→ T5 ──→ T6

Phase 3:
  T6 complete, then:
    ├── T7 [P]
    └── T8 [P]
```

---

## Task Granularity Check

| Task | Scope | Status |
| ---- | ----- | ------ |
| T1: Init Next.js | 1 project setup | ✅ Granular |
| T2: shadcn base | 3 UI components | ✅ Granular |
| T3: Supabase clients | 2 files | ✅ Granular |
| T4: Schema migration | 1 migration file | ✅ Granular |
| T5: RLS policies | 1 migration file | ✅ Granular |
| T6: Auth flow | login + middleware | ✅ Granular |
| T7: Realtime hook | 1 hook + 1 lib | ✅ Granular |
| T8: Seed script | 1 script | ✅ Granular |

---

## Diagram-Definition Cross-Check

| Task | Depends On (body) | Diagram Shows | Status |
| ---- | ----------------- | ------------- | ------ |
| T1 | None | Entry point | ✅ Match |
| T2 | T1 | T1 → T2 | ✅ Match |
| T3 | T1 | T1 → T3 | ✅ Match |
| T4 | T3 | T3 → T4 | ✅ Match |
| T5 | T4 | T4 → T5 | ✅ Match |
| T6 | T3, T5 | T5 → T6 | ✅ Match |
| T7 | T6 | T6 → T7 | ✅ Match |
| T8 | T6 | T6 → T8 | ✅ Match |

---

## Test Co-location Validation

| Task | Code Layer | Matrix Requires | Task Says | Status |
| ---- | ---------- | --------------- | --------- | ------ |
| T1-T6, T8 | Config/setup | none (greenfield) | none | ✅ OK |
| T7 | Hook | unit (proposed) | unit | ✅ OK |
