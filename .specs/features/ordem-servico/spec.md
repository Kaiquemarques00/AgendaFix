# Gestão de Ordens de Serviço — Specification

## Problem Statement

O núcleo do Agenda Fix é o ciclo de vida de uma ordem de serviço: registro, transição de status, histórico auditável e comunicação via observações técnicas. Sem essa camada de domínio, painel e portal não têm dados para exibir ou atualizar.

## Goals

- [ ] Assistência consegue criar ordens com todos os campos do MVP em menos de 2 minutos
- [ ] Cada mudança de status gera registro automático no histórico com timestamp
- [ ] Link público único gerado por ordem permite acompanhamento sem login
- [ ] Transições de status respeitam regras de negócio definidas

## Out of Scope

| Feature | Reason |
| ------- | ------ |
| Numeração automática configurável por workshop | MVP usa sequência simples |
| Edição de ordem após entrega | Ordem entregue é imutável (exceto notas internas futuras) |
| Exclusão de ordens | Soft delete futuro; MVP mantém histórico |
| Orçamento e aprovação de valores | Milestone futuro |

---

## User Stories

### P1: Cadastro de Ordem de Serviço ⭐ MVP

**User Story**: Como atendente, quero registrar uma ordem de serviço com dados do cliente e equipamento para iniciar o acompanhamento.

**Why P1**: Entrada principal de dados no sistema.

**Acceptance Criteria**:

1. WHEN atendente preenche nome, telefone, equipamento, marca, modelo, defeito e número da OS THEN sistema SHALL persistir ordem com status "Recebido"
2. WHEN número da OS já existe na mesma assistência THEN sistema SHALL rejeitar com mensagem de duplicidade
3. WHEN ordem é criada THEN sistema SHALL gerar `public_token` e registrar evento inicial no histórico
4. WHEN campos obrigatórios estão vazios THEN sistema SHALL impedir submit e indicar campos faltantes

**Independent Test**: Criar ordem via API/action; verificar registro no banco e histórico com status "Recebido".

---

### P1: Atualização de Status ⭐ MVP

**User Story**: Como técnico, quero avançar o status da ordem conforme o reparo progride para manter o cliente informado.

**Why P1**: Funcionalidade central de transparência.

**Acceptance Criteria**:

1. WHEN técnico seleciona próximo status válido THEN sistema SHALL atualizar ordem e registrar histórico
2. WHEN técnico tenta transição inválida (ex.: Recebido → Entregue) THEN sistema SHALL bloquear e explicar transição permitida
3. WHEN status muda para "Entregue" THEN sistema SHALL marcar ordem como concluída (sem novas transições exceto retrocesso operacional documentado)
4. WHEN status muda THEN sistema SHALL emitir evento Realtime para portal inscrito

**Independent Test**: Percorrer fluxo completo Recebido → Entregue; verificar histórico com 6 entradas.

---

### P1: Histórico de Atualizações ⭐ MVP

**User Story**: Como cliente ou atendente, quero ver linha do tempo de todas as mudanças de status para entender a evolução do reparo.

**Why P1**: Transparência e confiança.

**Acceptance Criteria**:

1. WHEN ordem possui N mudanças de status THEN histórico SHALL listar N eventos ordenados cronologicamente
2. WHEN evento é exibido THEN SHALL mostrar status, data/hora formatada e duração desde evento anterior (opcional no portal)
3. WHEN ordem é consultada via token público THEN histórico SHALL ser acessível sem autenticação

**Independent Test**: Alterar status 3 vezes; consultar histórico e verificar ordem e contagem.

---

### P1: Observações Técnicas ⭐ MVP

**User Story**: Como técnico, quero adicionar mensagens simples à ordem para comunicar detalhes ao cliente (ex.: "Aguardando chegada da tela").

**Why P1**: Comunicação proativa sem ligação.

**Acceptance Criteria**:

