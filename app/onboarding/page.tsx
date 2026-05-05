'use client'

import { useActionState } from 'react'
import { createBusinessAction } from '@/app/actions/business'

export default function OnboardingPage() {
  const [state, action, pending] = useActionState(createBusinessAction, undefined)

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-sm ring-1 ring-zinc-200">
        <h1 className="mb-2 text-xl font-semibold text-zinc-900">
          Cadastre sua assistência
        </h1>
        <p className="mb-6 text-sm text-zinc-500">
          Informe o nome do seu negócio para começar a gerenciar ordens de serviço.
        </p>

        <form action={action} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm font-medium text-zinc-700">
              Nome da assistência
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
              placeholder="Ex.: TechFix Assistência"
            />
          </div>

          {state?.error && (
            <p className="text-sm text-red-600">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
          >
            {pending ? 'Salvando...' : 'Continuar'}
          </button>
        </form>
      </div>
    </div>
  )
}
