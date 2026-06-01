-- Seed de desenvolvimento (INFRA-10) — idempotente
-- Workshop + 3 ordens. Usuário admin: rode `npm run seed` (scripts/seed.ts).

INSERT INTO public.workshops (id, name, phone)
VALUES (
  'a0000000-0000-4000-8000-000000000001',
  'Assistência Demo Agenda Fix',
  '11999990000'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  updated_at = now();

INSERT INTO public.service_orders (
  id,
  workshop_id,
  order_number,
  public_token,
  customer_name,
  customer_phone,
  device,
  brand,
  model,
  reported_issue,
  status
)
VALUES
  (
    'b0000000-0000-4000-8000-000000000001',
    'a0000000-0000-4000-8000-000000000001',
    'OS-2026-0001',
    'c0000000-0000-4000-8000-000000000001',
    'Maria Silva',
    '11988880001',
    'smartphone',
    'Samsung',
    'Galaxy A54',
    'Tela quebrada após queda',
    'received'
  ),
  (
    'b0000000-0000-4000-8000-000000000002',
    'a0000000-0000-4000-8000-000000000001',
    'OS-2026-0002',
    'c0000000-0000-4000-8000-000000000002',
    'João Santos',
    '11988880002',
    'notebook',
    'Dell',
    'Inspiron 15',
    'Não liga',
    'in_repair'
  ),
  (
    'b0000000-0000-4000-8000-000000000003',
    'a0000000-0000-4000-8000-000000000001',
    'OS-2026-0003',
    'c0000000-0000-4000-8000-000000000003',
    'Ana Costa',
    '11988880003',
    'smartphone',
    'Apple',
    'iPhone 13',
    'Bateria com baixa duração',
    'ready_pickup'
  )
ON CONFLICT (id) DO UPDATE SET
  customer_name = EXCLUDED.customer_name,
  customer_phone = EXCLUDED.customer_phone,
  device = EXCLUDED.device,
  brand = EXCLUDED.brand,
  model = EXCLUDED.model,
  reported_issue = EXCLUDED.reported_issue,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.status_history (
  id,
  service_order_id,
  from_status,
  to_status
)
VALUES
  (
    'd0000000-0000-4000-8000-000000000001',
    'b0000000-0000-4000-8000-000000000001',
    NULL,
    'received'
  ),
  (
    'd0000000-0000-4000-8000-000000000002',
    'b0000000-0000-4000-8000-000000000002',
    NULL,
    'received'
  ),
  (
    'd0000000-0000-4000-8000-000000000003',
    'b0000000-0000-4000-8000-000000000002',
    'received',
    'in_repair'
  ),
  (
    'd0000000-0000-4000-8000-000000000004',
    'b0000000-0000-4000-8000-000000000003',
    NULL,
    'received'
  ),
  (
    'd0000000-0000-4000-8000-000000000005',
    'b0000000-0000-4000-8000-000000000003',
    'received',
    'ready_pickup'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.order_notes (
  id,
  service_order_id,
  content
)
VALUES
  (
    'e0000000-0000-4000-8000-000000000001',
    'b0000000-0000-4000-8000-000000000002',
    'Aguardando peça da placa-mãe — previsão 3 dias úteis.'
  )
ON CONFLICT (id) DO NOTHING;
