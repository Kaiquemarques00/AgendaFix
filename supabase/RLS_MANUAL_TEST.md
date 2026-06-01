# RLS — verificação manual (T5)

Aplicar migrations antes (`supabase db push` ou SQL Editor no dashboard).

## Pré-requisitos

- 2 workshops (A e B), usuários auth A e B em `workshop_users`
- 1 ordem em cada workshop com `public_token` conhecido

## 1. Isolamento autenticado (workshop)

Como usuário A (JWT no SQL Editor ou app):

```sql
SELECT * FROM service_orders;
-- Deve retornar apenas ordens da workshop A
```

Como usuário A, tentar `UPDATE` ordem da workshop B → 0 linhas afetadas.

## 2. Anon — SELECT com token

No cliente ou REST, enviar header:

`x-public-token: <uuid-da-ordem>`

```sql
-- Role anon + header configurado no PostgREST
SELECT * FROM service_orders WHERE public_token = '<uuid>';
```

Sem header `x-public-token` correto → 0 linhas.

## 3. Anon — sem escrita

```sql
-- Como anon
INSERT INTO service_orders (...) VALUES (...);  -- deve falhar (policy)
UPDATE service_orders SET status = 'delivered' WHERE ...;  -- deve falhar
DELETE FROM service_orders WHERE ...;  -- deve falhar
```

## 4. Histórico e notas (anon)

Com header `x-public-token` válido:

```sql
SELECT * FROM status_history WHERE service_order_id = '<id-da-ordem>';
SELECT * FROM order_notes WHERE service_order_id = '<id-da-ordem>';
```

Com token de outra ordem → 0 linhas.
