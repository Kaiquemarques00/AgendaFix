import { createClient } from '@supabase/supabase-js'

function getRequiredEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required env var: ${name}`)
  return value
}

let _supabase: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (_supabase) return _supabase

  const url = getRequiredEnv('NEXT_PUBLIC_SUPABASE_URL')
  const anonKey = getRequiredEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')

  _supabase = createClient(url, anonKey)
  return _supabase
}
