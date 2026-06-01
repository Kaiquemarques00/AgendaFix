"use client";

import { useEffect, useState } from "react";

import { createPublicClient } from "@/lib/supabase/public-client";
import { subscribeToOrderWithReconnect } from "@/lib/supabase/realtime";
import type {
  OrderNote,
  OrderSubscriptionData,
  ServiceOrder,
  StatusHistory,
} from "@/types/database";

export function useOrderSubscription(
  publicToken: string,
  initialData: OrderSubscriptionData
) {
  const [order, setOrder] = useState<ServiceOrder>(initialData.order);
  const [history, setHistory] = useState<StatusHistory[]>(initialData.history);
  const [notes, setNotes] = useState<OrderNote[]>(initialData.notes);

  useEffect(() => {
    if (!publicToken || !initialData.order.id) {
      return;
    }

    const supabase = createPublicClient(publicToken);

    return subscribeToOrderWithReconnect(supabase, {
      publicToken,
      serviceOrderId: initialData.order.id,
      callbacks: {
        onOrderChange: (payload) => {
          if (payload.new && typeof payload.new === "object") {
            setOrder(payload.new as ServiceOrder);
          }
        },
        onHistoryChange: (payload) => {
          if (payload.new && typeof payload.new === "object") {
            setHistory((prev) => [
              ...prev,
              payload.new as StatusHistory,
            ]);
          }
        },
        onNotesChange: (payload) => {
          if (payload.new && typeof payload.new === "object") {
            setNotes((prev) => [...prev, payload.new as OrderNote]);
          }
        },
      },
    });
  }, [publicToken, initialData.order.id]);

  return { order, history, notes };
}
