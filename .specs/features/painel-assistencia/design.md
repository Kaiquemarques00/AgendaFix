# Painel da Assistência — Design

**Spec**: `.specs/features/painel-assistencia/spec.md`
**Status**: Complete (MVP)

---

## Architecture Overview

Rotas protegidas em `src/app/(dashboard)/` com layout compartilhado (sidebar + header). Server Components para listagens; Client Components para formulários e ações interativas.

```mermaid
graph LR
    subgraph Dashboard Routes
        A[/dashboard] --> B[Listagem]
        A --> C[/dashboard/nova]
        A --> D[/dashboard/ordens/id]
    end

    subgraph Components
        E[OrderList]
        F[OrderForm]
        G[OrderDetail]
        H[StatusStepper]
        I[NotesList]
        J[CopyLinkButton]
    end

    B --> E
    C --> F
    D --> G
    G --> H
    G --> I
    G --> J
```

---

## Code Reuse Analysis

| Component | Location | How to Use |
| --------- | -------- | ---------- |
| Server Actions orders | `src/lib/actions/orders.ts` | Formulários e mutations |
| Status machine | `src/lib/domain/status-machine.ts` | Labels e transições na UI |
| shadcn/ui | `src/components/ui/` | Button, Input, Card, Badge, Toast |
| Auth middleware | `src/middleware.ts` | Proteção de rotas |

---

## Pages & Components

### Dashboard Layout

- **Purpose**: Shell com navegação, logout e área de conteúdo
- **Location**: `src/app/(dashboard)/layout.tsx`
- **Interfaces**: Layout Next.js com `{children}`
- **Dependencies**: Auth session, sidebar component

### Order List Page

- **Purpose**: Listagem paginada com filtro por status
- **Location**: `src/app/(dashboard)/dashboard/page.tsx`
- **Components**: `OrderList`, `StatusFilter`, `EmptyState`
- **Data**: `getOrders({ status? })` Server Component fetch

### New Order Page

- **Purpose**: Formulário de cadastro
- **Location**: `src/app/(dashboard)/dashboard/nova/page.tsx`
- **Components**: `OrderForm` (client)
- **Data**: `createOrder` Server Action on submit

### Order Detail Page

- **Purpose**: Detalhe, status, histórico, notas, link
- **Location**: `src/app/(dashboard)/dashboard/ordens/[id]/page.tsx`
- **Components**: `OrderDetail`, `StatusActions`, `HistoryTimeline`, `NoteForm`, `CopyLinkButton`
- **Data**: `getOrderById` + client mutations

### OrderForm (Client)

- **Purpose**: Formulário controlado com validação Zod client-side
- **Location**: `src/components/orders/order-form.tsx`
- **Props**: `onSuccess?: (order) => void`
- **Reuses**: `createOrderSchema`, shadcn Form components

### StatusActions (Client)

- **Purpose**: Botões para transições válidas do status atual
- **Location**: `src/components/orders/status-actions.tsx`
- **Props**: `orderId`, `currentStatus`, `onStatusChange`
- **Reuses**: `getAllowedTransitions()`, `updateOrderStatus`

### CopyLinkButton (Client)

- **Purpose**: Copiar URL pública para clipboard
- **Location**: `src/components/orders/copy-link-button.tsx`
- **Props**: `publicToken`
- **Reuses**: `navigator.clipboard`, toast

---

## UI/UX — Design System

**Referência:** `.specs/project/DESIGN-SYSTEM.md` e `.specs/project/references/mockup-ui.png`

| Element | Decision | Rationale |
| ------- | -------- | --------- |
| Layout | Sidebar navy + top bar branca | Conforme mockup |
| Login | Split screen (navy + form branco) | Identidade visual aprovada |
| Status badges | Cores semânticas do design system | Consistência painel/portal |
| Status stepper | Horizontal no detalhe da OS | Mockup detalhe OS |
| Form layout | Seções: Cliente, Equipamento, OS | Mockup Nova OS |
| Listagem | Tabs por status + search bar | Mockup listagem |
| Empty state | Ilustração + "Criar primeira ordem" | Onboarding implícito |
| Feedback | Toast para sucesso/erro | Não bloqueia fluxo |

### Status Color Map

Importar de `@/lib/design/status-colors` — valores definidos em `DESIGN-SYSTEM.md`:

```typescript
const STATUS_COLORS: Record<ServiceOrderStatus, { bg: string; text: string }> = {
  received:      { bg: '#F1F5F9', text: '#475569' },
  in_analysis:   { bg: '#E0F2FE', text: '#0369A1' },
  in_repair:     { bg: '#DBEAFE', text: '#1D4ED8' },
  waiting_parts: { bg: '#FEF3C7', text: '#B45309' },
  ready_pickup:  { bg: '#DCFCE7', text: '#15803D' },
  delivered:     { bg: '#DCFCE7', text: '#15803D' },
}
```

### Login Page Layout

```
┌──────────────────┬──────────────────┐
│  brand-navy      │  branco          │
│  Logo + tagline  │  Bem-vindo de    │
│  Ilustração      │  volta!          │
│                  │  Email / Senha   │
│                  │  [ Entrar ]      │
└──────────────────┴──────────────────┘
```

- Location: `src/app/(auth)/login/page.tsx`
- Esquerda: logo Agenda Fix, tagline, ilustração laptop/smartphone
- Direita: formulário com "Lembrar-me", "Esqueceu a senha?", botão primário full-width

### Sidebar MVP

Itens visíveis no MVP: Dashboard (listagem), Ordens de Serviço, Nova OS, Configurações (mínimo).
Itens do mockup fora do escopo (Clientes, Equipamentos, Relatórios, Usuários): **ocultos** até milestone futuro.

---

## Error Handling Strategy

| Error Scenario | Handling | User Impact |
| -------------- | -------- | ----------- |
| Submit falhou | Toast error + form preserved | "Erro ao salvar. Tente novamente." |
| Ordem não encontrada | 404 page | "Ordem não encontrada" |
| Transição inválida | Button disabled | Não exibe opção inválida |
| Clipboard denied | Fallback select text | Modal com URL selecionável |

---

## Responsive Breakpoints

| Breakpoint | Layout |
| ---------- | ------ |
| < 768px | Sidebar colapsada; listagem em cards |
| ≥ 768px | Sidebar fixa; listagem em tabela |
| ≥ 1024px | Detalhe em 2 colunas (info + ações) |
