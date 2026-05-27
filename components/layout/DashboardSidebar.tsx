'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

const NAV = [
  { href: '/dashboard', label: 'Хяналтын самбар', icon: '🏠' },
  { href: '/my-courses', label: 'Миний курсууд', icon: '📚' },
  { href: '/payments', label: 'Төлбөр', icon: '💳' },
  { href: '/profile', label: 'Профайл', icon: '👤' },
]

interface Props {
  userId: string
  role: string
}

export function DashboardSidebar({ role }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-[#111827] border border-white/10 rounded-xl flex items-center justify-center text-white"
      >
        {open ? '✕' : '☰'}
      </button>

      <aside className={`fixed left-0 top-0 h-full w-64 bg-[#111827] border-r border-white/10 z-40 flex flex-col transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="font-syne text-lg font-bold gradient-text">AutoLearn AI</Link>
          <p className="text-xs text-gray-500 mt-1">Оюутны хяналтын самбар</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
                pathname === href
                  ? 'bg-purple-600/20 text-purple-300 font-medium'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{icon}</span>
              {label}
            </Link>
          ))}
          {role === 'ADMIN' && (
            <Link href="/admin" onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-amber-400 hover:bg-amber-400/10 transition mt-2">
              <span>⚙️</span>Админ
            </Link>
          )}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-400/10 transition">
            <span>🚪</span>Гарах
          </button>
        </div>
      </aside>
    </>
  )
}
