import Link from "next/link";

import {
  formatOrderDate,
  formatOrderDevice,
} from "@/components/orders/order-list";
import { getStatusLabel } from "@/lib/domain/status-machine";
import { STATUS_COLORS } from "@/lib/design/status-colors";
import type { OrderDetailResult } from "@/lib/actions/orders";
import type { StatusHistory } from "@/types/database";

type OrderDetailProps = {
  data: OrderDetailResult;
};

export function formatHistoryEntry(entry: StatusHistory) {
  if (entry.from_status === null) {
    return `Ordem criada — ${getStatusLabel(entry.to_status)}`;
  }

  return `${getStatusLabel(entry.from_status)} → ${getStatusLabel(entry.to_status)}`;
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

export function OrderDetail({ data }: OrderDetailProps) {
  const { order, history } = data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/dashboard"
            className="text-sm text-[#64748B] hover:text-[#0F172A]"
          >
            ← Voltar para ordens
          </Link>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold text-[#0F172A]">
              {order.order_number}
            </h1>
            <StatusBadge status={order.status} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <h2 className="mb-4 text-lg font-semibold text-[#0F172A]">Cliente</h2>
          <dl className="space-y-3 text-sm">
            <DetailRow label="Nome" value={order.customer_name} />
            <DetailRow label="Telefone" value={order.customer_phone} />
          </dl>
        </section>

        <section className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <h2 className="mb-4 text-lg font-semibold text-[#0F172A]">
            Equipamento
          </h2>
          <dl className="space-y-3 text-sm">
            <DetailRow label="Equipamento" value={formatOrderDevice(order)} />
            <DetailRow label="Defeito relatado" value={order.reported_issue} />
          </dl>
        </section>
      </div>

      <section className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <h2 className="mb-4 text-lg font-semibold text-[#0F172A]">
          Informações da OS
        </h2>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <DetailRow label="Número da OS" value={order.order_number} />
          <DetailRow label="Entrada" value={formatOrderDate(order.created_at)} />
          <DetailRow label="Última atualização" value={formatOrderDate(order.updated_at)} />
          <DetailRow
            label="Link de acompanhamento"
            value={`/acompanhar/${order.public_token}`}
          />
        </dl>
      </section>

      <section className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <h2 className="mb-4 text-lg font-semibold text-[#0F172A]">
          Histórico de atualizações
        </h2>
        {history.length === 0 ? (
          <p className="text-sm text-[#64748B]">Nenhuma atualização registrada.</p>
        ) : (
          <ol className="space-y-4">
            {history.map((entry, index) => (
              <li key={entry.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span
                    className={`size-2.5 rounded-full ${
                      index === history.length - 1
                        ? "bg-[#2563EB]"
                        : "bg-[#CBD5E1]"
                    }`}
                  />
                  {index < history.length - 1 ? (
                    <span className="mt-1 w-px flex-1 bg-[#E2E8F0]" />
                  ) : null}
                </div>
                <div className="pb-2">
                  <p className="text-sm font-medium text-[#0F172A]">
                    {formatHistoryEntry(entry)}
                  </p>
                  <p className="mt-1 text-xs text-[#64748B]">
                    {formatHistoryDateTime(entry.created_at)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[#64748B]">{label}</dt>
      <dd className="mt-1 font-medium text-[#0F172A]">{value}</dd>
    </div>
  );
}

function StatusBadge({ status }: { status: OrderDetailResult["order"]["status"] }) {
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
