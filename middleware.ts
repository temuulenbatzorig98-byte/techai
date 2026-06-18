import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

const AUTH_PATHS = ['/login', '/register', '/forgot-password', '/verify']
const DASHBOARD_PATHS = ['/dashboard', '/my-courses', '/my-downloads', '/learn', '/profile', '/payments']
const ADMIN_PATHS = ['/admin']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('auth_token')?.value

  const user = token ? await verifyToken(token) : null

  if (AUTH_PATHS.some((p) => pathname.startsWith(p)) && user) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  if (DASHBOARD_PATHS.some((p) => pathname.startsWith(p)) && !user) {
    return NextResponse.redirect(new URL(`/login?redirect=${encodeURIComponent(pathname)}`, req.url))
  }

  if (ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
    if (!user) return NextResponse.redirect(new URL('/login', req.url))
    if (user.role !== 'ADMIN') return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
