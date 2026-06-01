# Gestão de Ordens de Serviço — Tasks

**Design**: `.specs/features/ordem-servico/design.md`
**Status**: Draft

---

## Execution Plan

### Phase 1: Domain Layer (Sequential)

```
T1 → T2
```

### Phase 2: Server Actions (Sequential)

```
T2 → T3 → T4 → T5
```

### Phase 3: Public API & Lookup (Parallel OK)

```
T5 ──┬→ T6 [P]
     └→ T7 [P]
```

---

## Task Breakdown

### T1: Implementar status machine

**What**: Módulo puro com validação de transições, labels pt-BR e lista de próximos status
**Where**: `src/lib/domain/status-machine.ts`
**Depends on**: infra-base T4 (schema)
**Reuses**: spec.md fluxo de status
**Requirement**: OS-04, OS-05

**Done when**:
- [ ] Todas transições da spec cobertas por testes
- [ ] Transições inválidas retornam false
- [ ] Labels pt-BR exportados

**Tests**: unit
**Gate**: quick (`npm test status-machine`)

**Commit**: `feat(orders): add status transition machine`

---

### T2: Criar schemas Zod de validação

**What**: Schemas createOrder, updateStatus, addNote com mensagens pt-BR
**Where**: `src/lib/validations/orders.ts`
**Depends on**: T1
**Reuses**: design.md validation schemas
**Requirement**: OS-01, OS-07

**Done when**:
- [ ] Schemas validam campos obrigatórios e limites
- [ ] Mensagens de erro em português
- [ ] Testes unitários de casos válidos e inválidos

**Tests**: unit
**Gate**: quick

**Commit**: `feat(orders): add Zod validation schemas`

---

### T3: Implementar createOrder Server Action

**What**: Action autenticada para criar ordem com status inicial e histórico
**Where**: `src/lib/actions/orders.ts`
**Depends on**: T2, infra-base T6
**Reuses**: Supabase server client
**Requirement**: OS-01, OS-02, OS-03

**Done when**:
- [ ] Ordem criada com status `received` e `public_token`
- [ ] Duplicata de `order_number` rejeitada
- [ ] Histórico inicial registrado
- [ ] RLS impede criação em workshop alheia

**Tests**: integration
**Gate**: full

**Commit**: `feat(orders): add createOrder server action`

---

### T4: Implementar updateOrderStatus Server Action

**What**: Action para transição de status com validação via status machine
**Where**: `src/lib/actions/orders.ts` (extend)
**Depends on**: T3
**Reuses**: status-machine, DB trigger
**Requirement**: OS-04, OS-05

**Done when**:
- [ ] Transição válida atualiza ordem e histórico
- [ ] Transição inválida retorna erro claro
- [ ] Realtime propaga mudança (verificar manualmente)

**Tests**: integration
**Gate**: full

**Commit**: `feat(orders): add updateOrderStatus action`

---

### T5: Implementar addOrderNote Server Action

**What**: Action para adicionar observação técnica à ordem
**Where**: `src/lib/actions/orders.ts` (extend)
**Depends on**: T3
**Reuses**: addNoteSchema
**Requirement**: OS-07

**Done when**:
- [ ] Nota persistida com timestamp
- [ ] Validação de tamanho (500 chars)
- [ ] Nota vinculada à ordem correta via RLS

**Tests**: integration
**Gate**: full

**Commit**: `feat(orders): add order notes action`

---

### T6: Criar API pública GET /api/public/orders/[token] [P]

**What**: Route handler para consulta de ordem, histórico e notas via token
**Where**: `src/app/api/public/orders/[token]/route.ts`
**Depends on**: T5
**Reuses**: RLS anon policies
**Requirement**: OS-06, OS-08

**Done when**:
- [ ] Token válido retorna order + history + notes
- [ ] Token inválido retorna 404 genérico
- [ ] Sem dados sensíveis (workshop_id interno omitido ou mínimo)

**Tests**: integration
**Gate**: full

**Commit**: `feat(orders): add public order API endpoint`

---

### T7: Implementar lookup por número da OS + telefone [P]

**What**: Action pública de busca com normalização de telefone e rate limit
**Where**: `src/lib/actions/public-lookup.ts`, `src/lib/utils/phone.ts`
**Depends on**: T5
**Reuses**: createOrder phone normalization
**Requirement**: OS-09

**Done when**:
- [ ] Combinação correta retorna token para redirect
- [ ] Combinação errada retorna erro genérico
- [ ] Rate limit após 5 tentativas falhas

**Tests**: unit + integration
**Gate**: full

**Commit**: `feat(orders): add public order lookup by OS number`

---

## Parallel Execution Map

```
Phase 1:
  T1 ──→ T2

Phase 2:
  T2 ──→ T3 ──→ T4 ──→ T5

Phase 3:
  T5 complete, then:
    ├── T6 [P]
    └── T7 [P]
```

---

## Task Granularity Check

| Task | Scope | Status |
| ---- | ----- | ------ |
| T1: Status machine | 1 module | ✅ Granular |
| T2: Zod schemas | 1 file | ✅ Granular |
| T3: createOrder | 1 action | ✅ Granular |
| T4: updateStatus | 1 action | ✅ Granular |
| T5: addNote | 1 action | ✅ Granular |
| T6: Public API | 1 route | ✅ Granular |
| T7: Lookup | 1 action + util | ✅ Granular |

---

## Diagram-Definition Cross-Check

| Task | Depends On | Diagram | Status |
| ---- | ---------- | ------- | ------ |
| T1 | infra-base T4 | Entry | ✅ |
| T2 | T1 | T1→T2 | ✅ |
| T3 | T2, infra T6 | T2→T3 | ✅ |
| T4 | T3 | T3→T4 | ✅ |
| T5 | T3 | T3→T5 | ✅ |
| T6 | T5 | T5→T6 | ✅ |
| T7 | T5 | T5→T7 | ✅ |

---

## Test Co-location Validation

| Task | Code Layer | Task Says | Status |
| ---- | ---------- | --------- | ------ |
| T1-T2 | Pure logic | unit | ✅ OK |
| T3-T6 | Server actions/API | integration | ✅ OK |
| T7 | Action + util | unit + integration | ✅ OK |
