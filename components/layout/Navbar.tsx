'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from './ThemeToggle'

interface SessionUser {
  userId: string
  role: string
  email?: string
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState<SessionUser | null | undefined>(undefined) // undefined = loading
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => setUser(d.user ?? null))
      .catch(() => setUser(null))
  }, [])

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.push('/')
    router.refresh()
  }

  const isAdmin = user?.role === 'ADMIN'

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#0d1220]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-syne text-xl font-bold gradient-text">
          Negun AI
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {[
            { href: '/courses', label: 'Курсууд' },
            { href: '/about', label: 'Бидний тухай' },
          ].map(({ href, label }) => (
            <Link key={href} href={href} className="text-sm text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition">
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {user === undefined ? (
            <div className="w-24 h-8 bg-slate-100 dark:bg-white/5 rounded-xl animate-pulse" />
          ) : user ? (
            <>
              {isAdmin && (
                <Link href="/admin"
                  className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 px-3 py-1.5 rounded-lg border border-purple-300 dark:border-purple-500/30 hover:bg-purple-50 dark:hover:bg-purple-500/10 transition">
                  Админ
                </Link>
              )}
              <Link href="/dashboard"
                className="text-sm text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition">
                Хяналтын самбар
              </Link>
              <button
                onClick={logout}
                className="text-sm text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300 transition">
                Гарах
              </button>
            </>
          ) : (
            <>
              <Link href="/login"
                className="text-sm text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition">
                Нэвтрэх
              </Link>
              <Link href="/register"
                className="text-sm text-white px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 font-medium hover:opacity-90 transition">
                Бүртгүүлэх
              </Link>
            </>
          )}
        </div>

        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button className="text-slate-500 dark:text-gray-400" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1220] px-4 py-4 space-y-2">
          {[
            { href: '/courses', label: 'Курсууд' },
            { href: '/about', label: 'Бидний тухай' },
          ].map(({ href, label }) => (
            <Link key={href} href={href} className="block text-slate-600 dark:text-gray-300 py-2 hover:text-slate-900 dark:hover:text-white" onClick={() => setMenuOpen(false)}>
              {label}
            </Link>
          ))}

          <div className="pt-2 border-t border-slate-200 dark:border-white/10 space-y-2">
            {user ? (
              <>
                {isAdmin && (
                  <Link href="/admin" className="block py-2 text-purple-600 dark:text-purple-400" onClick={() => setMenuOpen(false)}>
                    Админ хянах самбар
                  </Link>
                )}
                <Link href="/dashboard" className="block py-2 text-slate-600 dark:text-gray-300" onClick={() => setMenuOpen(false)}>
                  Хяналтын самбар
                </Link>
                <button onClick={() => { setMenuOpen(false); logout() }} className="block w-full text-left py-2 text-slate-400 dark:text-gray-500">
                  Гарах
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link href="/login" className="flex-1 text-center py-2 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-300 rounded-xl text-sm" onClick={() => setMenuOpen(false)}>
                  Нэвтрэх
                </Link>
                <Link href="/register" className="flex-1 text-center py-2 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl text-sm" onClick={() => setMenuOpen(false)}>
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
