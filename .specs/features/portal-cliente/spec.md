# Portal do Cliente — Specification

## Problem Statement

Clientes entregam equipamentos e ficam ansiosos sem saber o andamento. O portal público permite acompanhar o reparo como rastreamento de encomenda — sem login, acessível pelo celular, atualizado em tempo real.

## Goals

- [x] Cliente acessa status da ordem em menos de 30 segundos via link ou consulta
- [x] Interface mobile-first clara e tranquilizadora
- [x] Atualizações de status refletidas automaticamente sem recarregar página
- [x] Linha do tempo completa visível para entender progresso

## Out of Scope

| Feature | Reason |
| ------- | ------ |
| Login/cadastro de cliente | MVP usa token ou consulta por OS |
| Chat bidirecional | Apenas leitura de observações da assistência |
| Notificações push | Milestone 2 |
| Avaliação do serviço | Milestone 3 |
| Múltiplos idiomas | pt-BR apenas no MVP |

---

## User Stories

### P1: Acesso via Link Compartilhado ⭐ MVP

**User Story**: Como cliente, quero abrir o link enviado pela assistência e ver o status do meu reparo imediatamente.

**Why P1**: Fluxo principal de acesso.

**Acceptance Criteria**:

1. WHEN cliente acessa `/acompanhar/{token}` válido THEN sistema SHALL exibir status atual, dados do equipamento e linha do tempo
2. WHEN token é inválido THEN sistema SHALL exibir página "Ordem não encontrada" amigável
3. WHEN página carrega THEN sistema SHALL ser responsiva e legível em tela 375px (iPhone SE)
4. WHEN ordem está "Entregue" THEN portal SHALL indicar claramente que reparo foi concluído

**Independent Test**: Abrir link válido em mobile; verificar layout e dados.

---

### P1: Visualização do Status Atual ⭐ MVP

**User Story**: Como cliente, quero ver claramente em qual etapa está meu reparo.

**Why P1**: Informação mais importante.

**Acceptance Criteria**:

1. WHEN portal exibe ordem THEN status atual SHALL ser o elemento visual mais proeminente
2. WHEN status é exibido THEN SHALL usar label pt-BR e indicador visual (stepper ou progress bar)
3. WHEN status muda (via Realtime) THEN indicador SHALL atualizar sem reload
4. WHEN ordem está "Aguardando peça" THEN stepper SHALL indicar possível demora

**Independent Test**: Alterar status no painel; verificar atualização automática no portal.

---

### P1: Linha do Tempo de Progresso ⭐ MVP

**User Story**: Como cliente, quero ver histórico de todas as etapas para entender quanto tempo cada fase levou.

**Why P1**: Transparência e redução de ansiedade.

**Acceptance Criteria**:

1. WHEN ordem tem histórico THEN timeline SHALL listar eventos do mais recente ao mais antigo (ou vice-versa, consistente)
2. WHEN evento é exibido THEN SHALL mostrar status, data/hora formatada (dd/MM/yyyy HH:mm)
3. WHEN é o evento atual THEN SHALL estar destacado visualmente
4. WHEN histórico tem 1 evento apenas THEN timeline SHALL renderizar corretamente

**Independent Test**: Ordem com 4 eventos; verificar ordem e formatação.

---

### P1: Mensagens da Assistência ⭐ MVP

**User Story**: Como cliente, quero ler observações enviadas pelo técnico sobre meu aparelho.

**Why P1**: Comunicação proativa.

**Acceptance Criteria**:

1. WHEN ordem tem observações THEN portal SHALL exibi-las em ordem cronológica
2. WHEN nova observação é adicionada THEN portal SHALL atualizar via Realtime
3. WHEN não há observações THEN portal SHALL exibir "Nenhuma mensagem da assistência ainda"
4. WHEN observação é longa THEN texto SHALL quebrar corretamente sem overflow

**Independent Test**: Adicionar observação no painel; verificar aparição no portal.

---

### P2: Consulta por Número da OS ⭐ MVP (fallback)

**User Story**: Como cliente sem link, quero buscar minha ordem informando número da OS e telefone.

**Why P2**: Alternativa quando link se perde; requer ordem-servico T7.

**Acceptance Criteria**:

1. WHEN cliente acessa `/consultar` THEN sistema SHALL exibir formulário simples (número OS + 4 últimos dígitos telefone)
2. WHEN dados corretos THEN sistema SHALL redirecionar para `/acompanhar/{token}`
3. WHEN dados incorretos THEN sistema SHALL exibir "Ordem não encontrada. Verifique os dados."
4. WHEN formulário é submetido THEN botão SHALL mostrar loading state

**Independent Test**: Buscar ordem existente; redirecionar corretamente.

---

## Edge Cases

- WHEN conexão Realtime cai THEN portal SHALL reconectar e sincronizar estado
- WHEN cliente compartilha link THEN qualquer pessoa com link vê a ordem (comportamento esperado)
- WHEN ordem é muito antiga (>1 ano) THEN portal SHALL funcionar normalmente
- WHEN JavaScript desabilitado THEN página inicial carrega via SSR; Realtime degradado gracefully

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| -------------- | ----- | ----- | ------ |
| PORTAL-01 | P1: Link | T3, T5 | ✅ Verified |
| PORTAL-02 | P1: Status | T1, T5 | ✅ Verified |
| PORTAL-03 | P1: Timeline | T2 | ✅ Verified |
| PORTAL-04 | P1: Mensagens | T3 | ✅ Verified |
| PORTAL-05 | P1: Realtime | T4 | ✅ Verified |
| PORTAL-06 | P2: Consulta | T6 | ✅ Verified |

**Coverage:** 6 total, 6 verified ✅

---

## Success Criteria

- [x] Lighthouse mobile performance > 80 na página de acompanhamento _(validado manualmente 2026-06-05)_
- [x] Atualização Realtime percebida em < 3 segundos _(validado manualmente 2026-06-05)_
- [ ] Cliente não técnico entende status sem instruções (teste com 1 usuário) — único item pendente

## Known Deviations

| Item | Spec | Implementação | Motivo |
| ---- | ---- | --------------- | ------ |
| Mensagem de lookup inválido | "Ordem não encontrada. Verifique os dados." | "Não foi possível localizar a ordem. Verifique os dados informados." | Mensagem genérica definida em `ordem-servico` T7 (`lookupOrder`); evita enumeração |
| Footer WhatsApp/telefone assistência | design.md MVP | Não implementado | API pública não expõe dados da workshop; fora do escopo das tasks T1–T6 |
