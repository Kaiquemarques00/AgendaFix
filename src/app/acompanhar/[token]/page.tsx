import type { Metadata } from "next";

import { isValidPublicToken } from "@/app/api/public/orders/[token]/route";
import { NotFoundOrder } from "@/components/portal/not-found-order";
import { OrderTrackingView } from "@/components/portal/order-tracking-view";
import { getPublicOrderByToken } from "@/lib/public/order-details";
import { createPublicServerClient } from "@/lib/supabase/public-server";

type TrackingPageProps = {
  params: Promise<{ token: string }>;
};

export const TRACKING_PAGE_ROBOTS = {
  index: false,
  follow: false,
} as const;

export function buildTrackingPageTitle(orderNumber: string): string {
  return `Acompanhar reparo — ${orderNumber}`;
}

export async function generateMetadata({
  params,
}: TrackingPageProps): Promise<Metadata> {
  const { token } = await params;

  if (!isValidPublicToken(token)) {
    return {
      title: "Ordem não encontrada",
      robots: TRACKING_PAGE_ROBOTS,
    };
  }

  const supabase = createPublicServerClient(token);
  const data = await getPublicOrderByToken(supabase);

  if (!data) {
    return {
      title: "Ordem não encontrada",
      robots: TRACKING_PAGE_ROBOTS,
    };
  }

  return {
    title: buildTrackingPageTitle(data.order.order_number),
    robots: TRACKING_PAGE_ROBOTS,
  };
}

export default async function TrackingPage({ params }: TrackingPageProps) {
  const { token } = await params;

  if (!isValidPublicToken(token)) {
    return <NotFoundOrder />;
  }

  const supabase = createPublicServerClient(token);
  const data = await getPublicOrderByToken(supabase);

  if (!data) {
    return <NotFoundOrder />;
  }

  return (
    <main className="min-h-screen bg-[#F8F9FA]">
      <div className="mx-auto w-full max-w-lg px-4 py-6 sm:py-8">
        <OrderTrackingView token={token} initialData={data} />
      </div>
    </main>
  );
}
