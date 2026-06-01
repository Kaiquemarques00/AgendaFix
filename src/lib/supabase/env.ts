const REQUIRED_VARS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;

export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const missing = REQUIRED_VARS.filter((name) => {
    const value =
      name === "NEXT_PUBLIC_SUPABASE_URL" ? url : anonKey;
    return !value?.trim();
  });

  if (missing.length > 0) {
    throw new Error(
      `Supabase não configurado. Defina no .env.local: ${missing.join(", ")}. Veja .env.example.`
    );
  }

  return {
    url: url!,
    anonKey: anonKey!,
  };
}
