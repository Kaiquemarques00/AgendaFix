# Infraestrutura Base — Specification

## Problem Statement

O Agenda Fix é um projeto greenfield sem codebase existente. Antes de implementar qualquer funcionalidade de negócio, é necessário estabelecer a fundação técnica: estrutura do projeto, banco de dados, autenticação para o painel da assistência e capacidade de atualizações em tempo real para o portal do cliente.

## Goals

- [ ] Projeto inicializado com stack definida, lint, formatação e scripts de desenvolvimento funcionando
- [ ] Schema do banco criado com migrations versionadas e RLS configurado
- [ ] Assistência consegue fazer login no painel e sessão persiste entre recarregamentos
- [ ] Canal Realtime configurado para propagar mudanças de ordens ao portal do cliente

## Out of Scope

| Feature | Reason |
| ------- | ------ |
| Cadastro self-service de assistências | MVP assume setup manual ou seed inicial |
| CI/CD completo | Pode ser adicionado após MVP funcional |
| Multi-tenant avançado | Milestone futuro (SaaS) |
| Testes E2E automatizados | Definir estratégia de testes na implementação |

---

## User Stories

### P1: Setup do Projeto ⭐ MVP

**User Story**: Como desenvolvedor, quero um projeto Next.js configurado com TypeScript, Tailwind e Supabase para começar a implementar features de forma consistente.

**Why P1**: Bloqueia todas as outras features.

**Acceptance Criteria**:

1. WHEN o desenvolvedor executa `npm run dev` THEN o sistema SHALL iniciar servidor local sem erros
2. WHEN o desenvolvedor executa `npm run build` THEN o sistema SHALL compilar sem erros TypeScript
3. WHEN variáveis de ambiente estão ausentes THEN o sistema SHALL exibir mensagem clara indicando quais variáveis faltam
4. WHEN o projeto é clonado THEN o README SHALL documentar passos de setup em menos de 10 comandos

**Independent Test**: Clonar repo, configurar `.env.local`, rodar `dev` e `build` com sucesso.

---

### P1: Schema do Banco de Dados ⭐ MVP

**User Story**: Como sistema, quero tabelas para assistências, usuários, ordens de serviço e histórico para persistir dados do MVP.

**Why P1**: Domínio central depende do schema.

**Acceptance Criteria**:

1. WHEN migration é aplicada THEN o banco SHALL conter tabelas `workshops`, `service_orders`, `status_history`, `order_notes`
2. WHEN um usuário autenticado tenta acessar dados de outra assistência THEN RLS SHALL bloquear o acesso
3. WHEN uma ordem é criada THEN o sistema SHALL gerar `public_token` UUID único automaticamente
4. WHEN migration é revertida THEN o schema SHALL voltar ao estado anterior sem dados órfãos críticos

**Independent Test**: Aplicar migrations no Supabase local; inserir workshop e ordem via SQL; verificar constraints e RLS.

---

### P1: Autenticação do Painel ⭐ MVP

**User Story**: Como atendente da assistência, quero fazer login com e-mail e senha para acessar o painel de forma segura.

**Why P1**: Painel da assistência exige autenticação.

**Acceptance Criteria**:

1. WHEN credenciais válidas são enviadas THEN o sistema SHALL autenticar e redirecionar ao painel
2. WHEN credenciais inválidas são enviadas THEN o sistema SHALL exibir mensagem genérica de erro sem revelar se e-mail existe
3. WHEN usuário não autenticado acessa rota protegida THEN o sistema SHALL redirecionar para login
4. WHEN usuário faz logout THEN o sistema SHALL invalidar sessão e redirecionar para login

**Independent Test**: Login com usuário seed, acessar `/dashboard`, logout, tentar acessar dashboard novamente.

---

### P1: Realtime para Portal ⭐ MVP

**User Story**: Como cliente, quero ver atualizações de status sem recarregar a página quando a assistência altera a ordem.

**Why P1**: Diferencial central do produto ("tempo real").

**Acceptance Criteria**:

1. WHEN status de uma ordem muda THEN clientes inscritos no canal SHALL receber evento em menos de 3 segundos
2. WHEN cliente abre portal via link THEN o sistema SHALL inscrever-se no canal da ordem correspondente
3. WHEN conexão Realtime cai THEN o portal SHALL reconectar automaticamente e sincronizar estado atual

**Independent Test**: Abrir portal em duas abas; alterar status no painel; verificar atualização automática na aba do portal.

---

### P2: Seed de Desenvolvimento

**User Story**: Como desenvolvedor, quero dados de exemplo para testar o fluxo completo sem cadastrar manualmente a cada reset.

**Why P2**: Acelera desenvolvimento mas não bloqueia MVP.

**Acceptance Criteria**:

1. WHEN seed é executado THEN o banco SHALL conter 1 assistência, 1 usuário admin e 3 ordens em status diferentes
2. WHEN seed é executado novamente THEN o sistema SHALL ser idempotente (não duplicar dados)

**Independent Test**: Rodar seed duas vezes; verificar contagem de registros.

---

## Edge Cases

- WHEN Supabase está indisponível THEN painel SHALL exibir página de erro amigável, não stack trace
- WHEN token de sessão expira THEN usuário SHALL ser redirecionado ao login com mensagem informativa
- WHEN migration falha parcialmente THEN script SHALL abortar e documentar rollback
- WHEN `public_token` colide (extremamente improvável) THEN banco SHALL rejeitar insert por constraint UNIQUE

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| -------------- | ----- | ----- | ------ |
| INFRA-01 | P1: Setup do Projeto | Design | Pending |
| INFRA-02 | P1: Setup do Projeto | Design | Pending |
| INFRA-03 | P1: Schema do Banco | Design | Pending |
| INFRA-04 | P1: Schema do Banco | Design | Pending |
| INFRA-05 | P1: Schema do Banco | Design | Pending |
| INFRA-06 | P1: Autenticação | Design | Pending |
| INFRA-07 | P1: Autenticação | Design | Pending |
| INFRA-08 | P1: Realtime | Design | Pending |
| INFRA-09 | P1: Realtime | Design | Pending |
| INFRA-10 | P2: Seed | - | Pending |

**Coverage:** 10 total, 0 mapped to tasks, 10 unmapped ⚠️

---

## Success Criteria

- [ ] Setup completo documentado e reproduzível em máquina nova em < 15 minutos
- [ ] Zero vulnerabilidades de acesso cross-tenant em testes manuais de RLS
- [ ] Latência Realtime < 3s em ambiente de desenvolvimento local
