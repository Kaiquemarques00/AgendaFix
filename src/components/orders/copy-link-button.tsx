"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export const NOTE_MAX_LENGTH = 500;

export function buildPublicOrderUrl(publicToken: string, origin: string) {
  return `${origin.replace(/\/$/, "")}/acompanhar/${publicToken}`;
}

export type CopyLinkResult = "copied" | "fallback";

export async function copyPublicOrderLink(
  publicToken: string,
  origin: string
): Promise<CopyLinkResult> {
  const url = buildPublicOrderUrl(publicToken, origin);

  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(url);
      return "copied";
    } catch {
      return "fallback";
    }
  }

  return "fallback";
}

type CopyLinkButtonProps = {
  publicToken: string;
};

export function CopyLinkButton({ publicToken }: CopyLinkButtonProps) {
  const [origin, setOrigin] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showFallback, setShowFallback] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timeout = window.setTimeout(() => setToastMessage(null), 3000);
    return () => window.clearTimeout(timeout);
  }, [toastMessage]);

  const publicUrl = origin
    ? buildPublicOrderUrl(publicToken, origin)
    : `/acompanhar/${publicToken}`;

  async function handleCopy() {
    setIsCopying(true);
    setShowFallback(false);

    const result = await copyPublicOrderLink(
      publicToken,
      origin || window.location.origin
    );

    if (result === "copied") {
      setToastMessage("Link copiado!");
    } else {
      setShowFallback(true);
    }

    setIsCopying(false);
  }

  return (
    <div className="space-y-3">
      <p className="break-all text-sm font-medium text-[#0F172A]">{publicUrl}</p>
      <Button type="button" onClick={handleCopy} disabled={isCopying}>
        {isCopying ? "Copiando…" : "Copiar link"}
      </Button>

      {showFallback ? (
        <div className="rounded-lg border border-[#E2E8F0] bg-[#F8F9FA] p-3">
          <p className="mb-2 text-sm text-[#64748B]">
            Não foi possível copiar automaticamente. Selecione o link abaixo:
          </p>
          <input
            readOnly
            value={publicUrl}
            className="w-full rounded-lg border border-input bg-white px-2.5 py-2 text-sm"
            onFocus={(event) => event.target.select()}
          />
        </div>
      ) : null}

      {toastMessage ? (
        <div
          role="status"
          className="fixed right-6 bottom-6 z-50 rounded-lg bg-[#0F172A] px-4 py-3 text-sm font-medium text-white shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
        >
          {toastMessage}
        </div>
      ) : null}
    </div>
  );
}
