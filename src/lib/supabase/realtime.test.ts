import { describe, expect, it, vi, beforeEach } from "vitest";

import {
  subscribeToOrderUpdates,
  subscribeToOrderWithReconnect,
} from "@/lib/supabase/realtime";

function createMockSupabase() {
  const handlers: Array<{
    table: string;
    callback: (payload: unknown) => void;
  }> = [];
  let subscribeCallback: ((status: string) => void) | undefined;

  const channel = {
    on: vi.fn(
      (
        _event: string,
        config: { table: string },
        callback: (payload: unknown) => void
      ) => {
        handlers.push({ table: config.table, callback });
        return channel;
      }
    ),
    subscribe: vi.fn((cb?: (status: string) => void) => {
      subscribeCallback = cb;
      cb?.("SUBSCRIBED");
      return channel;
    }),
  };

  const supabase = {
    channel: vi.fn(() => channel),
    removeChannel: vi.fn(),
  };

  return {
    supabase,
    channel,
    handlers,
    getSubscribeCallback: () => subscribeCallback,
  };
}

describe("subscribeToOrderUpdates", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("registra listeners em service_orders, status_history e order_notes", () => {
    const { supabase, channel } = createMockSupabase();

    subscribeToOrderUpdates(supabase as never, {
      publicToken: "c0000000-0000-4000-8000-000000000001",
      serviceOrderId: "b0000000-0000-4000-8000-000000000001",
      callbacks: {},
    });

    expect(supabase.channel).toHaveBeenCalledWith(
      "order-c0000000-0000-4000-8000-000000000001"
    );
    expect(channel.on).toHaveBeenCalledTimes(3);
    const tables = channel.on.mock.calls.map(
      (call: [{ table: string }]) => call[1].table
    );
    expect(tables).toEqual([
      "service_orders",
      "status_history",
      "order_notes",
    ]);
  });

  it("remove o channel ao desinscrever", () => {
    const { supabase } = createMockSupabase();

    const unsubscribe = subscribeToOrderUpdates(supabase as never, {
      publicToken: "token-a",
      serviceOrderId: "order-a",
      callbacks: {},
    });

    unsubscribe();

    expect(supabase.removeChannel).toHaveBeenCalledTimes(1);
  });

  it("dispara callback onOrderChange quando service_orders muda", () => {
    const { supabase, handlers } = createMockSupabase();
    const onOrderChange = vi.fn();

    subscribeToOrderUpdates(supabase as never, {
      publicToken: "token-a",
      serviceOrderId: "order-a",
      callbacks: { onOrderChange },
    });

    const orderHandler = handlers.find((h) => h.table === "service_orders");
    orderHandler?.callback({
      new: { id: "order-a", status: "in_repair" },
    });

    expect(onOrderChange).toHaveBeenCalledOnce();
  });
});

describe("subscribeToOrderWithReconnect", () => {
  it("reconecta após CHANNEL_ERROR", () => {
    const { supabase, getSubscribeCallback } = createMockSupabase();

    subscribeToOrderWithReconnect(supabase as never, {
      publicToken: "token-a",
      serviceOrderId: "order-a",
      callbacks: {},
    });

    expect(supabase.channel).toHaveBeenCalledTimes(1);

    getSubscribeCallback()?.("CHANNEL_ERROR");

    vi.advanceTimersByTime(2000);

    expect(supabase.channel).toHaveBeenCalledTimes(2);
  });

  it("para de reconectar após cleanup", () => {
    const { supabase, getSubscribeCallback } = createMockSupabase();

    const cleanup = subscribeToOrderWithReconnect(supabase as never, {
      publicToken: "token-a",
      serviceOrderId: "order-a",
      callbacks: {},
    });

    cleanup();
    getSubscribeCallback()?.("CHANNEL_ERROR");
    vi.advanceTimersByTime(2000);

    expect(supabase.channel).toHaveBeenCalledTimes(1);
  });
});
