'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { ThemeToggle } from './ThemeToggle'

interface SessionUser {
  userId: string
  role: string
  email?: string
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState<SessionUser | null | undefined>(undefined)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => setUser(d.user ?? null))
      .catch(() => setUser(null))
  }, [])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.push('/')
    router.refresh()
  }

  const isAdmin = user?.role === 'ADMIN'

  const navLinks = [
    { href: '/courses', label: 'Курсууд' },
    { href: '/about', label: 'Бидний тухай' },
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      scrolled
        ? 'bg-white/95 dark:bg-[#0d1220]/95 border-b border-slate-200 dark:border-white/10 shadow-sm shadow-black/[0.04]'
        : 'bg-white/80 dark:bg-[#0d1220]/80 border-b border-slate-100/80 dark:border-white/5'
    } backdrop-blur-xl`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="font-syne text-xl font-bold gradient-text flex-shrink-0 hover:opacity-90 transition-opacity">
          Negun AI
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive(href)
                  ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10'
                  : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />

          {user === undefined ? (
            <div className="w-28 h-9 bg-slate-100 dark:bg-white/5 rounded-xl animate-pulse" />
          ) : user ? (
            <>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="text-xs font-medium text-purple-600 dark:text-purple-400 px-3 py-1.5 rounded-lg border border-purple-200 dark:border-purple-500/30 hover:bg-purple-50 dark:hover:bg-purple-500/10 transition-all duration-200"
                >
                  Админ
                </Link>
              )}
              <Link
                href="/dashboard"
                className="text-sm font-medium text-slate-700 dark:text-gray-300 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 hover:border-slate-300 dark:hover:border-white/20 transition-all duration-200"
              >
                Хяналтын самбар
              </Link>
              <button
                onClick={logout}
                className="text-sm text-slate-400 dark:text-gray-500 hover:text-slate-700 dark:hover:text-gray-300 px-2 py-2 transition-colors duration-200"
              >
                Гарах
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-slate-700 dark:text-gray-300 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 hover:border-slate-300 dark:hover:border-white/20 transition-all duration-200"
              >
                Нэвтрэх
              </Link>
              <Link
                href="/register"
                className="text-sm font-medium text-white px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-90 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200 hover:-translate-y-px"
              >
                Бүртгүүлэх
              </Link>
            </>
          )}
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-1.5">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Цэс хаах' : 'Цэс нээх'}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors duration-200"
          >
            {menuOpen ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M15 3L3 15M3 3l12 12" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M2 5h14M2 9h14M2 13h14" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1220] px-4 py-3 space-y-0.5 animate-slide-down">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive(href)
                  ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10'
                  : 'text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'
              }`}
            >
              {label}
            </Link>
          ))}

          <div className="pt-2 mt-1 border-t border-slate-100 dark:border-white/5 space-y-0.5">
            {user ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/10 transition-colors"
                  >
                    Админ хянах самбар
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  Хяналтын самбар
                </Link>
                <button
                  onClick={() => { setMenuOpen(false); logout() }}
                  className="w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  Гарах
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-1 pb-1">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center py-2.5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  Нэвтрэх
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center py-2.5 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Бүртгүүлэх
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
