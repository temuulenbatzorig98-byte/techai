'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<'email' | 'reset'>('email')
  const [email, setEmail] = useState('')
  const [userId, setUserId] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await res.json()
    setLoading(false)
    if (data.userId) {
      setUserId(data.userId)
      setStep('reset')
    } else {
      setSuccess('Хэрэв имэйл бүртгэлтэй бол OTP илгээгдэнэ.')
    }
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ userId, code, newPassword: password }),
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error); return }
    router.push('/login')
  }

  return (
    <div className="min-h-screen hero-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-syne text-2xl font-bold gradient-text">Negun AI</Link>
        </div>
        <div className="bg-[#111827] border border-white/10 rounded-2xl p-8">
          <h1 className="font-syne text-xl font-bold text-white mb-6">Нууц үг сэргээх</h1>

          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}
          {success && <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm px-4 py-3 rounded-xl mb-4">{success}</div>}

          {step === 'email' ? (
            <form onSubmit={handleEmail} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Имэйл хаяг</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  placeholder="email@example.com" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl font-semibold disabled:opacity-50">
                {loading ? 'Илгээж байна...' : 'OTP илгээх'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">OTP код</label>
                <input value={code} onChange={e => setCode(e.target.value)} maxLength={6} required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  placeholder="6 оронтой код" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Шинэ нууц үг</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  placeholder="8+ тэмдэгт" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl font-semibold disabled:opacity-50">
                {loading ? 'Шинэчилж байна...' : 'Нууц үг шинэчлэх'}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-gray-400 mt-6">
            <Link href="/login" className="text-purple-400 hover:text-purple-300">← Нэвтрэх хуудас</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
