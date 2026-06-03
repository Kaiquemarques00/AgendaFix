import Link from "next/link";
import { redirect } from "next/navigation";

import { OrderList } from "@/components/orders/order-list";
import { StatusFilter } from "@/components/orders/status-filter";
import { getOrders } from "@/lib/actions/orders";
import type { ServiceOrderStatus } from "@/types/database";

const PAGE_SIZE = 20;

const VALID_STATUSES: ServiceOrderStatus[] = [
  "received",
  "in_analysis",
  "in_repair",
  "waiting_parts",
  "ready_pickup",
  "delivered",
];

function parseStatus(value?: string): ServiceOrderStatus | undefined {
  if (!value) {
    return undefined;
  }

  return VALID_STATUSES.includes(value as ServiceOrderStatus)
    ? (value as ServiceOrderStatus)
    : undefined;
}

function parsePage(value?: string) {
  const parsed = Number.parseInt(value ?? "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

type DashboardPageProps = {
  searchParams: Promise<{ status?: string; page?: string }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const status = parseStatus(params.status);
  const page = parsePage(params.page);

  const result = await getOrders({ status, page, pageSize: PAGE_SIZE });

  if (!result) {
    redirect("/login");
  }

  if (result.needsWorkshopSetup) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#0F172A]">
            Ordens de Serviço
          </h1>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white px-6 py-12 text-center shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <p className="text-base font-medium text-[#0F172A]">
            Conta sem assistência vinculada
          </p>
          <p className="mt-2 text-sm text-[#64748B]">
            Sua conta está autenticada, mas ainda não foi associada a uma
            assistência. Execute{" "}
            <code className="rounded bg-[#F1F5F9] px-1.5 py-0.5 text-xs">
              npm run seed
            </code>{" "}
            ou use o usuário de desenvolvimento configurado no seed.
          </p>
        </div>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(result.total / PAGE_SIZE));
  const showPagination = result.total > PAGE_SIZE;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#0F172A]">
            Ordens de Serviço
          </h1>
          <p className="mt-1 text-sm text-[#64748B]">
            {result.total === 0
              ? "Nenhuma ordem cadastrada"
              : `${result.total} ordem${result.total === 1 ? "" : "ns"} encontrada${result.total === 1 ? "" : "s"}`}
          </p>
        </div>
        <Link
          href="/dashboard/nova"
          className="inline-flex h-9 items-center justify-center rounded-lg bg-[#2563EB] px-4 text-sm font-medium text-white transition-colors hover:bg-[#1D4ED8]"
        >
          Nova ordem
        </Link>
      </div>

      <StatusFilter currentStatus={status} />
      <OrderList orders={result.orders} />

      {showPagination && (
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-[#64748B]">
            Página {page} de {totalPages}
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <PaginationLink
                page={page - 1}
                status={status}
                label="Anterior"
              />
            )}
            {page < totalPages && (
              <PaginationLink
                page={page + 1}
                status={status}
                label="Próxima"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function PaginationLink({
  page,
  status,
  label,
}: {
  page: number;
  status?: ServiceOrderStatus;
  label: string;
}) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  if (status) {
    params.set("status", status);
  }

  return (
    <Link
      href={`/dashboard?${params.toString()}`}
      className="inline-flex h-9 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white px-4 text-sm font-medium text-[#0F172A] transition-colors hover:bg-[#F8F9FA]"
    >
      {label}
    </Link>
  );
}
