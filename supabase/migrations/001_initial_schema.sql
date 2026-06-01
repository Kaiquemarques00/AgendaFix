-- Agenda Fix — schema MVP (INFRA-03, INFRA-04, INFRA-05)

CREATE TYPE public.service_order_status AS ENUM (
  'received',
  'in_analysis',
  'in_repair',
  'waiting_parts',
  'ready_pickup',
  'delivered'
);

CREATE TYPE public.workshop_user_role AS ENUM (
  'admin',
  'technician'
);

CREATE TABLE public.workshops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.workshop_users (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  workshop_id uuid NOT NULL REFERENCES public.workshops (id) ON DELETE CASCADE,
  role public.workshop_user_role NOT NULL DEFAULT 'technician',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.service_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id uuid NOT NULL REFERENCES public.workshops (id) ON DELETE CASCADE,
  order_number text NOT NULL,
  public_token uuid NOT NULL DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  device text NOT NULL,
  brand text NOT NULL,
  model text NOT NULL,
  reported_issue text NOT NULL,
  status public.service_order_status NOT NULL DEFAULT 'received',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT service_orders_order_number_workshop_unique UNIQUE (workshop_id, order_number),
  CONSTRAINT service_orders_public_token_unique UNIQUE (public_token)
);

CREATE TABLE public.status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_order_id uuid NOT NULL REFERENCES public.service_orders (id) ON DELETE CASCADE,
  from_status public.service_order_status,
  to_status public.service_order_status NOT NULL,
  changed_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.order_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_order_id uuid NOT NULL REFERENCES public.service_orders (id) ON DELETE CASCADE,
  content text NOT NULL,
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX service_orders_workshop_id_status_idx
  ON public.service_orders (workshop_id, status);

CREATE INDEX service_orders_public_token_idx
  ON public.service_orders (public_token);

CREATE INDEX status_history_service_order_id_idx
  ON public.status_history (service_order_id);

CREATE INDEX order_notes_service_order_id_idx
  ON public.order_notes (service_order_id);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_service_order_public_token()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.public_token IS NULL THEN
    NEW.public_token := gen_random_uuid();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER workshops_set_updated_at
  BEFORE UPDATE ON public.workshops
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER service_orders_set_updated_at
  BEFORE UPDATE ON public.service_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER service_orders_set_public_token
  BEFORE INSERT ON public.service_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.set_service_order_public_token();
