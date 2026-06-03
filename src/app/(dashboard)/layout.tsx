import { redirect } from "next/navigation";

import { Sidebar } from "@/components/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/actions/auth";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[#E2E8F0] bg-white px-6 py-4">
          <p className="font-semibold text-[#0F172A] md:hidden">Agenda Fix</p>
          <div className="ml-auto flex items-center gap-4">
            <span className="hidden text-sm text-[#64748B] sm:inline">
              {user.email}
            </span>
            <form action={logout}>
              <Button type="submit" variant="outline" size="sm">
                Sair
              </Button>
            </form>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
