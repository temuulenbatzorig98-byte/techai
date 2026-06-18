'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function VerifyPage() {
  const router = useRouter()
  const [userId, setUserId] = useState('')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendMsg, setResendMsg] = useState('')
  const [countdown, setCountdown] = useState(0)
  const inputs = useRef<(HTMLInputElement | null)[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setUserId(params.get('userId') || '')
    setEmail(params.get('email') || '')
  }, [])

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  const startCountdown = () => {
    setCountdown(60)
    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(timerRef.current!); return 0 }
        return c - 1
      })
    }, 1000)
  }

  const handleChange = (i: number, v: string) => {
    if (!/^\d*$/.test(v)) return
    const next = [...code]
    next[i] = v.slice(-1)
    setCode(next)
    if (v && i < 5) inputs.current[i + 1]?.focus()
  }

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[i] && i > 0) inputs.current[i - 1]?.focus()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const fullCode = code.join('')
    if (fullCode.length !== 6) return
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ userId, code: fullCode, type: 'EMAIL_VERIFY' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) { setError(data.error); return }
    router.push('/dashboard')
    router.refresh()
  }

  const handleResend = async () => {
    if (countdown > 0 || !userId) return
    setResendMsg('')
    setError('')

    const res = await fetch('/api/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ userId }),
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await res.json()

    if (!res.ok) { setError(data.error); return }
    setResendMsg('Код дахин илгээгдлээ')
    startCountdown()
  }

  return (
    <div className="min-h-screen hero-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-syne text-2xl font-bold gradient-text">
            Negun AI
          </Link>
        </div>

        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-4">📧</div>
          <h1 className="font-syne text-xl font-bold text-slate-900 dark:text-white mb-2">Имэйл баталгаажуулах</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm mb-8">
            <span className="text-slate-900 dark:text-white">{email}</span> хаяг руу 6 оронтой код илгээлээ
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}
          {resendMsg && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm px-4 py-3 rounded-xl mb-4">
              {resendMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="flex justify-center gap-3 mb-6">
              {code.map((c, i) => (
                <input
                  key={i}
                  ref={(el) => { inputs.current[i] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={c}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-12 h-14 text-center text-xl font-bold bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition"
                />
              ))}
            </div>
            <button
              type="submit"
              disabled={loading || code.join('').length !== 6}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl font-semibold disabled:opacity-50"
            >
              {loading ? 'Баталгаажуулж байна...' : 'Баталгаажуулах'}
            </button>
          </form>

          <div className="mt-5">
            <button
              onClick={handleResend}
              disabled={countdown > 0}
              className="text-sm text-slate-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {countdown > 0 ? `Дахин илгээх (${countdown}с)` : 'Код ирсэнгүй? Дахин илгээх'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
