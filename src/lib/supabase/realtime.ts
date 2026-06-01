import type {
  RealtimePostgresChangesPayload,
  SupabaseClient,
} from "@supabase/supabase-js";

import type { OrderNote, ServiceOrder, StatusHistory } from "@/types/database";

export type OrderRealtimeCallbacks = {
  onOrderChange?: (
    payload: RealtimePostgresChangesPayload<ServiceOrder>
  ) => void;
  onHistoryChange?: (
    payload: RealtimePostgresChangesPayload<StatusHistory>
  ) => void;
  onNotesChange?: (
    payload: RealtimePostgresChangesPayload<OrderNote>
  ) => void;
  onStatusChange?: (status: string) => void;
};

export type OrderSubscriptionOptions = {
  publicToken: string;
  serviceOrderId: string;
  callbacks: OrderRealtimeCallbacks;
};

const RECONNECT_DELAY_MS = 2000;

export function subscribeToOrderUpdates(
  supabase: SupabaseClient,
  options: OrderSubscriptionOptions
): () => void {
  const { publicToken, serviceOrderId, callbacks } = options;
  const channelName = `order-${publicToken}`;

  const channel = supabase
    .channel(channelName)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "service_orders",
        filter: `public_token=eq.${publicToken}`,
      },
      (payload) => {
        callbacks.onOrderChange?.(
          payload as RealtimePostgresChangesPayload<ServiceOrder>
        );
      }
    )
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "status_history",
        filter: `service_order_id=eq.${serviceOrderId}`,
      },
      (payload) => {
        callbacks.onHistoryChange?.(
          payload as RealtimePostgresChangesPayload<StatusHistory>
        );
      }
    )
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "order_notes",
        filter: `service_order_id=eq.${serviceOrderId}`,
      },
      (payload) => {
        callbacks.onNotesChange?.(
          payload as RealtimePostgresChangesPayload<OrderNote>
        );
      }
    );

  channel.subscribe((status) => {
    callbacks.onStatusChange?.(status);
  });

  return () => {
    void supabase.removeChannel(channel);
  };
}

export function subscribeToOrderWithReconnect(
  supabase: SupabaseClient,
  options: OrderSubscriptionOptions
): () => void {
  let unsubscribe: (() => void) | undefined;
  let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
  let disposed = false;

  const connect = () => {
    unsubscribe?.();
    clearTimeout(reconnectTimer);

    unsubscribe = subscribeToOrderUpdates(supabase, {
      ...options,
      callbacks: {
        ...options.callbacks,
        onStatusChange: (status) => {
          options.callbacks.onStatusChange?.(status);
          if (
            !disposed &&
            (status === "CHANNEL_ERROR" ||
              status === "TIMED_OUT" ||
              status === "CLOSED")
          ) {
            reconnectTimer = setTimeout(connect, RECONNECT_DELAY_MS);
          }
        },
      },
    });
  };

  connect();

  return () => {
    disposed = true;
    clearTimeout(reconnectTimer);
    unsubscribe?.();
  };
}
