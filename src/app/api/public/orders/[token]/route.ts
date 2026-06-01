import { NextResponse } from "next/server";

import { getPublicOrderByToken } from "@/lib/public/order-details";
import { createPublicServerClient } from "@/lib/supabase/public-server";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const NOT_FOUND_BODY = { error: "Ordem não encontrada" };

export function isValidPublicToken(token: string): boolean {
  return UUID_REGEX.test(token);
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ token: string }> }
) {
  const { token } = await context.params;

  if (!isValidPublicToken(token)) {
    return NextResponse.json(NOT_FOUND_BODY, { status: 404 });
  }

  try {
    const supabase = createPublicServerClient(token);
    const details = await getPublicOrderByToken(supabase);

    if (!details) {
      return NextResponse.json(NOT_FOUND_BODY, { status: 404 });
    }

    return NextResponse.json(details);
  } catch {
    return NextResponse.json(NOT_FOUND_BODY, { status: 404 });
  }
}
