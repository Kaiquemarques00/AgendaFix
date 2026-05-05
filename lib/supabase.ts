import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { NextRequest, NextResponse } from 'next/server'

function getEnvVar(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required env var: ${name}`)
  return value
}

function getSupabaseConfig() {
  return {
    url: getEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
    key: getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  }
}

export function getSupabaseBrowserClient() {
  const { url, key } = getSupabaseConfig()
  return createBrowserClient(url, key)
}

export async function getSupabaseServerClient() {
  const { url, key } = getSupabaseConfig()
  const cookieStore = await cookies()

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          try {
            cookieStore.set(name, value, options)
          } catch {
            // setAll called from Server Component — cookies are read-only in that context
          }
        })
      },
    },
  })
}

export function getSupabaseProxyClient(req: NextRequest, res: NextResponse) {
  const { url, key } = getSupabaseConfig()

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return req.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value))
        cookiesToSet.forEach(({ name, value, options }) =>
          res.cookies.set(name, value, options)
        )
      },
    },
  })
}
