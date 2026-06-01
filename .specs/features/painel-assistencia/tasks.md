# Painel da Assistência — Tasks

**Design**: `.specs/features/painel-assistencia/design.md`
**Status**: Draft

**Depends on**: infra-base (auth, layout), ordem-servico (actions)

---

## Execution Plan

### Phase 1: Layout & Listagem (Sequential)

```
T1 → T2 → T3
```

### Phase 2: Formulário & Detalhe (Parallel OK)

```
T3 ──┬→ T4 [P]
     └→ T5 [P]
```

### Phase 3: Ações no Detalhe (Sequential)

```
T5 → T6 → T7
```

---

## Task Breakdown

### T1: Criar dashboard layout com sidebar e logout

**What**: Layout protegido com navegação, header e botão logout
**Where**: `src/app/(dashboard)/layout.tsx`, `src/components/dashboard/sidebar.tsx`
**Depends on**: infra-base T6
**Requirement**: PAINEL-01

**Done when**:
- [ ] Layout renderiza em rotas `/dashboard/*`
- [ ] Sidebar com links: Ordens, Nova ordem
- [ ] Logout funciona

**Tests**: none
**Gate**: build + manual

**Commit**: `feat(dashboard): add layout with sidebar and logout`

---

### T2: Criar componente OrderList com badges de status

**What**: Tabela/cards listando ordens com badge colorido por status
**Where**: `src/components/orders/order-list.tsx`
**Depends on**: T1, ordem-servico T3
**Requirement**: PAINEL-03

**Done when**:
- [ ] Lista exibe OS, cliente, equipamento, status, data
- [ ] Badges usam STATUS_COLORS
- [ ] Link para detalhe funciona
- [ ] Empty state quando vazio

**Tests**: unit
**Gate**: quick

**Commit**: `feat(dashboard): add order list component`

---

### T3: Criar página de listagem com filtro por status

**What**: Page Server Component com filtro client-side ou searchParams
**Where**: `src/app/(dashboard)/dashboard/page.tsx`, `src/components/orders/status-filter.tsx`
**Depends on**: T2
**Requirement**: PAINEL-03

**Done when**:
- [ ] Filtro por status funciona
- [ ] Ordenação por updated_at desc
- [ ] Paginação básica (20/página) se >20 ordens

**Tests**: e2e (manual)
**Gate**: manual

**Commit**: `feat(dashboard): add orders page with status filter`

---

### T4: Criar OrderForm e página Nova Ordem [P]

**What**: Formulário client com validação e submit via createOrder
**Where**: `src/components/orders/order-form.tsx`, `src/app/(dashboard)/dashboard/nova/page.tsx`
**Depends on**: T3, ordem-servico T3
**Requirement**: PAINEL-02

**Done when**:
- [ ] Todos campos do MVP presentes
- [ ] Validação inline em pt-BR
- [ ] Sucesso redireciona para detalhe ou listagem
- [ ] Erro duplicata exibido

**Tests**: unit (form validation)
**Gate**: quick

**Commit**: `feat(dashboard): add new order form and page`

---

### T5: Criar página de detalhe da ordem [P]

**What**: Page com dados da ordem, histórico e link
**Where**: `src/app/(dashboard)/dashboard/ordens/[id]/page.tsx`, `src/components/orders/order-detail.tsx`
**Depends on**: T3, ordem-servico T3
**Requirement**: PAINEL-04

**Done when**:
- [ ] Exibe todos campos da ordem
- [ ] Histórico em timeline vertical
- [ ] 404 se ordem não existe ou não pertence à workshop

**Tests**: e2e (manual)
**Gate**: manual

**Commit**: `feat(dashboard): add order detail page`

---

### T6: Adicionar StatusActions ao detalhe

**What**: Botões de transição de status com loading e refresh
**Where**: `src/components/orders/status-actions.tsx`
**Depends on**: T5, ordem-servico T4
**Requirement**: PAINEL-04

**Done when**:
- [ ] Apenas transições válidas visíveis
- [ ] Loading state durante mutation
- [ ] Histórico atualiza após sucesso

**Tests**: unit
**Gate**: quick

**Commit**: `feat(dashboard): add status action buttons`

---

### T7: Adicionar NoteForm e CopyLinkButton

**What**: Formulário de observações + botão copiar link com toast
**Where**: `src/components/orders/note-form.tsx`, `src/components/orders/copy-link-button.tsx`
**Depends on**: T6, ordem-servico T5
**Requirement**: PAINEL-05, PAINEL-06

**Done when**:
- [ ] Nota adicionada atualiza lista
- [ ] Contador de caracteres (500 max)
- [ ] Copiar link exibe toast de confirmação
- [ ] Fallback se clipboard API indisponível

**Tests**: unit
**Gate**: quick

**Commit**: `feat(dashboard): add notes form and copy link button`

---

## Parallel Execution Map

```
Phase 1:
  T1 ──→ T2 ──→ T3

Phase 2:
  T3 complete, then:
    ├── T4 [P]
    └── T5 [P]

Phase 3:
  T5 ──→ T6 ──→ T7
  (T4 independent, completes in parallel)
```

---

## Task Granularity Check

| Task | Scope | Status |
| ---- | ----- | ------ |
| T1: Layout | 1 layout + sidebar | ✅ |
| T2: OrderList | 1 component | ✅ |
| T3: List page | 1 page + filter | ✅ |
| T4: OrderForm | 1 form + page | ✅ |
| T5: Detail page | 1 page + component | ✅ |
| T6: StatusActions | 1 component | ✅ |
| T7: Notes + Copy | 2 small components | ✅ |

---

## Diagram-Definition Cross-Check

| Task | Depends On | Diagram | Status |
| ---- | ---------- | ------- | ------ |
| T1 | infra T6 | Entry | ✅ |
| T2 | T1, ordem T3 | T1→T2 | ✅ |
| T3 | T2 | T2→T3 | ✅ |
| T4 | T3, ordem T3 | T3→T4 | ✅ |
| T5 | T3, ordem T3 | T3→T5 | ✅ |
| T6 | T5, ordem T4 | T5→T6 | ✅ |
| T7 | T6, ordem T5 | T6→T7 | ✅ |

---

## Test Co-location Validation

| Task | Task Says | Status |
| ---- | --------- | ------ |
| T1, T3, T5 | none/e2e manual | ✅ OK (UI pages) |
| T2, T4, T6, T7 | unit | ✅ OK |
