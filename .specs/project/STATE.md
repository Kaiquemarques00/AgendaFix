# State

**Last Updated:** 2026-06-01
**Current Work:** ordem-servico backend MVP concluído — próximo: painel-assistencia ou portal-cliente (UI)

---

## Recent Decisions (Last 60 days)

### AD-001: Stack para MVP ✅ Confirmado (2026-06-01)

**Decision:** Next.js 15 + TypeScript + Supabase (PostgreSQL, Auth, Realtime).
**Reason:** Stack moderna; Supabase cobre auth, banco e realtime; Next.js unifica painel e portal.
**Trade-off:** Vendor lock-in parcial no Supabase.
**Impact:** Todas as features de design assumem Supabase.

### AD-002: Portal do cliente sem autenticação ✅ Confirmado (2026-06-01)

**Decision:** Cliente acessa via link com token UUID; consulta por OS exige últimos 4 dígitos do telefone.
**Reason:** Baixa fricção; experiência tipo rastreamento de encomendas.
**Trade-off:** Segurança por obscuridade do token.
**Impact:** Links com UUID; lookup com segundo fator (telefone).

### AD-003: Fluxo de status com transições controladas ✅ Confirmado (2026-06-01)

**Decision:** Status linear com retrocesso limitado para correções operacionais.
**Reason:** Reflete fluxo real de oficinas.
**Trade-off:** Menos flexibilidade que status livre.
**Impact:** Máquina de estados em `ordem-servico/design.md`.

### AD-004: Deploy Vercel + Supabase Cloud ✅ Confirmado (2026-06-01)

**Decision:** Hosting na Vercel; banco, auth e realtime no Supabase Cloud (sem self-hosted no início).
**Reason:** Setup rápido, free tier generoso, integração nativa Next.js + Supabase.
**Trade-off:** Custos escalam com uso; dependência de dois vendors.
**Impact:**
- Produção: projeto Vercel + projeto Supabase dedicados
- Variáveis de ambiente via Vercel dashboard
- Migrations via Supabase CLI apontando para projeto cloud
- Preview deployments da Vercel para PRs (quando CI configurado)

### AD-005: Identidade visual do mockup ✅ Confirmado (2026-06-01)

**Decision:** Seguir mockup em `.specs/project/references/mockup-ui.png` como referência visual oficial.
**Reason:** Aprovado pelo responsável; cobre login, painel, formulários, detalhe OS e portal cliente.
**Trade-off:** Mockup inclui telas além do MVP (dashboard com gráficos, menu Clientes/Relatórios) — implementar apenas o que está no escopo MVP.
**Impact:** Design system documentado em `.specs/project/DESIGN-SYSTEM.md`; features de UI referenciam este doc.

### AD-006: Nome e staging ✅ Confirmado (2026-06-01)

**Decision:** Nome comercial permanece **Agenda Fix** (`agendafix`). Staging também na Vercel; domínio de staging será adquirido posteriormente na Vercel.
**Reason:** Nome já definido; sem domínio principal ainda — usar URLs `.vercel.app` até domínios customizados.
**Trade-off:** URLs temporárias menos profissionais até domínio.
**Impact:**
- **Produção (interino):** `agendafix.vercel.app` (ou similar)
- **Staging (interino):** `agendafix-staging.vercel.app` (projeto Vercel separado recomendado)
- **Supabase:** projeto separado para staging recomendado (evitar dados de dev em prod)
- Domínio customizado: registrar quando disponível; configurar DNS na Vercel

---

## Active Blockers

_Nenhum blocker ativo no momento._

---

## Lessons Learned

_Nenhuma lição registrada ainda — projeto greenfield._

---

## Quick Tasks Completed

| #   | Description                              | Date       | Commit | Status  |
| --- | ---------------------------------------- | ---------- | ------ | ------- |
| 001 | Documentação inicial TLC spec-driven     | 2026-06-01 | —      | ✅ Done |
| 002 | Confirmação ADs, deploy e design system  | 2026-06-01 | —      | ✅ Done |

---

## Deferred Ideas

- [ ] Notificações WhatsApp/SMS/e-mail/push — Captured during: MVP planning
- [ ] Upload de laudos, orçamentos, garantias e fotos — Captured during: MVP planning
- [ ] Avaliação pós-atendimento — Captured during: MVP planning
- [ ] Múltiplos técnicos por assistência — Captured during: MVP planning
- [ ] Dashboard de indicadores (cards + gráfico donut do mockup) — Captured during: design review
- [ ] Menu sidebar: Clientes, Equipamentos, Relatórios, Usuários — Captured during: design review
- [ ] IA para diagnóstico e estimativa de prazos — Captured during: MVP planning
- [ ] Plataforma multiempresa SaaS — Captured during: MVP planning

---

## Todos

- [ ] Criar projeto Supabase Cloud (prod + staging)
- [ ] Criar projetos Vercel (prod + staging) e conectar ao repo
- [ ] Registrar domínio principal (quando definido)
- [ ] Registrar domínio de staging na Vercel (quando definido)
- [x] Implementar infra-base Phase 1 (T1–T3: Next.js, shadcn, Supabase clients)
- [x] Implementar infra-base Phase 2 (T4–T6: schema, RLS, auth)
- [x] Aplicar migrations no Supabase Cloud (`supabase link` + `db push`)
- [x] Implementar infra-base Phase 3 (T7–T8: Realtime + seed)
- [x] Implementar ordem-servico Phase 1 (T1–T2: status machine + Zod schemas)
- [x] Implementar ordem-servico Phase 2 (T3–T5: Server Actions + trigger histórico)
- [x] Implementar ordem-servico Phase 3 (T6–T7: API pública + lookup)
- [ ] Aplicar migration `004_status_history_trigger.sql` no Supabase Cloud (`supabase db push`)

---

## Preferences

**Model Guidance Shown:** never
