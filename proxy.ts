import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSupabaseProxyClient } from '@/lib/supabase'

const PUBLIC_ROUTES = ['/login', '/register']
const AUTH_REQUIRED_ROUTES = ['/dashboard', '/onboarding']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next({ request })

  const supabase = getSupabaseProxyClient(request, response)
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const isAuthRequired = AUTH_REQUIRED_ROUTES.some((route) =>
    pathname.startsWith(route)
  )
  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route))

  if (isAuthRequired && !session) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isPublicRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}
