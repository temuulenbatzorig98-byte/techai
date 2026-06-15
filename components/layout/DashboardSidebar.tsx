'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { ThemeToggle } from './ThemeToggle'

const NAV = [
  {
    href: '/dashboard',
    label: 'Хяналтын самбар',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 10.5L10 3l7 7.5" /><path d="M5 8.5V17h4v-4h2v4h4V8.5" />
      </svg>
    ),
  },
  {
    href: '/my-courses',
    label: 'Миний курсууд',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 3h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1z" />
        <path d="M7 7h6M7 10h6M7 13h4" />
      </svg>
    ),
  },
  {
    href: '/payments',
    label: 'Төлбөр',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="16" height="11" rx="2" /><path d="M2 9h16" />
      </svg>
    ),
  },
  {
    href: '/profile',
    label: 'Профайл',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="7" r="3" /><path d="M3 18a7 7 0 0114 0" />
      </svg>
    ),
  },
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

  const isActive = (href: string) => pathname === href

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Хаах' : 'Цэс нээх'}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-xl flex items-center justify-center text-slate-600 dark:text-gray-300 shadow-sm hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
      >
        {open ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M13 3L3 13M3 3l10 10" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M2 4.5h12M2 8h12M2 11.5h12" />
          </svg>
        )}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/20 dark:bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-white dark:bg-[#111827] border-r border-slate-200 dark:border-white/10 z-40 flex flex-col transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>

        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-white/10">
          <Link href="/" className="font-syne text-lg font-bold gradient-text block hover:opacity-90 transition-opacity">
            Negun AI
          </Link>
          <p className="text-xs text-slate-400 dark:text-gray-500 mt-1">Оюутны хяналтын самбар</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto">
          {NAV.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                isActive(href)
                  ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold'
                  : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <span className={isActive(href) ? 'text-purple-500 dark:text-purple-400' : 'text-slate-400 dark:text-gray-500'}>
                {icon}
              </span>
              {label}
              {isActive(href) && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-500" />
              )}
            </Link>
          ))}

          {role === 'ADMIN' && (
            <>
              <div className="my-3 h-px bg-slate-100 dark:bg-white/10" />
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-400/10 transition-all duration-200"
              >
                <svg className="w-[18px] h-[18px] text-amber-500 dark:text-amber-400" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="10" cy="10" r="3" />
                  <path d="M10 1v2M10 17v2M1 10h2M17 10h2M3.22 3.22l1.42 1.42M15.36 15.36l1.42 1.42M3.22 16.78l1.42-1.42M15.36 4.64l1.42-1.42" />
                </svg>
                Админ
              </Link>
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-white/10 space-y-1">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-xs text-slate-400 dark:text-gray-500 font-medium">Харагдах байдал</span>
            <ThemeToggle />
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 2h2a1 1 0 011 1v10a1 1 0 01-1 1h-2M7 11l4-3-4-3M1 8h9" />
            </svg>
            Гарах
          </button>
        </div>
      </aside>
    </>
  )
}
