'use server'

import { appendFile } from 'node:fs/promises'
import path from 'node:path'
import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase'
import { loginSchema, registerSchema } from '@/lib/validations'

export type AuthActionState = {
  error?: string
} | undefined

function registerErrorMessage(code: string | undefined): string {
  switch (code) {
    case 'user_already_exists':
    case 'email_exists':
      return 'Este e-mail já está cadastrado. Entre na sua conta ou use outro e-mail.'
    case 'over_email_send_rate_limit':
      return 'Limite de envio de e-mail atingido. Aguarde alguns minutos e tente novamente.'
    case 'email_address_invalid':
      return 'Este e-mail não é aceito. Use outro endereço (evite domínios de teste como example.com).'
    case 'weak_password':
      return 'Senha muito fraca. Use uma senha mais longa ou mais complexa.'
    case 'signup_disabled':
      return 'Novos cadastros estão desabilitados no momento.'
    default:
      return 'Não foi possível criar sua conta. Tente novamente em instantes.'
  }
}

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

export async function registerAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = registerSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message
    return { error: firstError ?? 'Dados inválidos.' }
  }

  console.log('parsed', parsed.data);

  const supabase = await getSupabaseServerClient()
  const { data: signUpData, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  /*
  const logPath = path.join(
    process.env.AGENDAFIX_PROJECT_ROOT ?? process.cwd(),
    'debug-947496.log'
  )
  

  // #region agent log
  const logPayload = {
    sessionId: '947496',
    runId: 'post-fix-error-map',
    hypothesisId: 'H1-H5',
    location: 'app/actions/auth.ts:registerAction:afterSignUp',
    message: 'signUp response summary',
    data: {
      cwd: process.cwd(),
      logPath,
      hasUser: Boolean(signUpData?.user),
      hasSession: Boolean(signUpData?.session),
      errCode: error?.code ?? null,
      errStatus: error?.status ?? null,
      errName: error?.name ?? null,
      shownMessageKey: error?.code ?? 'success',
    },
    timestamp: Date.now(),
  }
  const logLine = `${JSON.stringify(logPayload)}\n`
  if (process.env.NODE_ENV === 'development') {
    console.info('[debug-947496]', JSON.stringify(logPayload.data))
  }
  void appendFile(logPath, logLine).catch((err) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('[debug-947496] log write failed', err)
    }
  })
  fetch('http://127.0.0.1:7609/ingest/f1cc6bf9-b054-4906-a18f-5184010d2970', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Debug-Session-Id': '947496',
    },
    body: JSON.stringify(logPayload),
  }).catch(() => {})
  // #endregion
*/
  if (error) {
    return { error: registerErrorMessage(error.code) }
  }

  redirect('/dashboard')
}

export async function logoutAction(): Promise<void> {
  const supabase = await getSupabaseServerClient()
  await supabase.auth.signOut()
  redirect('/login')
}
