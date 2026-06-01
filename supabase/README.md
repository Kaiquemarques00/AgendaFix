# Supabase — migrations

## Aplicar no projeto cloud

1. Instale e autentique o CLI:

```bash
npx supabase login
```

2. Vincule o projeto (ref está na URL do dashboard: `https://<project-ref>.supabase.co`):

```bash
npx supabase link --project-ref <project-ref>
```

3. Envie as migrations:

```bash
npx supabase db push
```

## Alternativa: SQL Editor

Execute na ordem, no dashboard Supabase → SQL:

1. `migrations/001_initial_schema.sql`
2. `migrations/002_rls_policies.sql`

## Auth (painel)

No dashboard: **Authentication → Providers → Email** habilitado.

Crie um usuário em **Authentication → Users**, depois associe em SQL:

```sql
INSERT INTO public.workshops (name, phone) VALUES ('Minha Oficina', '11999999999');

INSERT INTO public.workshop_users (id, workshop_id, role)
VALUES (
  '<auth-user-uuid>',
  '<workshop-uuid>',
  'admin'
);
```

## RLS

Verificação manual: [RLS_MANUAL_TEST.md](./RLS_MANUAL_TEST.md)

Portal anônimo: use `createPublicClient(token)` em `src/lib/supabase/public-client.ts` (header `x-public-token`).

## Seed de desenvolvimento

```bash
npm run seed
```

Ou, com Supabase local:

```bash
npx supabase db reset   # migrations + supabase/seed.sql
npm run seed            # cria usuário Auth admin + workshop_users
```

Variáveis opcionais: `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`.

## Realtime

Migration `003_enable_realtime.sql` adiciona tabelas à publication `supabase_realtime`.

Hook: `useOrderSubscription` em `src/hooks/use-order-subscription.ts`.
