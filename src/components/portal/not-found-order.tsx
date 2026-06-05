import { SearchX } from "lucide-react";
import Link from "next/link";

export function NotFoundOrder() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-[#EFF6FF] text-[#2563EB]">
        <SearchX className="size-8" aria-hidden />
      </div>
      <h1 className="mt-6 text-2xl font-semibold text-[#0F172A]">
        Ordem não encontrada
      </h1>
      <p className="mt-2 max-w-sm text-sm text-[#64748B]">
        Não encontramos uma ordem com este link. Verifique se o endereço está
        correto ou consulte pelo número da OS.
      </p>
      <Link
        href="/consultar"
        className="mt-8 inline-flex h-10 items-center justify-center rounded-lg bg-[#2563EB] px-5 text-sm font-medium text-white transition-colors hover:bg-[#1D4ED8]"
      >
        Consultar minha ordem
      </Link>
    </div>
  );
}
