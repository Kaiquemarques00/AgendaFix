# Portal do Cliente — Tasks

**Design**: `.specs/features/portal-cliente/design.md`
**Status**: Complete
**Verified**: 2026-06-05 — ver seção Verification Log abaixo

**Depends on**: infra-base (realtime) ✅, ordem-servico (public API, lookup) ✅

---

## Execution Plan

### Phase 1: UI Components (Parallel OK)

```
T1 [P]   T2 [P]   T3 [P]
```

### Phase 2: Tracking Page (Sequential)

```
T1,T2,T3 → T4 → T5
```

### Phase 3: Lookup Page (Sequential)

```
ordem-servico T7 → T6
```

---

## Task Breakdown

### T1: Criar StatusStepper para portal [P]

**What**: Componente visual de 6 etapas com highlight no status atual
**Where**: `src/components/portal/status-stepper.tsx`
**Depends on**: ordem-servico T1 (status labels)
**Requirement**: PORTAL-02

**Done when**:
- [x] 6 steps renderizam corretamente
- [x] Status atual destacado; anteriores com check
- [x] Responsivo: horizontal desktop, vertical mobile

**Tests**: unit
**Gate**: quick

**Commit**: `feat(portal): add status stepper component`

---

### T2: Criar HistoryTimeline para portal [P]

**What**: Timeline vertical com eventos formatados em pt-BR
**Where**: `src/components/portal/history-timeline.tsx`
**Depends on**: ordem-servico T1
**Requirement**: PORTAL-03

**Done when**:
- [x] Eventos ordenados cronologicamente
- [x] Data formatada dd/MM/yyyy HH:mm
- [x] Evento atual destacado
- [x] Funciona com 1 evento

**Tests**: unit
**Gate**: quick

**Commit**: `feat(portal): add history timeline component`

---

### T3: Criar NotesSection e NotFoundOrder [P]

**What**: Seção de observações + página de ordem não encontrada
**Where**: `src/components/portal/notes-section.tsx`, `src/components/portal/not-found-order.tsx`
**Depends on**: None
**Requirement**: PORTAL-01, PORTAL-04

**Done when**:
- [x] Notas em ordem cronológica
- [x] Empty state "Nenhuma mensagem da assistência ainda"
- [x] NotFound amigável com ilustração ou ícone

**Tests**: unit
**Gate**: quick

**Commit**: `feat(portal): add notes section and not found page`

---

### T4: Criar OrderTrackingView com Realtime

**What**: Client container que combina componentes e subscription
**Where**: `src/components/portal/order-tracking-view.tsx`
**Depends on**: T1, T2, T3, infra-base T7
**Requirement**: PORTAL-05

**Done when**:
- [x] Renderiza dados iniciais do SSR
- [x] Atualiza status via Realtime sem reload
- [x] Novas notas aparecem automaticamente
- [x] Banner fallback se Realtime falhar persistentemente

**Tests**: unit (mock subscription)
**Gate**: quick

**Commit**: `feat(portal): add order tracking view with realtime`

---

### T5: Criar página /acompanhar/[token]

**What**: Server page com fetch inicial e OrderTrackingView
**Where**: `src/app/acompanhar/[token]/page.tsx`
**Depends on**: T4, ordem-servico T6
**Requirement**: PORTAL-01, PORTAL-02

**Done when**:
- [x] SSR carrega ordem via public API
- [x] Token inválido renderiza NotFoundOrder
- [x] Meta title com número da OS
- [x] robots noindex configurado
- [x] Mobile-friendly (375px)

**Tests**: e2e (manual)
**Gate**: manual + lighthouse mobile

**Commit**: `feat(portal): add order tracking page`

---

### T6: Criar página /consultar com OrderLookupForm

**What**: Formulário de busca por OS + telefone com redirect
**Where**: `src/app/consultar/page.tsx`, `src/components/portal/order-lookup-form.tsx`
**Depends on**: ordem-servico T7
**Requirement**: PORTAL-06

**Done when**:
- [x] Formulário com 2 campos
- [x] Submit chama lookupOrder
- [x] Sucesso redireciona para /acompanhar/{token}
- [x] Erro exibe mensagem genérica
- [x] Loading state no botão

**Tests**: unit + e2e (manual)
**Gate**: manual

**Commit**: `feat(portal): add order lookup page`

---

## Parallel Execution Map

```
Phase 1:
  ├── T1 [P]
  ├── T2 [P]
  └── T3 [P]

Phase 2:
  T1,T2,T3 ──→ T4 ──→ T5

Phase 3 (can start after ordem-servico T7):
  ordem T7 ──→ T6
```

---

## Task Granularity Check

| Task | Scope | Status |
| ---- | ----- | ------ |
| T1: StatusStepper | 1 component | ✅ |
| T2: HistoryTimeline | 1 component | ✅ |
| T3: Notes + NotFound | 2 components | ✅ |
| T4: TrackingView | 1 container | ✅ |
| T5: Tracking page | 1 page | ✅ |
| T6: Lookup page | 1 page + form | ✅ |

---

## Diagram-Definition Cross-Check

| Task | Depends On | Diagram | Status |
| ---- | ---------- | ------- | ------ |
| T1 | ordem T1 | Phase 1 parallel | ✅ |
| T2 | ordem T1 | Phase 1 parallel | ✅ |
| T3 | None | Phase 1 parallel | ✅ |
| T4 | T1,T2,T3, infra T7 | → T4 | ✅ |
| T5 | T4, ordem T6 | T4→T5 | ✅ |
| T6 | ordem T7 | Separate phase | ✅ |

---

## Test Co-location Validation

| Task | Task Says | Status |
| ---- | --------- | ------ |
| T1-T4 | unit | ✅ OK |
| T5-T6 | e2e manual | ✅ OK |

---

## Verification Log

| Data | O quê | Resultado |
| ---- | ----- | --------- |
| 2026-06-05 | `npm test` (119 testes, incl. portal) | ✅ |
| 2026-06-05 | `npm run lint` | ✅ |
| 2026-06-05 | `npm run build` (rotas `/acompanhar`, `/consultar`) | ✅ |
| 2026-06-05 | T5 manual: link válido, token inválido, layout 375px, meta/robots | ✅ (responsável) |
| 2026-06-05 | T5 manual: Lighthouse mobile performance | ✅ (responsável) |
| 2026-06-05 | T6 manual: consulta OS+telefone, redirect, erro genérico, loading | ✅ (responsável) |
| 2026-06-05 | Realtime: status e notas sem reload (painel → portal) | ✅ (responsável) |
| — | Teste com usuário não técnico (spec Success Criteria) | ⏳ Pendente |
