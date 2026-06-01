import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Painel</CardTitle>
        <CardDescription>
          Infraestrutura base — autenticação ativa. Ordens de serviço serão
          implementadas nas próximas features.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-[#64748B]">
          Logado como <strong className="text-[#0F172A]">{user?.email}</strong>
        </p>
      </CardContent>
    </Card>
  );
}
