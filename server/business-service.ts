import type { SupabaseClient } from '@supabase/supabase-js'

export type Business = {
  id: string
  name: string
  owner_id: string
  created_at: string
}

export async function getBusinessForUser(
  supabase: SupabaseClient,
  userId: string
): Promise<Business | null> {
  const { data, error } = await supabase
    .from('businesses')
    .select('id, name, owner_id, created_at')
    .eq('owner_id', userId)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return data
}

export async function createBusinessForUser(
  supabase: SupabaseClient,
  userId: string,
  name: string
): Promise<Business> {
  const { data, error } = await supabase
    .from('businesses')
    .insert({ name, owner_id: userId })
    .select('id, name, owner_id, created_at')
    .single()

  if (error) throw new Error(error.message)
  return data
}
