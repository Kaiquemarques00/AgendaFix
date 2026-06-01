# Portal do Cliente — Design

**Spec**: `.specs/features/portal-cliente/spec.md`
**Status**: Draft

---

## Architecture Overview

Rotas públicas sem autenticação. SSR para carga inicial (SEO irrelevante, mas performance e acessibilidade); Client Component para Realtime subscription.

```mermaid
graph TD
    subgraph Public Routes
        A[/acompanhar/token] --> B[OrderTrackingPage]
        C[/consultar] --> D[OrderLookupPage]
    end

    subgraph Data Flow
        B --> E[SSR: GET /api/public/orders/token]
        B --> F[Client: useOrderSubscription]
        F --> G[Supabase Realtime]
        D --> H[lookupOrder action]
        H --> A
    end
```

---

## Code Reuse Analysis

| Component | Location | How to Use |
| --------- | -------- | ---------- |
| Public API | `src/app/api/public/orders/[token]/route.ts` | Fetch inicial SSR |
| Realtime hook | `src/hooks/use-order-subscription.ts` | Updates client-side |
| Status labels | `src/lib/domain/status-machine.ts` | Labels pt-BR |
| shadcn/ui | `src/components/ui/` | Card, Badge |

---

## Pages & Components

### Order Tracking Page

- **Purpose**: Página principal de acompanhamento via token
- **Location**: `src/app/acompanhar/[token]/page.tsx`
- **Pattern**: Server Component fetch inicial + Client wrapper para Realtime
- **Data**: `GET /api/public/orders/{token}`

### Order Lookup Page

- **Purpose**: Formulário de consulta por OS + telefone
- **Location**: `src/app/consultar/page.tsx`
- **Components**: `OrderLookupForm` (client)
- **Data**: `lookupOrder` Server Action → redirect

### OrderTrackingView (Client)

- **Purpose**: Container client que gerencia estado Realtime
- **Location**: `src/components/portal/order-tracking-view.tsx`
- **Props**: `initialData: OrderWithDetails`, `token: string`
- **Reuses**: `useOrderSubscription(token, onUpdate)`

### StatusStepper (Portal)

- **Purpose**: Indicador visual de progresso (6 etapas)
- **Location**: `src/components/portal/status-stepper.tsx`
- **Props**: `currentStatus: ServiceOrderStatus`
- **Visual**: Steps horizontais em desktop, vertical em mobile

### HistoryTimeline (Portal)

- **Purpose**: Linha do tempo de eventos
- **Location**: `src/components/portal/history-timeline.tsx`
- **Props**: `history: StatusHistory[]`
- **Reuses**: Mesmo componente base do painel (variant="portal")

### NotesSection (Portal)

- **Purpose**: Lista de observações da assistência
- **Location**: `src/components/portal/notes-section.tsx`
- **Props**: `notes: OrderNote[]`

### NotFoundOrder

- **Purpose**: Página amigável para token inválido
- **Location**: `src/components/portal/not-found-order.tsx`

---

## Visual Design (MVP)

**Referência:** `.specs/project/DESIGN-SYSTEM.md` — tela "Acompanhe seu serviço" do mockup.

| Element | Treatment |
| ------- | --------- |
| Header consulta | Faixa `brand-blue` full-width com campo "Digite o número da sua OS" |
| Card principal | Fundo branco, radius-lg, shadow-card, centralizado |
| Status atual | Destaque com label + descrição amigável |
| Timeline | Vertical com dots; etapas concluídas verde, atual azul |
| Mensagens | Seção "Mensagem da assistência" com cards empilhados |
| Footer | Telefone assistência + botão WhatsApp verde |

### Status Descriptions (pt-BR, amigável)

```typescript
const STATUS_DESCRIPTIONS: Record<ServiceOrderStatus, string> = {
  received: 'Seu equipamento foi recebido pela assistência.',
  in_analysis: 'Nossa equipe está analisando o problema.',
  in_repair: 'O reparo do seu equipamento está em andamento.',
  waiting_parts: 'Estamos aguardando a chegada de peças necessárias.',
  ready_pickup: 'Seu equipamento está pronto para retirada!',
  delivered: 'Equipamento entregue. Obrigado pela confiança!',
}
```

---

## Realtime Integration

```typescript
// useOrderSubscription usage in OrderTrackingView
const { order, history, notes } = useOrderSubscription(token, initialData)

// On postgres_changes for service_orders WHERE public_token = token:
// → refetch or merge updated status

// On postgres_changes for status_history / order_notes:
// → append new entries
```

**Fallback**: Se Realtime falhar após 3 tentativas, exibir banner "Atualizações automáticas indisponíveis" com botão "Atualizar página".

---

## Error Handling Strategy

| Error Scenario | Handling | User Impact |
| -------------- | -------- | ----------- |
| Token inválido | 404 component | Ilustração + "Ordem não encontrada" |
| API timeout | Retry 1x, then error | "Não foi possível carregar. Tente novamente." |
| Realtime disconnect | Auto-reconnect | Transparente; banner se persistir |
| Lookup falhou | Generic error | "Verifique os dados informados" |

---

## SEO & Meta

- `robots: noindex` — páginas não devem ser indexadas (dados privados via token)
- Title: `Acompanhar reparo — {order_number}`

---

## Mobile-First Layout

```
┌─────────────────────────┐
│ ███ brand-blue █████████│  ← header consulta (/consultar)
│ [ Digite nº da OS    ]  │
├─────────────────────────┤
│  Assistência TechMobile │
│  OS-2026-0042           │
│                         │
│  ● Em reparo            │
│  Timeline vertical      │
│  ✓ Recebido             │
│  ✓ Em análise           │
│  ● Em reparo  ← atual   │
│  ○ Aguardando peça      │
│                         │
│  Mensagem da assistência│
│  "Aguardando tela..."   │
├─────────────────────────┤
│  📞 (11) 99999-9999     │
│  [ WhatsApp ]           │
└─────────────────────────┘
```

Página `/acompanhar/[token]` omite header de busca (cliente já chegou via link); mantém card + timeline + footer.
