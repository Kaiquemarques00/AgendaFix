import type { Metadata } from "next";

import { TRACKING_PAGE_ROBOTS } from "@/app/acompanhar/[token]/page";
import { OrderLookupForm } from "@/components/portal/order-lookup-form";

export const CONSULT_PAGE_TITLE = "Consultar ordem";

export const metadata: Metadata = {
  title: CONSULT_PAGE_TITLE,
  description:
    "Consulte o andamento do seu reparo informando o número da OS e telefone.",
  robots: TRACKING_PAGE_ROBOTS,
};

export default function ConsultarPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <header className="bg-[#2563EB] px-4 py-8 text-center text-white">
        <h1 className="text-xl font-semibold sm:text-2xl">
          Acompanhe seu serviço
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-white/90">
          Digite o número da sua OS e os últimos 4 dígitos do telefone
          cadastrado na assistência.
        </p>
      </header>

      <main className="mx-auto w-full max-w-lg px-4 py-6 sm:py-8">
        <section className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <OrderLookupForm />
        </section>
      </main>
    </div>
  );
}
