# Agenda Fix — Design System

**Referência visual:** `.specs/project/references/mockup-ui.png`
**Status:** Aprovado (2026-06-01)
**Nome comercial:** Agenda Fix (`agendafix`)

---

## Identidade

Plataforma de acompanhamento de serviços para assistências técnicas. Visual profissional, limpo e moderno — estética de dashboard SaaS com foco em legibilidade operacional.

**Tagline (login):** "Plataforma de acompanhamento de serviços para assistências técnicas e oficinas."

---

## Logo

- Ícone: chave inglesa branca dentro de quadrado arredondado azul
- Wordmark: **Agenda Fix** em sans-serif bold, branco (sidebar) ou navy (fundo claro)
- Favicon: mesmo ícone isolado

---

## Paleta de Cores

### Brand

| Token | Hex | Uso |
| ----- | --- | --- |
| `brand-navy` | `#0F172A` | Sidebar, painel esquerdo do login, headers escuros |
| `brand-blue` | `#2563EB` | Botões primários, links, ícones ativos, header do portal |
| `brand-blue-hover` | `#1D4ED8` | Hover de botões primários |
| `brand-blue-light` | `#EFF6FF` | Backgrounds de destaque suave |

### Superfícies

| Token | Hex | Uso |
| ----- | --- | --- |
| `surface-page` | `#F8F9FA` | Background principal das páginas |
| `surface-card` | `#FFFFFF` | Cards, formulários, tabelas |
| `surface-border` | `#E2E8F0` | Bordas de inputs, divisores, tabelas |

### Texto

| Token | Hex | Uso |
| ----- | --- | --- |
| `text-primary` | `#0F172A` | Títulos, corpo principal |
| `text-secondary` | `#64748B` | Labels, subtítulos, metadados |
| `text-inverse` | `#FFFFFF` | Texto sobre fundos escuros |
| `text-muted` | `#94A3B8` | Placeholders, hints |

### Status (semântico — consistente em painel e portal)

| Status | Label pt-BR | Background badge | Texto badge |
| ------ | ----------- | ---------------- | ----------- |
| `received` | Recebido | `#F1F5F9` | `#475569` |
| `in_analysis` | Em análise | `#E0F2FE` | `#0369A1` |
| `in_repair` | Em reparo | `#DBEAFE` | `#1D4ED8` |
| `waiting_parts` | Aguardando peça | `#FEF3C7` | `#B45309` |
| `ready_pickup` | Pronto para retirada | `#DCFCE7` | `#15803D` |
| `delivered` | Entregue | `#DCFCE7` | `#15803D` |

Stepper: etapas concluídas = check verde (`#15803D`); etapa atual = círculo azul (`#2563EB`); futuras = cinza (`#CBD5E1`).

---

## Tipografia

**Fonte:** Inter (Google Fonts) — fallback `system-ui, sans-serif`

| Token | Size | Weight | Uso |
| ----- | ---- | ------ | --- |
| `heading-xl` | 30px / 1.875rem | 700 | Títulos de página |
| `heading-lg` | 24px / 1.5rem | 600 | Seções de formulário |
| `heading-md` | 18px / 1.125rem | 600 | Subtítulos, card headers |
| `body` | 14px / 0.875rem | 400 | Texto padrão, tabelas |
| `body-sm` | 12px / 0.75rem | 400 | Metadados, timestamps |
| `label` | 14px / 0.875rem | 500 | Labels de formulário |

---

## Espaçamento e Forma

| Token | Valor | Uso |
| ----- | ----- | --- |
| `radius-sm` | 6px | Badges, chips |
| `radius-md` | 8px | Inputs, botões |
| `radius-lg` | 12px | Cards, modais |
| `radius-xl` | 16px | Logo container, cards hero |
| `shadow-card` | `0 1px 3px rgba(0,0,0,0.08)` | Cards e tabelas |
| `shadow-elevated` | `0 4px 12px rgba(0,0,0,0.1)` | Dropdowns, modais |

---

## Componentes Base

### Botões

| Variante | Estilo |
| -------- | ------ |
| Primary | Fundo `brand-blue`, texto branco, full-width em forms |
| Secondary | Borda `surface-border`, fundo branco |
| Ghost | Sem borda, texto `brand-blue` |
| Destructive | Fundo vermelho suave (raro no MVP) |

### Inputs

- Borda `surface-border`, radius `radius-md`
- Focus ring azul (`brand-blue` com opacidade)
- Labels acima do campo
- Placeholder em `text-muted`

### Cards

- Fundo branco, radius `radius-lg`, `shadow-card`
- Padding interno 24px
- Header opcional com título `heading-md`

### Badges de Status

- Pill shape (`radius-sm` full)
- Cores da tabela de status acima
- Texto `body-sm` weight 500

### Sidebar (Painel)

- Fundo `brand-navy`, largura 240px (desktop)
- Itens: ícone line + label branco
- Item ativo: background `rgba(255,255,255,0.1)` + borda esquerda azul
- Logo no topo com ícone + "Agenda Fix"

