import { NextResponse } from "next/server";

import { isValidPublicToken } from "@/app/api/public/orders/[token]/route";
import { createPublicRealtimeToken } from "@/lib/public/realtime-token";

const NOT_FOUND_BODY = { error: "Ordem não encontrada" };

export async function GET(
  _request: Request,
  context: { params: Promise<{ token: string }> }
) {
  const { token } = await context.params;

  if (!isValidPublicToken(token)) {
    return NextResponse.json(NOT_FOUND_BODY, { status: 404 });
  }

  try {
    const accessToken = await createPublicRealtimeToken(token);
    return NextResponse.json({ accessToken });
  } catch {
    return NextResponse.json(
      { error: "Realtime indisponível" },
      { status: 503 }
    );
  }
}
