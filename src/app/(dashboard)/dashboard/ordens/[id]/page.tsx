import { notFound } from "next/navigation";

import { OrderDetail } from "@/components/orders/order-detail";
import { getOrderById } from "@/lib/actions/orders";

type OrderDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const data = await getOrderById(id);

  if (!data) {
    notFound();
  }

  return <OrderDetail data={data} />;
}
