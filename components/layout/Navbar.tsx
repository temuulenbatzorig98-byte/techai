'use client'
import Link from 'next/link'
import { useState } from 'react'

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 border-b border-white/10 bg-[#0d1220]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-syne text-xl font-bold gradient-text">
          AutoLearn AI
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {[
            { href: '/courses', label: 'Курсууд' },
            { href: '/pricing', label: 'Үнэ' },
            { href: '/about', label: 'Бидний тухай' },
          ].map(({ href, label }) => (
            <Link key={href} href={href} className="text-sm text-gray-400 hover:text-white transition">
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-300 hover:text-white px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition">
            Нэвтрэх
          </Link>
          <Link href="/register"
            className="text-sm text-white px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 font-medium hover:opacity-90 transition">
            Бүртгүүлэх
          </Link>
        </div>

        <button className="md:hidden text-gray-400" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0d1220] px-4 py-4 space-y-2">
          {['/courses', '/pricing', '/about'].map((href) => (
            <Link key={href} href={href} className="block text-gray-300 py-2 hover:text-white" onClick={() => setMenuOpen(false)}>
              {href.slice(1).charAt(0).toUpperCase() + href.slice(2)}
            </Link>
          ))}
          <div className="flex gap-2 pt-2">
            <Link href="/login" className="flex-1 text-center py-2 border border-white/10 text-gray-300 rounded-xl text-sm">Нэвтрэх</Link>
            <Link href="/register" className="flex-1 text-center py-2 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl text-sm">Бүртгүүлэх</Link>
          </div>
        </div>
      )}
    </nav>
  )
}
