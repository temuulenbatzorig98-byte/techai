'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

export function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      if (data.needsVerify) {
        router.push(`/verify?userId=${data.userId}`)
        return
      }
      setError(data.error)
      return
    }

    const redirect = searchParams.get('redirect') || '/dashboard'
    router.push(redirect)
    router.refresh()
  }

  return (
    <div className="min-h-screen hero-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-syne text-2xl font-bold gradient-text">
            AutoLearn AI
          </Link>
          <p className="text-gray-400 mt-2">Тавтай морилно уу</p>
        </div>

        <div className="bg-[#111827] border border-white/10 rounded-2xl p-8">
          <h1 className="font-syne text-xl font-bold text-white mb-6">Нэвтрэх</h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Имэйл</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Нууц үг</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                placeholder="••••••••"
              />
            </div>
            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-xs text-purple-400 hover:text-purple-300">
                Нууц үгээ мартсан уу?
              </Link>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl font-semibold disabled:opacity-50 hover:opacity-90 transition"
            >
              {loading ? 'Нэвтэрч байна...' : 'Нэвтрэх'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Бүртгэл байхгүй юу?{' '}
            <Link href="/register" className="text-purple-400 hover:text-purple-300">
              Бүртгүүлэх
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