1. WHEN técnico adiciona observação THEN sistema SHALL persistir com timestamp e exibir no portal
2. WHEN observação excede 500 caracteres THEN sistema SHALL rejeitar com limite indicado
3. WHEN observação é vazia THEN sistema SHALL impedir submit
4. WHEN cliente acessa portal THEN observações SHALL aparecer em ordem cronológica abaixo da linha do tempo

**Independent Test**: Adicionar 2 observações; verificar exibição no portal via token.

---

### P1: Link Público de Acompanhamento ⭐ MVP

**User Story**: Como atendente, quero copiar um link único para enviar ao cliente via WhatsApp.

**Why P1**: Principal canal de distribuição do acompanhamento.

**Acceptance Criteria**:

1. WHEN ordem é criada THEN sistema SHALL disponibilizar URL `{APP_URL}/acompanhar/{public_token}`
2. WHEN atendente clica "Copiar link" THEN sistema SHALL copiar URL para clipboard e confirmar visualmente
3. WHEN token é inválido THEN portal SHALL exibir "Ordem não encontrada" sem revelar se token existiu

**Independent Test**: Criar ordem, copiar link, abrir em aba anônima, verificar dados corretos.

---

### P2: Consulta por Número da OS

**User Story**: Como cliente, quero consultar minha ordem informando número da OS e telefone quando não tenho o link.

**Why P2**: Fallback útil; link compartilhado é fluxo principal do MVP.

**Acceptance Criteria**:

1. WHEN cliente informa número da OS e últimos 4 dígitos do telefone corretos THEN sistema SHALL redirecionar ao portal da ordem
2. WHEN combinação é inválida THEN sistema SHALL exibir erro genérico sem revelar qual campo está errado
3. WHEN múltiplas tentativas falham (>5 em 10 min) THEN sistema SHALL aplicar rate limit temporário

**Independent Test**: Buscar ordem existente com OS + telefone; tentar combinação errada.

---

## Edge Cases

- WHEN ordem está "Entregue" e técnico tenta mudar status THEN sistema SHALL permitir apenas retrocesso para "Pronto para retirada" (correção de erro)
- WHEN telefone é informado com/sem formatação THEN sistema SHALL normalizar antes de comparar
- WHEN duas abas do painel atualizam mesma ordem simultaneamente THEN última escrita prevalece (optimistic UI com refresh)
- WHEN ordem não tem observações THEN portal SHALL exibir seção vazia ou mensagem "Nenhuma observação ainda"

---

## Fluxo de Status (MVP)

```
Recebido → Em análise → Em reparo → Aguardando peça → Pronto para retirada → Entregue
                ↑              ↑              ↑
                └──────────────┴──────────────┘
                    (retrocesso permitido)
```

| De | Para (permitidos) |
| -- | ----------------- |
| Recebido | Em análise |
| Em análise | Em reparo, Recebido |
| Em reparo | Aguardando peça, Pronto para retirada, Em análise |
| Aguardando peça | Em reparo |
| Pronto para retirada | Entregue, Em reparo |
| Entregue | Pronto para retirada (correção) |

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| -------------- | ----- | ----- | ------ |
| OS-01 | P1: Cadastro | T2 | In Progress |
| OS-02 | P1: Cadastro | T3 | Pending |
| OS-03 | P1: Cadastro | T3 | Pending |
| OS-04 | P1: Atualização Status | T1, T4 | In Progress |
| OS-05 | P1: Atualização Status | T4 | Pending |
| OS-06 | P1: Histórico | Design | Pending |
| OS-07 | P1: Observações | Design | Pending |
| OS-08 | P1: Link Público | Design | Pending |
| OS-09 | P2: Consulta OS | - | Pending |

**Coverage:** 9 total, 0 mapped to tasks, 9 unmapped ⚠️

---

## Success Criteria

- [ ] Fluxo completo Recebido → Entregue executável em < 5 minutos no painel
- [ ] 100% das transições de status geram entrada no histórico
- [ ] Zero ordens acessíveis cross-tenant em testes de isolamento
