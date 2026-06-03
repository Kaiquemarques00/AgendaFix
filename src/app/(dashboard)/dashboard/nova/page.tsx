import { OrderForm } from "@/components/orders/order-form";

export default function NewOrderPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#0F172A]">Nova ordem</h1>
        <p className="mt-1 text-sm text-[#64748B]">
          Cadastre uma nova ordem de serviço para a assistência.
        </p>
      </div>
      <OrderForm />
    </div>
  );
}
