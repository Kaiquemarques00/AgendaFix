# AgendaFix

## Visão geral
AgendaFix é uma plataforma web simples para pequenas assistências técnicas gerenciarem ordens de serviço e compartilharem o status de reparos com clientes através de um link público.

---

## Problema

Pequenas assistências técnicas controlam reparos de forma desorganizada (WhatsApp, papel, memória), o que gera:

- perda de controle sobre ordens de serviço
- dificuldade de acompanhar status
- clientes perguntando constantemente sobre andamento
- falta de histórico de atendimentos

---

## Solução

Uma plataforma que permite:

- registrar ordens de serviço
- atualizar status do reparo
- compartilhar um link público para o cliente acompanhar

---

## Público-alvo

- assistências técnicas pequenas (1–5 pessoas)
- foco em:
  - conserto de celulares
  - notebooks
  - eletrônicos em geral

---

## Usuários

### Técnico / Dono
- cria ordens de serviço
- atualiza status
- gerencia atendimentos

### Cliente
- acessa link público
- acompanha status do reparo

---

## Escopo do MVP

### Inclui

- autenticação de usuário (login)
- onboarding inicial do negócio
- criação de ordem de serviço
- listagem de ordens
- visualização de detalhes
- atualização de status
- geração de link público
- página pública de status

---

### Não inclui (fora de escopo)

- pagamentos
- planos (free/pro)
- integração com WhatsApp
- notificações automáticas
- múltiplos usuários por empresa
- relatórios avançados
- IA

---

## Fluxos principais

### Fluxo do técnico

1. login
2. acessar dashboard
3. criar ordem de serviço
4. atualizar status
5. copiar link público
6. enviar link para cliente

---

### Fluxo do cliente

1. receber link
2. acessar página pública
3. visualizar status e previsão

---

## Critérios de sucesso do MVP

O MVP é considerado funcional quando:

- é possível criar uma ordem de serviço com dados básicos
- é possível atualizar o status da ordem
- o cliente consegue visualizar o status via link público
- os dados persistem corretamente no banco

---

## Princípios do produto

- simplicidade acima de tudo
- foco em resolver o problema principal
- evitar features desnecessárias no MVP
- interface clara e direta