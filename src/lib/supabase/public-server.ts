import { createClient } from "@supabase/supabase-js";

import { getSupabaseEnv } from "@/lib/supabase/env";

/** Cliente anon para rotas/API server-side com header exigido pelas policies RLS. */
export function createPublicServerClient(publicToken: string) {
  const { url, anonKey } = getSupabaseEnv();

  return createClient(url, anonKey, {
    global: {
      headers: {
        "x-public-token": publicToken,
      },
    },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
