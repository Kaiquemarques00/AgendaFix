# Painel da Assistência — Specification

## Problem Statement

Técnicos e atendentes precisam de uma interface operacional rápida para registrar ordens, acompanhar fila de reparos e atualizar status sem interromper o fluxo de trabalho. O painel é o ponto de entrada diário da assistência no Agenda Fix.

## Goals

- [ ] Atendente registra nova ordem em menos de 2 minutos pelo formulário
- [ ] Técnico identifica ordens por status e atualiza com no máximo 2 cliques
- [ ] Link de acompanhamento copiável em 1 clique para enviar ao cliente
- [ ] Interface responsiva funcional em tablet e desktop

## Out of Scope

| Feature | Reason |
| ------- | ------ |
| App mobile nativo | Web responsiva suficiente para MVP |
| Impressão de ordem de serviço | Milestone futuro |
| Busca avançada / filtros complexos | MVP: filtro por status apenas |
| Edição de ordem após criação | MVP: apenas status e notas |
| Gestão de múltiplos usuários | Milestone 4 |

---

## User Stories

### P1: Login e Acesso ao Painel ⭐ MVP

**User Story**: Como atendente, quero acessar o painel após login para gerenciar ordens da minha assistência.

**Why P1**: Pré-requisito de todas as operações.

**Acceptance Criteria**:

1. WHEN atendente acessa `/dashboard` autenticado THEN sistema SHALL exibir listagem de ordens
2. WHEN sessão expira THEN sistema SHALL redirecionar ao login
3. WHEN atendente faz logout THEN sistema SHALL retornar à tela de login

**Independent Test**: Login → dashboard visível → logout → dashboard bloqueado.

---

### P1: Cadastro de Ordem via Formulário ⭐ MVP

**User Story**: Como atendente, quero preencher um formulário simples para registrar nova ordem de serviço.

**Why P1**: Entrada principal de dados.

**Acceptance Criteria**:

1. WHEN formulário é submetido com dados válidos THEN sistema SHALL criar ordem e exibir confirmação com link copiável
2. WHEN campo obrigatório está vazio THEN sistema SHALL destacar campo e impedir submit
3. WHEN número da OS já existe THEN sistema SHALL exibir erro inline
4. WHEN ordem é criada THEN sistema SHALL redirecionar para detalhe da ordem ou listagem atualizada

**Independent Test**: Preencher formulário completo; verificar ordem na listagem.

---

### P1: Listagem de Ordens com Filtro ⭐ MVP

**User Story**: Como técnico, quero ver todas as ordens e filtrar por status para priorizar trabalho.

**Why P1**: Visão operacional do dia a dia.

**Acceptance Criteria**:

1. WHEN painel carrega THEN sistema SHALL listar ordens da assistência ordenadas por updated_at desc
2. WHEN filtro de status é selecionado THEN listagem SHALL mostrar apenas ordens daquele status
3. WHEN não há ordens THEN sistema SHALL exibir estado vazio com CTA "Nova ordem"
4. WHEN listagem exibe ordem THEN SHALL mostrar: número OS, cliente, equipamento, status (badge colorido), data

**Independent Test**: Criar 3 ordens em status diferentes; filtrar por "Em reparo".

---

### P1: Atualização Rápida de Status ⭐ MVP

**User Story**: Como técnico, quero alterar o status de uma ordem diretamente na tela de detalhe.

**Why P1**: Ação mais frequente no painel.

**Acceptance Criteria**:

1. WHEN técnico abre detalhe da ordem THEN sistema SHALL exibir status atual e botões/opções para próximos status válidos
2. WHEN técnico seleciona novo status THEN sistema SHALL atualizar imediatamente com feedback visual (loading → success)
3. WHEN transição é inválida THEN botão SHALL estar desabilitado ou oculto
4. WHEN status muda THEN histórico na mesma tela SHALL atualizar sem reload completo

**Independent Test**: Abrir ordem "Recebido"; avançar para "Em análise"; ver histórico atualizado.

---

### P1: Adicionar Observação Técnica ⭐ MVP

**User Story**: Como técnico, quero escrever uma mensagem para o cliente na tela da ordem.

**Why P1**: Comunicação sem sair do painel.

**Acceptance Criteria**:

1. WHEN técnico digita observação e confirma THEN sistema SHALL adicionar à lista de observações com timestamp
2. WHEN observação é adicionada THEN campo SHALL limpar e lista atualizar
3. WHEN observação excede limite THEN sistema SHALL mostrar contador e bloquear submit

**Independent Test**: Adicionar observação; verificar no portal do cliente.

---

### P1: Copiar Link de Acompanhamento ⭐ MVP

**User Story**: Como atendente, quero copiar o link da ordem para enviar ao cliente via WhatsApp.

**Why P1**: Distribuição do acompanhamento.

**Acceptance Criteria**:

1. WHEN atendente clica "Copiar link" THEN URL completa SHALL ir para clipboard
2. WHEN cópia é bem-sucedida THEN sistema SHALL exibir toast "Link copiado!"
3. WHEN link é exibido THEN SHALL mostrar URL legível `{dominio}/acompanhar/{token}`

**Independent Test**: Copiar link; colar em nova aba anônima; portal carrega.

---

### P2: Dashboard Resumo

**User Story**: Como gerente, quero ver contagem de ordens por status na home do painel.

**Why P2**: Nice-to-have operacional; listagem cobre MVP.

**Acceptance Criteria**:

1. WHEN painel carrega THEN cards SHALL mostrar contagem por status
2. WHEN card é clicado THEN filtro correspondente SHALL ser aplicado

**Independent Test**: Verificar contagens batem com ordens reais.

---

## Edge Cases

- WHEN listagem tem 100+ ordens THEN sistema SHALL paginar (20 por página)
- WHEN conexão falha no submit THEN sistema SHALL exibir erro e preservar dados do formulário
- WHEN ordem está "Entregue" THEN ações de status SHALL mostrar apenas opções de correção permitidas
- WHEN viewport é mobile (<768px) THEN layout SHALL empilhar colunas mantendo usabilidade

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| -------------- | ----- | ----- | ------ |
| PAINEL-01 | P1: Login | Design | Pending |
| PAINEL-02 | P1: Cadastro | Design | Pending |
| PAINEL-03 | P1: Listagem | Design | Pending |
| PAINEL-04 | P1: Status | Design | Pending |
| PAINEL-05 | P1: Observações | Design | Pending |
| PAINEL-06 | P1: Copiar Link | Design | Pending |
| PAINEL-07 | P2: Dashboard | - | Pending |

**Coverage:** 7 total, 0 mapped to tasks, 7 unmapped ⚠️

---

## Success Criteria

- [ ] Fluxo completo (criar → atualizar status → copiar link) em < 3 minutos
- [ ] Painel utilizável em tablet 768px sem scroll horizontal
- [ ] Zero ações disponíveis para ordens de outra assistência
