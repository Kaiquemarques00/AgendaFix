# Roadmap

**Current Milestone:** MVP — Acompanhamento de Ordens de Serviço
**Status:** In Progress (backend concluído; UI painel + portal pendentes)

---

## Milestone 1: MVP

**Goal:** Assistência consegue registrar ordens, atualizar status e compartilhar link; cliente acompanha reparo em tempo real sem login.
**Target:** Primeira versão utilizável em ambiente piloto com uma assistência técnica

### Features

**Infraestrutura Base** — ✅ DONE

- Setup do projeto (Next.js + Supabase)
- Schema do banco de dados (assistências, ordens, histórico)
- Autenticação do painel da assistência
- Configuração de Realtime para portal do cliente

Spec: `.specs/features/infra-base/spec.md` · Tasks: `infra-base/tasks.md`

---

**Gestão de Ordens de Serviço** — ✅ DONE (backend)

- Server Actions: criar ordem, atualizar status, adicionar nota
- Máquina de estados + validação Zod
- Histórico (insert inicial + trigger em updates)
- API pública `GET /api/public/orders/[token]`
- Lookup por número da OS + últimos 4 dígitos do telefone
- Testes: 74 unit/integration (Vitest); verificação manual API + Realtime (2026-06-01)

Spec: `.specs/features/ordem-servico/spec.md` · Tasks: `ordem-servico/tasks.md`

_Nota: telas do painel que consomem as actions e rota `/acompanhar` ficam nas features seguintes._

---

**Painel da Assistência** — PLANNED

- Login da assistência
- Formulário de cadastro de ordem de serviço
- Listagem de ordens com filtro por status
- Atualização de status com um clique
- Campo de observações técnicas
- Copiar link de acompanhamento para o cliente

Spec: `.specs/features/painel-assistencia/spec.md`

---

**Portal do Cliente** — PLANNED

- Consulta por número da ordem de serviço
- Acesso via link compartilhado (token único)
- Visualização do status atual com indicador visual
- Linha do tempo com histórico de progresso
- Exibição de observações da assistência

Spec: `.specs/features/portal-cliente/spec.md`

---

## Milestone 2: Comunicação Proativa

**Goal:** Cliente recebe avisos automáticos quando o status muda, sem precisar consultar o portal.

### Features

**Notificações Automáticas** — PLANNED

- WhatsApp (via API)
- SMS
- E-mail
- Push notifications

---

## Milestone 3: Enriquecimento do Atendimento

**Goal:** Assistência compartilha documentos e coleta feedback dos clientes.

### Features

**Upload de Documentos** — PLANNED

- Laudos técnicos, orçamentos, garantias, fotos do equipamento

**Avaliação do Atendimento** — PLANNED

- Avaliação de qualidade, tempo de reparo e satisfação geral pós-entrega

---

## Milestone 4: Operação em Escala

**Goal:** Suportar equipes maiores e visibilidade gerencial.

### Features

**Gestão de Técnicos** — PLANNED

- Múltiplos usuários por assistência com papéis distintos

**Dashboard de Indicadores** — PLANNED

- Serviços em andamento, tempo médio de reparo, concluídos, avaliações

---

## Milestone 5: Plataforma SaaS

**Goal:** Múltiplas assistências em infraestrutura compartilhada com isolamento de dados.

### Features

**Multiempresa (SaaS)** — PLANNED

- Onboarding de novas assistências
- Planos e billing
- Isolamento multi-tenant

**Inteligência Artificial** — PLANNED

- Sugestão de causas de defeitos
- Estimativa de prazos de reparo
- Auxílio a diagnósticos técnicos

---

## Future Considerations

- Integração com sistemas de gestão já usados por oficinas (ERP, NF-e)
- App nativo mobile para assistências
- QR Code na ordem de serviço impressa para acesso rápido do cliente
- Modo offline no painel para assistências com internet instável
- White-label (marca personalizada por assistência)
