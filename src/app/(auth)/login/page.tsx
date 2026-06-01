import { LoginForm } from "./login-form";

type LoginPageProps = {
  searchParams: Promise<{ redirectTo?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const redirectTo = params.redirectTo;

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="hidden bg-[#0F172A] p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <p className="text-xl font-bold">Agenda Fix</p>
        </div>
        <p className="max-w-sm text-sm text-white/80">
          Plataforma de acompanhamento de serviços para assistências técnicas e
          oficinas.
        </p>
      </aside>
      <div className="flex items-center justify-center bg-[#F8F9FA] p-8">
        <LoginForm redirectTo={redirectTo} />
      </div>
    </div>
  );
}
