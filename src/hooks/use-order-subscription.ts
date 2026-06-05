"use client";

import { useEffect, useState } from "react";

import { createPublicClient } from "@/lib/supabase/public-client";
import { subscribeToOrderWithReconnect } from "@/lib/supabase/realtime";
import type { OrderNote, StatusHistory } from "@/types/database";
import type { OrderWithDetails, PublicServiceOrder } from "@/types/public-order";

export const REALTIME_FAILURE_THRESHOLD = 3;

const FAILURE_STATUSES = new Set(["CHANNEL_ERROR", "TIMED_OUT", "CLOSED"]);

export function shouldShowRealtimeFallback(consecutiveFailures: number): boolean {
  return consecutiveFailures >= REALTIME_FAILURE_THRESHOLD;
}

export function useOrderSubscription(
  publicToken: string,
  initialData: OrderWithDetails
) {
  const [order, setOrder] = useState<PublicServiceOrder>(initialData.order);
  const [history, setHistory] = useState<StatusHistory[]>(initialData.history);
  const [notes, setNotes] = useState<OrderNote[]>(initialData.notes);
  const [realtimeUnavailable, setRealtimeUnavailable] = useState(false);

  useEffect(() => {
    if (!publicToken || !initialData.order.id) {
      return;
    }

    const supabase = createPublicClient(publicToken);
    let consecutiveFailures = 0;
    let cleanup: (() => void) | undefined;
    let disposed = false;

    const callbacks = {
      onOrderChange: (payload: { new?: unknown }) => {
        if (payload.new && typeof payload.new === "object") {
          setOrder(payload.new as PublicServiceOrder);
        }
      },
      onHistoryChange: (payload: { new?: unknown }) => {
        if (payload.new && typeof payload.new === "object") {
          setHistory((prev) => [...prev, payload.new as StatusHistory]);
        }
      },
      onNotesChange: (payload: { new?: unknown }) => {
        if (payload.new && typeof payload.new === "object") {
          setNotes((prev) => [...prev, payload.new as OrderNote]);
        }
      },
      onStatusChange: (status: string) => {
        if (status === "SUBSCRIBED") {
          consecutiveFailures = 0;
          setRealtimeUnavailable(false);
          return;
        }

        if (FAILURE_STATUSES.has(status)) {
          consecutiveFailures += 1;
          if (shouldShowRealtimeFallback(consecutiveFailures)) {
            setRealtimeUnavailable(true);
          }
        }
      },
    };

    void (async () => {
      try {
        const response = await fetch(
          `/api/public/orders/${encodeURIComponent(publicToken)}/realtime-token`
        );

        if (!response.ok) {
          if (!disposed) {
            setRealtimeUnavailable(true);
          }
          return;
        }

        const { accessToken } = (await response.json()) as {
          accessToken: string;
        };

        if (disposed) {
          return;
        }

        supabase.realtime.setAuth(accessToken);

        cleanup = subscribeToOrderWithReconnect(supabase, {
          publicToken,
          serviceOrderId: initialData.order.id,
          callbacks,
        });
      } catch {
        if (!disposed) {
          setRealtimeUnavailable(true);
        }
      }
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [publicToken, initialData.order.id]);

  return { order, history, notes, realtimeUnavailable };
}
