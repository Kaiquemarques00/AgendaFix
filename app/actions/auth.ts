'use server'

import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase'
import { loginSchema } from '@/lib/validations'

export type AuthActionState = {
  error?: string
} | undefined

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message
    return { error: firstError ?? 'Dados inválidos.' }
  }

  const supabase = await getSupabaseServerClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    return { error: 'E-mail ou senha inválidos.' }
  }

  redirect('/dashboard')
}

export async function logoutAction(): Promise<void> {
  const supabase = await getSupabaseServerClient()
  await supabase.auth.signOut()
  redirect('/login')
}
