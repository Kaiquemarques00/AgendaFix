# Agenda Fix

**Vision:** Plataforma que permite assistências técnicas compartilharem o andamento de reparos com clientes em tempo real, transformando o acompanhamento de manutenção em uma experiência semelhante ao rastreamento de encomendas.

**For:** Assistências técnicas e oficinas de manutenção de eletrônicos (smartphones, notebooks, tablets, videogames) e seus clientes finais.

**Solves:** Falta de transparência no processo de reparo, que gera alto volume de ligações/mensagens, interrupções na rotina dos técnicos, ansiedade do cliente e experiência de atendimento inconsistente.

---

## Goals

- Reduzir em pelo menos 50% as ligações/mensagens de clientes solicitando atualizações sobre reparos em andamento (medido após 30 dias de uso piloto)
- Permitir que o cliente consulte o status de uma ordem de serviço em menos de 30 segundos, sem precisar entrar em contato com a assistência
- Oferecer painel operacional simples o suficiente para que técnicos atualizem o status em menos de 1 minuto por ordem

---

## Tech Stack

**Status:** ✅ Confirmado — ver AD-001, AD-004 em `.specs/project/STATE.md`

**Core:**

- Framework: Next.js 15 (App Router)
- Language: TypeScript 5.x
- Hosting: Vercel
- Database: PostgreSQL via Supabase Cloud
- Auth: Supabase Auth (painel da assistência)
- Realtime: Supabase Realtime (atualizações instantâneas no portal do cliente)

**Key dependencies:**

- `@supabase/supabase-js` — cliente e queries
- `@supabase/ssr` — autenticação server-side
- Tailwind CSS + shadcn/ui — interface consistente e responsiva
- Lucide React — ícones line
- Zod — validação de formulários e API
- date-fns — formatação de datas em pt-BR

---

## Design & Brand

**Nome:** Agenda Fix (`agendafix`)

**Identidade visual:** Mockup aprovado — ver `.specs/project/DESIGN-SYSTEM.md` e `.specs/project/references/mockup-ui.png`

Paleta principal: navy (`#0F172A`) + azul ação (`#2563EB`) + fundo claro (`#F8F9FA`). Tipografia Inter. Componentes com bordas arredondadas e sombras sutis.

---

## Deployment

| Ambiente | Hosting | Backend | URL (interino) |
| -------- | ------- | ------- | -------------- |
| Produção | Vercel | Supabase Cloud (projeto prod) | `agendafix.vercel.app` → domínio customizado futuro |
| Staging | Vercel (projeto separado) | Supabase Cloud (projeto staging) | `agendafix-staging.vercel.app` → domínio staging futuro |
| Preview | Vercel (por PR) | Supabase staging ou branch DB | `*.vercel.app` automático |

Domínios customizados serão configurados na Vercel quando registrados.

---

## Scope

**v1 (MVP) includes:**

- Painel da assistência com cadastro de ordens de serviço (cliente, equipamento, defeito, número da OS)
- Fluxo de status: Recebido → Em análise → Em reparo → Aguardando peça → Pronto para retirada → Entregue
- Histórico de atualizações e observações técnicas visíveis ao cliente
- Portal do cliente com consulta por número da OS ou link compartilhado
- Acompanhamento em tempo real do status e linha do tempo de progresso
- UI conforme mockup (login split, sidebar navy, portal com header azul)

**Explicitly out of scope (v1):**

- Notificações automáticas (WhatsApp, SMS, e-mail, push)
- Upload de documentos (laudos, orçamentos, fotos)
- Avaliação do atendimento pós-serviço
- Gestão de múltiplos técnicos/usuários por assistência
- Dashboard de indicadores e métricas (cards + gráfico donut do mockup)
- Menus futuros: Clientes, Equipamentos, Relatórios, Usuários
- Inteligência artificial para diagnóstico ou estimativa de prazos
- Plataforma multiempresa SaaS

---

## Constraints

- Timeline: Não definido — MVP entregável incrementalmente por feature
- Technical: Mobile-first no portal; painel responsivo em tablet/desktop; portal sem login
- Resources: Projeto greenfield — documentação em `.specs/` como fonte de verdade

---

## Personas

### Técnico / Atendente da Assistência

Registra ordens de serviço, atualiza status e adiciona observações. Precisa de fluxo rápido, sem interrupções.

### Cliente Final

Entrega o equipamento e quer saber o andamento sem ligar ou mandar mensagem. Acessa pelo celular, muitas vezes via link enviado pela assistência.

---

## Diferenciais do Produto

| Diferencial | Descrição |
| ----------- | --------- |
| Transparência | Cliente acompanha todo o processo sem contato |
| Redução de interrupções | Menos ligações e mensagens para a oficina |
| Experiência do cliente | Maior confiança durante o reparo |
| Fácil implementação | Sem integrações complexas para começar |
