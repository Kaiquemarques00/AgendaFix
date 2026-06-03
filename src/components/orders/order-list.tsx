import Link from "next/link";

import { getStatusLabel } from "@/lib/domain/status-machine";
import { STATUS_COLORS } from "@/lib/design/status-colors";
import type { ServiceOrder } from "@/types/database";

export function formatOrderDevice(order: Pick<ServiceOrder, "device" | "brand" | "model">) {
  return `${order.device} · ${order.brand} ${order.model}`;
}

export function formatOrderDate(isoDate: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(isoDate));
}

export function formatHistoryDateTime(isoDate: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoDate));
}

type OrderListProps = {
  orders: ServiceOrder[];
};

export function OrderList({ orders }: OrderListProps) {
  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-[#E2E8F0] bg-white px-6 py-12 text-center shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <p className="text-base font-medium text-[#0F172A]">
          Nenhuma ordem encontrada
        </p>
        <p className="mt-2 text-sm text-[#64748B]">
          Crie a primeira ordem de serviço para começar.
        </p>
        <Link
          href="/dashboard/nova"
          className="mt-6 inline-flex h-9 items-center justify-center rounded-lg bg-[#2563EB] px-4 text-sm font-medium text-white transition-colors hover:bg-[#1D4ED8]"
        >
          Nova ordem
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#E2E8F0] bg-[#F8F9FA] text-xs font-medium uppercase tracking-wide text-[#64748B]">
            <tr>
              <th className="px-4 py-3">OS</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Equipamento</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Atualizado</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-[#E2E8F0] last:border-b-0"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/dashboard/ordens/${order.id}`}
                    className="font-medium text-[#2563EB] hover:underline"
                  >
                    {order.order_number}
                  </Link>
                </td>
                <td className="px-4 py-3 text-[#0F172A]">{order.customer_name}</td>
                <td className="px-4 py-3 text-[#64748B]">
                  {formatOrderDevice(order)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-4 py-3 text-[#64748B]">
                  {formatOrderDate(order.updated_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 md:hidden">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/dashboard/ordens/${order.id}`}
            className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-[#2563EB]">{order.order_number}</p>
                <p className="mt-1 text-sm text-[#0F172A]">{order.customer_name}</p>
                <p className="mt-1 text-xs text-[#64748B]">
                  {formatOrderDevice(order)}
                </p>
              </div>
              <StatusBadge status={order.status} />
            </div>
            <p className="mt-3 text-xs text-[#64748B]">
              Atualizado em {formatOrderDate(order.updated_at)}
            </p>
          </Link>
        ))}
      </div>
    </>
  );
}

function StatusBadge({ status }: { status: ServiceOrder["status"] }) {
  const colors = STATUS_COLORS[status];

  return (
    <span
      className="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {getStatusLabel(status)}
    </span>
  );
}
