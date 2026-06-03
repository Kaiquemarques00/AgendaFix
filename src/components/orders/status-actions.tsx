"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { updateOrderStatus } from "@/lib/actions/orders";
import {
  getAllowedTransitions,
  getStatusLabel,
} from "@/lib/domain/status-machine";
import type { ServiceOrderStatus } from "@/types/database";

export function getStatusActionOptions(currentStatus: ServiceOrderStatus) {
  return getAllowedTransitions(currentStatus).map((status) => ({
    status,
    label: getStatusLabel(status),
  }));
}

type StatusActionsProps = {
  orderId: string;
  currentStatus: ServiceOrderStatus;
};

export function StatusActions({ orderId, currentStatus }: StatusActionsProps) {
  const router = useRouter();
  const [pendingStatus, setPendingStatus] = useState<ServiceOrderStatus | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const options = getStatusActionOptions(currentStatus);

  async function handleTransition(newStatus: ServiceOrderStatus) {
    setError(null);
    setPendingStatus(newStatus);

    const result = await updateOrderStatus(orderId, newStatus);

    if (!result.success) {
      setError(result.error);
      setPendingStatus(null);
      return;
    }

    router.refresh();
    setPendingStatus(null);
  }

  if (options.length === 0) {
    return (
      <p className="text-sm text-[#64748B]">
        Nenhuma transição disponível para o status atual.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isLoading = pendingStatus === option.status;

          return (
            <Button
              key={option.status}
              type="button"
              variant="outline"
              disabled={pendingStatus !== null}
              onClick={() => handleTransition(option.status)}
            >
              {isLoading ? "Atualizando…" : option.label}
            </Button>
          );
        })}
      </div>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
