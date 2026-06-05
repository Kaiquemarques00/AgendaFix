-- Realtime não repassa headers HTTP (x-public-token) no WebSocket.
-- Portal usa JWT customizado com claim public_token via realtime.setAuth().

CREATE OR REPLACE FUNCTION public.request_public_token()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(
    NULLIF(
      trim(
        coalesce(
          current_setting('request.headers', true)::json ->> 'x-public-token',
          ''
        )
      ),
      ''
    )::uuid,
    NULLIF(
      trim(coalesce((select auth.jwt() ->> 'public_token'), '')),
      ''
    )::uuid
  )
$$;
