# Agenda Fix

Plataforma de acompanhamento de serviços para assistências técnicas.

## Setup rápido

1. Clone o repositório e instale dependências:

```bash
npm install
```

2. Copie variáveis de ambiente:

```bash
cp .env.example .env.local
```

Preencha `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` e `SUPABASE_SERVICE_ROLE_KEY` (dashboard Supabase → Project Settings → API).

3. Aplique migrations:

```bash
npx supabase login
npx supabase link --project-ref <seu-project-ref>
npx supabase db push
```

4. Popule dados de desenvolvimento:

```bash
npm run seed
```

Credenciais padrão do seed:

- E-mail: `admin@agendafix.dev`
- Senha: `AgendaFix@dev2026`

5. Inicie o app:

```bash
npm run dev
```

Acesse http://localhost:3000 → login → `/dashboard`.

## Scripts

| Comando        | Descrição                          |
| -------------- | ---------------------------------- |
| `npm run dev`  | Servidor de desenvolvimento        |
| `npm run build`| Build de produção                  |
| `npm run test` | Testes unitários (Vitest)          |
| `npm run seed` | Seed idempotente (admin + 3 OS)    |

## Seed alternativo (SQL)

`supabase/seed.sql` roda automaticamente em `npx supabase db reset`. Para só dados de tabelas (sem usuário Auth), execute no SQL Editor. O usuário admin requer `npm run seed`.

## Documentação

Especificações em `.specs/` — ver `PROJECT.md` e `ROADMAP.md`.

Supabase: [supabase/README.md](./supabase/README.md)
