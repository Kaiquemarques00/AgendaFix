import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseEnv } from "@/lib/supabase/env";

/** Cliente anon para portal — envia token público no header exigido pelas policies RLS. */
export function createPublicClient(publicToken: string) {
  const { url, anonKey } = getSupabaseEnv();

  return createBrowserClient(url, anonKey, {
    global: {
      headers: {
        "x-public-token": publicToken,
      },
    },
  });
}
