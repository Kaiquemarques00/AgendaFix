/**
 * Seed completo: usuário admin Auth + workshop + ordens demo
 * Uso: npm run seed
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const WORKSHOP_ID = "a0000000-0000-4000-8000-000000000001";
const SEED_ADMIN_EMAIL =
  process.env.SEED_ADMIN_EMAIL ?? "admin@agendafix.dev";
const SEED_ADMIN_PASSWORD =
  process.env.SEED_ADMIN_PASSWORD ?? "AgendaFix@dev2026";

const ORDERS = [
  {
    id: "b0000000-0000-4000-8000-000000000001",
    order_number: "OS-2026-0001",
    public_token: "c0000000-0000-4000-8000-000000000001",
    customer_name: "Maria Silva",
    customer_phone: "11988880001",
    device: "smartphone",
    brand: "Samsung",
    model: "Galaxy A54",
    reported_issue: "Tela quebrada após queda",
    status: "received" as const,
  },
  {
    id: "b0000000-0000-4000-8000-000000000002",
    order_number: "OS-2026-0002",
    public_token: "c0000000-0000-4000-8000-000000000002",
    customer_name: "João Santos",
    customer_phone: "11988880002",
    device: "notebook",
    brand: "Dell",
    model: "Inspiron 15",
    reported_issue: "Não liga",
    status: "in_repair" as const,
  },
  {
    id: "b0000000-0000-4000-8000-000000000003",
    order_number: "OS-2026-0003",
    public_token: "c0000000-0000-4000-8000-000000000003",
    customer_name: "Ana Costa",
    customer_phone: "11988880003",
    device: "smartphone",
    brand: "Apple",
    model: "iPhone 13",
    reported_issue: "Bateria com baixa duração",
    status: "ready_pickup" as const,
  },
];

function loadEnvLocal() {
  try {
    const envPath = resolve(process.cwd(), ".env.local");
    const content = readFileSync(envPath, "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // .env.local opcional se vars já estiverem no ambiente
  }
}

async function main() {
  loadEnvLocal();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error(
      "Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY em .env.local"
    );
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: listData, error: listError } =
    await supabase.auth.admin.listUsers({ perPage: 1000 });

  if (listError) {
    console.error("Erro ao listar usuários:", listError.message);
    process.exit(1);
  }

  let userId = listData.users.find((u) => u.email === SEED_ADMIN_EMAIL)?.id;

  if (!userId) {
    const { data: created, error: createError } =
      await supabase.auth.admin.createUser({
        email: SEED_ADMIN_EMAIL,
        password: SEED_ADMIN_PASSWORD,
        email_confirm: true,
      });

    if (createError || !created.user) {
      console.error("Erro ao criar usuário admin:", createError?.message);
      process.exit(1);
    }

    userId = created.user.id;
    console.log(`Usuário criado: ${SEED_ADMIN_EMAIL}`);
  } else {
    console.log(`Usuário já existe: ${SEED_ADMIN_EMAIL}`);
  }

  const { error: workshopError } = await supabase.from("workshops").upsert(
    {
      id: WORKSHOP_ID,
      name: "Assistência Demo Agenda Fix",
      phone: "11999990000",
    },
    { onConflict: "id" }
  );

  if (workshopError) {
    console.error("Erro ao criar workshop:", workshopError.message);
    process.exit(1);
  }

  const { error: ordersError } = await supabase.from("service_orders").upsert(
    ORDERS.map((o) => ({
      ...o,
      workshop_id: WORKSHOP_ID,
    })),
    { onConflict: "id" }
  );

  if (ordersError) {
    console.error("Erro ao criar ordens:", ordersError.message);
    process.exit(1);
  }

  const { error: historyError } = await supabase.from("status_history").upsert(
    [
      {
        id: "d0000000-0000-4000-8000-000000000001",
        service_order_id: ORDERS[0].id,
        from_status: null,
        to_status: "received",
      },
      {
        id: "d0000000-0000-4000-8000-000000000002",
        service_order_id: ORDERS[1].id,
        from_status: null,
        to_status: "received",
      },
      {
        id: "d0000000-0000-4000-8000-000000000003",
        service_order_id: ORDERS[1].id,
        from_status: "received",
        to_status: "in_repair",
      },
      {
        id: "d0000000-0000-4000-8000-000000000004",
        service_order_id: ORDERS[2].id,
        from_status: null,
        to_status: "received",
      },
      {
        id: "d0000000-0000-4000-8000-000000000005",
        service_order_id: ORDERS[2].id,
        from_status: "received",
        to_status: "ready_pickup",
      },
    ],
    { onConflict: "id", ignoreDuplicates: true }
  );

  if (historyError) {
    console.error("Erro ao criar histórico:", historyError.message);
    process.exit(1);
  }

  const { error: notesError } = await supabase.from("order_notes").upsert(
    {
      id: "e0000000-0000-4000-8000-000000000001",
      service_order_id: ORDERS[1].id,
      content: "Aguardando peça da placa-mãe — previsão 3 dias úteis.",
    },
    { onConflict: "id", ignoreDuplicates: true }
  );

  if (notesError) {
    console.error("Erro ao criar notas:", notesError.message);
    process.exit(1);
  }

  const { error: linkError } = await supabase.from("workshop_users").upsert(
    {
      id: userId,
      workshop_id: WORKSHOP_ID,
      role: "admin",
    },
    { onConflict: "id" }
  );

  if (linkError) {
    console.error("Erro ao vincular workshop_users:", linkError.message);
    process.exit(1);
  }

  console.log("Seed concluído.");
  console.log(`  Login: ${SEED_ADMIN_EMAIL}`);
  console.log(`  Senha: ${SEED_ADMIN_PASSWORD}`);
  console.log(
    "  Portal (token): c0000000-0000-4000-8000-000000000001"
  );
}

main();
