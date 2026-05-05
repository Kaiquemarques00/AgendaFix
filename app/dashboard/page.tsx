import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase'
import { getBusinessForUser } from '@/server/business-service'
import { logoutAction } from '@/app/actions/auth'

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const business = await getBusinessForUser(supabase, user.id)

  if (!business) {
    redirect('/onboarding')
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-base font-semibold text-zinc-900">
            {business.name}
          </h1>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-sm text-zinc-500 hover:text-zinc-900"
            >
              Sair
            </button>
          </form>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
        <p className="text-lg font-medium text-zinc-800">
          Bem-vindo, {user.email}
        </p>
        <p className="text-sm text-zinc-500">
          Dashboard em construção. Ordens de serviço em breve.
        </p>
      </main>
    </div>
  )
}
