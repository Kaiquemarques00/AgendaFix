# Decisions (ADR) — AgendaFix

---

## ADR-001 — Stack com Next.js

### Decisão
Utilizar Next.js como framework principal (frontend + backend leve).

### Motivo
- reduzir complexidade operacional
- acelerar desenvolvimento do MVP
- evitar manter backend separado inicialmente

### Alternativas consideradas
- React + Vite + API separada
- Node.js + Express/Fastify
- Firebase

### Trade-offs
- menor separação explícita de backend
- possível acoplamento se mal estruturado

---

## ADR-002 — Uso de Supabase

### Decisão
Utilizar Supabase para banco de dados e autenticação.

### Motivo
- acelera desenvolvimento
- reduz necessidade de configurar backend
- oferece auth pronto

### Trade-offs
- dependência de plataforma
- necessidade de configurar corretamente RLS

---

## ADR-003 — Link público via token

### Decisão
Cada ordem terá um public_token aleatório para acesso público.

### Motivo
- evitar exposição de IDs sequenciais
- permitir acesso simples para o cliente

### Alternativas
- usar ID da ordem
- exigir login do cliente

### Riscos
- acesso público não autenticado

### Mitigação
- não expor dados sensíveis
- usar tokens não previsíveis

---

## ADR-004 — Escopo reduzido do MVP

### Decisão
Limitar o MVP a gestão de ordens e visualização de status.

### Motivo
- foco em validação rápida
- evitar complexidade desnecessária

### Fora de escopo
- IA
- pagamentos
- automações
- relatórios

---

## ADR-005 — Separação via Services

### Decisão
Toda lógica de negócio deve ser implementada em arquivos de service (/server).

### Motivo
- evitar lógica espalhada no frontend
- facilitar manutenção
- manter organização clara

### Regra
Componentes não devem acessar diretamente o banco