**Itens MVP (sidebar):**

| Item | Rota | MVP |
| ---- | ---- | --- |
| Dashboard | `/dashboard` | ✅ (listagem + resumo simples) |
| Ordens de Serviço | `/dashboard/ordens` | ✅ |
| Nova OS | `/dashboard/nova` | ✅ |
| Clientes | — | ❌ Milestone futuro |
| Equipamentos | — | ❌ Milestone futuro |
| Relatórios | — | ❌ Milestone futuro |
| Usuários | — | ❌ Milestone futuro |
| Configurações | `/dashboard/configuracoes` | ⚠️ Mínimo (logout/perfil) |

Itens futuros aparecem desabilitados ou ocultos no MVP — não implementar até milestone correspondente.

### Top Bar (Painel)

- Fundo branco, borda inferior sutil
- Breadcrumb ou título da página
- Direita: sino (placeholder MVP), avatar + nome assistência + "Administrador"

---

## Telas de Referência (Mockup)

### Login — split screen

```
┌──────────────────┬──────────────────┐
│  NAVY            │  BRANCO          │
│  Logo + tagline  │  "Bem-vindo      │
│  Ilustração      │   de volta!"     │
│  laptop/phone    │  Email           │
│                  │  Senha           │
│                  │  ☐ Lembrar       │
│                  │  [ Entrar ]      │
└──────────────────┴──────────────────┘
```

- Esquerda: `brand-navy`, logo, tagline, ilustração decorativa
- Direita: formulário centralizado, botão "Entrar" full-width azul
- Link "Esqueceu a senha?" abaixo da senha

### Dashboard (MVP simplificado)

Mockup mostra cards de métricas e gráfico donut — **fora do escopo MVP** (ver ROADMAP Milestone 4). No MVP, `/dashboard` exibe:

- Título "Ordens de Serviço"
- Tabs de filtro por status
- Barra de busca
- Tabela de ordens recentes

Cards de métricas e donut chart: adicionar quando feature "Dashboard de Indicadores" for implementada.

### Nova OS — formulário em seções

Seções com título `heading-lg`:

1. **Dados do Cliente** — Nome, Telefone (ícone WhatsApp decorativo ao lado)
2. **Dados do Equipamento** — Tipo (select), Marca (select), Modelo, Defeito relatado (textarea)
3. **Informações da OS** — Número da OS, Data de entrada (date picker, preenchida automaticamente)

Footer: botões "Cancelar" (secondary) + "Salvar OS" (primary).

### Listagem de Ordens

- Tabs: Todas | Em andamento | Pronto para retirada | Entregue
- Search: "Buscar cliente, OS ou equipamento..."
- Tabela: OS, Cliente, Equipamento, Status (badge), Data entrada, Previsão (campo futuro — oculto no MVP se não houver dado)

### Detalhe da OS (Painel)

- Header: número OS + badge status atual
- **Stepper horizontal** — 6 etapas do fluxo
- Card info: cliente, equipamento, defeito
- **Observações** — textarea + botão "Adicionar observação"
- **Atualizar status** — botões para próximos status válidos
- **Histórico de atualizações** — timeline vertical com timestamp e responsável

### Portal do Cliente — "Acompanhe seu serviço"

- **Header azul** (`brand-blue`) com campo "Digite o número da sua OS" (página `/consultar`)
- Card branco centralizado com:
  - Nome assistência + número OS
  - Timeline vertical de progresso
  - Seção "Mensagem da assistência"
- **Footer:** telefone/WhatsApp da assistência + botão WhatsApp verde

Layout mobile-first; header azul full-width no topo.

---

## Tailwind Config (referência)

```typescript
// tailwind.config.ts — extend theme
colors: {
  brand: {
    navy: '#0F172A',
    blue: '#2563EB',
    'blue-hover': '#1D4ED8',
    'blue-light': '#EFF6FF',
  },
  surface: {
    page: '#F8F9FA',
    card: '#FFFFFF',
    border: '#E2E8F0',
  },
}
```

Implementar via CSS variables em `globals.css` para compatibilidade com shadcn/ui:

```css
:root {
  --brand-navy: 222 47% 11%;
  --brand-blue: 217 91% 53%;
  --background: 210 20% 98%;
  --foreground: 222 47% 11%;
  --primary: 217 91% 53%;
  --primary-foreground: 0 0% 100%;
}
```

---

## Ícones

Biblioteca: **Lucide React** (line icons, consistente com mockup)

Ícones recorrentes: `Wrench`, `LayoutDashboard`, `ClipboardList`, `Plus`, `Users`, `Settings`, `Bell`, `Search`, `Copy`, `MessageSquare`, `Phone`

---

## Assets

| Arquivo | Descrição |
| ------- | --------- |
| `.specs/project/references/mockup-ui.png` | Mockup completo aprovado |
| `public/logo.svg` | Logo Agenda Fix (a criar na implementação) |
| `public/login-illustration.svg` | Ilustração login (a criar ou placeholder) |
