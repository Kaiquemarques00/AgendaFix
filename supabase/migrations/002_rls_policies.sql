-- Agenda Fix — RLS (INFRA-04)
-- Manual verification: supabase/RLS_MANUAL_TEST.md

ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshop_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_notes ENABLE ROW LEVEL SECURITY;

-- Workshop do usuário autenticado (não usar user_metadata no JWT)
CREATE OR REPLACE FUNCTION public.auth_workshop_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT workshop_id
  FROM public.workshop_users
  WHERE id = auth.uid()
$$;

REVOKE ALL ON FUNCTION public.auth_workshop_id() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.auth_workshop_id() TO authenticated;

-- Token público informado pelo cliente (header PostgREST / supabase-js)
CREATE OR REPLACE FUNCTION public.request_public_token()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(
    trim(
      coalesce(
        current_setting('request.headers', true)::json ->> 'x-public-token',
        ''
      )
    ),
    ''
  )::uuid
$$;

CREATE OR REPLACE FUNCTION public.order_matches_public_token(order_token uuid)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT order_token IS NOT NULL
    AND order_token = public.request_public_token()
$$;

-- workshops
CREATE POLICY workshops_select_own
  ON public.workshops
  FOR SELECT
  TO authenticated
  USING (id = public.auth_workshop_id());

-- workshop_users
CREATE POLICY workshop_users_select_own
  ON public.workshop_users
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- service_orders — authenticated (CRUD na própria workshop)
CREATE POLICY service_orders_authenticated_select
  ON public.service_orders
  FOR SELECT
  TO authenticated
  USING (workshop_id = public.auth_workshop_id());

CREATE POLICY service_orders_authenticated_insert
  ON public.service_orders
  FOR INSERT
  TO authenticated
  WITH CHECK (workshop_id = public.auth_workshop_id());

CREATE POLICY service_orders_authenticated_update
  ON public.service_orders
  FOR UPDATE
  TO authenticated
  USING (workshop_id = public.auth_workshop_id())
  WITH CHECK (workshop_id = public.auth_workshop_id());

CREATE POLICY service_orders_authenticated_delete
  ON public.service_orders
  FOR DELETE
  TO authenticated
  USING (workshop_id = public.auth_workshop_id());

-- service_orders — anon (SELECT somente com x-public-token = public_token da linha)
CREATE POLICY service_orders_anon_select
  ON public.service_orders
  FOR SELECT
  TO anon
  USING (public.order_matches_public_token(public_token));

-- status_history — authenticated
CREATE POLICY status_history_authenticated_select
  ON public.status_history
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.service_orders so
      WHERE so.id = status_history.service_order_id
        AND so.workshop_id = public.auth_workshop_id()
    )
  );

CREATE POLICY status_history_authenticated_insert
  ON public.status_history
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.service_orders so
      WHERE so.id = status_history.service_order_id
        AND so.workshop_id = public.auth_workshop_id()
    )
  );

-- status_history — anon
CREATE POLICY status_history_anon_select
  ON public.status_history
  FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1
      FROM public.service_orders so
      WHERE so.id = status_history.service_order_id
        AND public.order_matches_public_token(so.public_token)
    )
  );

-- order_notes — authenticated
CREATE POLICY order_notes_authenticated_select
  ON public.order_notes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.service_orders so
      WHERE so.id = order_notes.service_order_id
        AND so.workshop_id = public.auth_workshop_id()
    )
  );

CREATE POLICY order_notes_authenticated_insert
  ON public.order_notes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.service_orders so
      WHERE so.id = order_notes.service_order_id
        AND so.workshop_id = public.auth_workshop_id()
    )
  );

CREATE POLICY order_notes_authenticated_update
  ON public.order_notes
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.service_orders so
      WHERE so.id = order_notes.service_order_id
        AND so.workshop_id = public.auth_workshop_id()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.service_orders so
      WHERE so.id = order_notes.service_order_id
        AND so.workshop_id = public.auth_workshop_id()
    )
  );

CREATE POLICY order_notes_authenticated_delete
  ON public.order_notes
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.service_orders so
      WHERE so.id = order_notes.service_order_id
        AND so.workshop_id = public.auth_workshop_id()
    )
  );

-- order_notes — anon
CREATE POLICY order_notes_anon_select
  ON public.order_notes
  FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1
      FROM public.service_orders so
      WHERE so.id = order_notes.service_order_id
        AND public.order_matches_public_token(so.public_token)
    )
  );
