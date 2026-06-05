"use client";

import { formatOrderDevice } from "@/components/orders/order-list";
import { useOrderSubscription } from "@/hooks/use-order-subscription";
import type { OrderNote, StatusHistory } from "@/types/database";
import type { OrderWithDetails } from "@/types/public-order";

import { HistoryTimeline } from "./history-timeline";
import { NotesSection } from "./notes-section";
import { StatusStepper } from "./status-stepper";

export const REALTIME_FALLBACK_MESSAGE =
  "Atualizações automáticas indisponíveis";

export function appendHistoryEntry(
  history: StatusHistory[],
  entry: StatusHistory
): StatusHistory[] {
  return [...history, entry];
}

export function appendNoteEntry(
  notes: OrderNote[],
  note: OrderNote
): OrderNote[] {
  return [...notes, note];
}

type OrderTrackingViewProps = {
  token: string;
  initialData: OrderWithDetails;
};

export function OrderTrackingView({
  token,
  initialData,
}: OrderTrackingViewProps) {
  const { order, history, notes, realtimeUnavailable } = useOrderSubscription(
    token,
    initialData
  );

  return (
    <div className="space-y-6">
      {realtimeUnavailable ? (
        <RealtimeFallbackBanner />
      ) : null}

      <section className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <p className="text-sm text-[#64748B]">Acompanhe seu serviço</p>
        <h1 className="mt-1 text-2xl font-semibold text-[#0F172A]">
          {order.order_number}
        </h1>
        <p className="mt-2 text-sm text-[#64748B]">
          {formatOrderDevice(order)}
        </p>
        <p className="mt-1 text-sm text-[#64748B]">{order.reported_issue}</p>
      </section>

      <section className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <h2 className="mb-4 text-lg font-semibold text-[#0F172A]">
          Status do reparo
        </h2>
        <StatusStepper currentStatus={order.status} />
      </section>

      <section className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <h2 className="mb-4 text-lg font-semibold text-[#0F172A]">
          Histórico
        </h2>
        <HistoryTimeline history={history} />
      </section>

      <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <NotesSection notes={notes} />
      </div>
    </div>
  );
}

function RealtimeFallbackBanner() {
  return (
    <div
      className="flex flex-col gap-3 rounded-xl border border-[#FEF3C7] bg-[#FEF3C7] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
      role="status"
    >
      <p className="text-sm font-medium text-[#B45309]">
        {REALTIME_FALLBACK_MESSAGE}
      </p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg bg-[#2563EB] px-4 text-sm font-medium text-white transition-colors hover:bg-[#1D4ED8]"
      >
        Atualizar página
      </button>
    </div>
  );
}
