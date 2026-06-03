import Link from "next/link";

export default function OrderNotFound() {
  return (
    <div className="mx-auto max-w-lg rounded-xl border border-[#E2E8F0] bg-white px-6 py-12 text-center shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <h1 className="text-xl font-semibold text-[#0F172A]">Ordem não encontrada</h1>
      <p className="mt-2 text-sm text-[#64748B]">
        A ordem solicitada não existe ou não pertence à sua assistência.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 inline-flex h-9 items-center justify-center rounded-lg bg-[#2563EB] px-4 text-sm font-medium text-white transition-colors hover:bg-[#1D4ED8]"
      >
        Voltar para ordens
      </Link>
    </div>
  );
}
