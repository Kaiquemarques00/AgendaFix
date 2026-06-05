import { SignJWT } from "jose";

const REALTIME_TOKEN_TTL = "1h";

export function getSupabaseJwtSecret(): string {
  const secret = process.env.SUPABASE_JWT_SECRET?.trim();

  if (!secret) {
    throw new Error(
      "SUPABASE_JWT_SECRET não configurado. Necessário para Realtime do portal. Veja .env.example."
    );
  }

  return secret;
}

export async function createPublicRealtimeToken(
  publicToken: string
): Promise<string> {
  const secret = new TextEncoder().encode(getSupabaseJwtSecret());

  return new SignJWT({
    role: "anon",
    public_token: publicToken,
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime(REALTIME_TOKEN_TTL)
    .sign(secret);
}
