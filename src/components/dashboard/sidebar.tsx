"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Ordens",
    href: "/dashboard",
    icon: ClipboardList,
    match: (pathname: string) =>
      pathname === "/dashboard" ||
      pathname.startsWith("/dashboard/ordens"),
  },
  {
    label: "Nova ordem",
    href: "/dashboard/nova",
    icon: PlusCircle,
    match: (pathname: string) => pathname === "/dashboard/nova",
  },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col bg-[#0F172A] md:flex">
      <div className="border-b border-white/10 px-6 py-5">
        <p className="text-lg font-bold text-white">Agenda Fix</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-4">
        {navItems.map((item) => {
          const isActive = item.match(pathname);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 transition-colors",
                isActive &&
                  "border-l-2 border-[#2563EB] bg-white/10 text-white"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
