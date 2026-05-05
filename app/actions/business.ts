'use server'

import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase'
import { createBusinessSchema } from '@/lib/validations'
import { createBusinessForUser } from '@/server/business-service'

export type BusinessActionState = {
  error?: string
} | undefined

export async function createBusinessAction(
  _prevState: BusinessActionState,
  formData: FormData
): Promise<BusinessActionState> {
  const parsed = createBusinessSchema.safeParse({
    name: formData.get('name'),
  })

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message
    return { error: firstError ?? 'Nome inválido.' }
  }

  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  try {
    await createBusinessForUser(supabase, user.id, parsed.data.name)
  } catch {
    return { error: 'Erro ao criar negócio. Tente novamente.' }
  }

  redirect('/dashboard')
}
