# Arquitetura — AgendaFix

## Stack

- Frontend/Fullstack: Next.js (App Router)
- Linguagem: TypeScript
- Banco de dados: PostgreSQL (via Supabase)
- Autenticação: Supabase Auth
- Estilo: Tailwind CSS
- Componentes: shadcn/ui
- Deploy: Vercel

---

## Estrutura de pastas

/app
  /(auth)
  /dashboard
  /orders
  /status/[publicToken]

/components
  /ui
  /orders

/lib
  supabase.ts
  auth.ts
  validations.ts

/server
  orders-service.ts
  status-service.ts
  business-service.ts

/types
  order.ts
Modelo arquitetural

Separação em camadas:

Interface (UI)
páginas e componentes
não contém lógica de negócio complexa
Application / Services
orquestra regras de negócio
localizado em /server
Infrastructure
acesso ao banco (Supabase)
autenticação
APIs externas (futuro)
Regras de arquitetura
não colocar lógica de negócio diretamente em componentes
toda interação com banco deve passar por services
separar claramente UI de lógica
evitar acoplamento entre componentes e banco
Modelo de dados (inicial)
Tabela: repair_orders

Campos:

id
business_id
customer_name
customer_phone
device_type
device_model
reported_issue
technical_notes
status
estimated_delivery_date
public_token
created_at
updated_at
Status da ordem

Valores permitidos:

received
diagnosing
waiting_approval
in_repair
ready
delivered
cancelled
Segurança
usar public_token para acesso público (não usar ID sequencial)
nunca expor dados sensíveis na página pública
isolar dados por business_id
aplicar Row Level Security (RLS) no Supabase
Página pública

Rota:

/status/[publicToken]

Deve exibir apenas:

nome da assistência
aparelho
status
previsão
observação pública (se existir)
Fora de escopo técnico (MVP)
microserviços
filas (queues)
arquitetura distribuída
caching avançado
multi-tenant complexo

---