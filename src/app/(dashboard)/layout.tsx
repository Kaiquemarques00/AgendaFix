import { redirect } from "next/navigation";

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
    <div className="min-h-screen bg-[#F8F9FA]">
      <header className="flex items-center justify-between border-b border-[#E2E8F0] bg-white px-6 py-4">
        <p className="font-semibold text-[#0F172A]">Agenda Fix</p>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[#64748B]">{user.email}</span>
          <form action={logout}>
            <Button type="submit" variant="outline" size="sm">
              Sair
            </Button>
          </form>
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
