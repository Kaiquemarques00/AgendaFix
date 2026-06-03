"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { STATUS_LABELS } from "@/lib/domain/status-machine";
import { cn } from "@/lib/utils";
import type { ServiceOrderStatus } from "@/types/database";

const STATUS_OPTIONS: Array<{ value: ServiceOrderStatus | "all"; label: string }> =
  [
    { value: "all", label: "Todas" },
    ...(
      Object.entries(STATUS_LABELS) as Array<[ServiceOrderStatus, string]>
    ).map(([value, label]) => ({ value, label })),
  ];

type StatusFilterProps = {
  currentStatus?: ServiceOrderStatus;
};

export function StatusFilter({ currentStatus }: StatusFilterProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeValue = currentStatus ?? "all";

  return (
    <div className="flex flex-wrap gap-2">
      {STATUS_OPTIONS.map((option) => {
        const params = new URLSearchParams(searchParams.toString());

        if (option.value === "all") {
          params.delete("status");
        } else {
          params.set("status", option.value);
        }
        params.delete("page");

        const href =
          params.size > 0 ? `${pathname}?${params.toString()}` : pathname;
        const isActive = activeValue === option.value;

        return (
          <Link
            key={option.value}
            href={href}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]"
                : "border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#CBD5E1] hover:text-[#0F172A]"
            )}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}
