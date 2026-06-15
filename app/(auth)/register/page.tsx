'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLoading } from '@/components/layout/GlobalLoader'

export default function RegisterPage() {
  const router = useRouter()
  const { show: showLoader, hide: hideLoader } = useLoading()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      setError('Нууц үг таарахгүй байна')
      return
    }
    if (!agreed) {
      setError('Үйлчилгээний нөхцөл болон Нууцлалын бодлогыг зөвшөөрөх шаардлагатай')
      return
    }
    setLoading(true)
    setError('')
    showLoader()

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await res.json()

    if (!res.ok) {
      hideLoader()
      setLoading(false)
      setError(data.error)
      return
    }

    router.push(`/verify?userId=${data.userId}&email=${encodeURIComponent(form.email)}`)
  }

  const fields = [
    { key: 'name', label: 'Нэр', type: 'text', placeholder: 'Таны нэр', autoComplete: 'name' },
    { key: 'email', label: 'Имэйл', type: 'email', placeholder: 'email@example.com', autoComplete: 'email' },
    { key: 'password', label: 'Нууц үг', type: 'password', placeholder: '8+ тэмдэгт', autoComplete: 'new-password' },
    { key: 'confirmPassword', label: 'Нууц үг давтах', type: 'password', placeholder: '••••••••', autoComplete: 'new-password' },
  ] as const

  return (
    <div className="min-h-screen hero-bg flex items-center justify-center p-4 py-12">
      {/* Background accents */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-md animate-fade-in-up">
        {/* Logo & greeting */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block font-syne text-2xl font-bold gradient-text mb-3 hover:opacity-90 transition-opacity">
            Negun AI
          </Link>
          <h1 className="text-slate-800 dark:text-white font-syne text-2xl font-bold">Шинэ данс үүсгэх</h1>
          <p className="text-slate-500 dark:text-gray-400 mt-1 text-sm">Үнэгүй бүртгүүлж, суралцаж эхэлнэ үү</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-2xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)]">

          {/* Error alert */}
          {error && (
            <div className="flex items-start gap-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl mb-5">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="8" r="7" /><path d="M8 5v3M8 11h.01" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ key, label, type, placeholder, autoComplete }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">
                  {label}
                </label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                  required
                  autoComplete={autoComplete}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 text-sm input-premium"
                  placeholder={placeholder}
                />
              </div>
            ))}

            {/* Terms checkbox */}
            <label className="flex items-start gap-3 cursor-pointer group mt-2">
              <div className="relative mt-0.5 flex-shrink-0">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-150 ${
                  agreed
                    ? 'bg-purple-600 border-purple-600'
                    : 'border-slate-300 dark:border-white/20 bg-white dark:bg-white/5 group-hover:border-purple-400 dark:group-hover:border-purple-500'
                }`}>
                  {agreed && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1.5 5l2.5 2.5L8.5 2" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed">
                <Link href="/tos" target="_blank" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 underline underline-offset-2 transition-colors">
                  Үйлчилгээний нөхцөл болон Нууцлалын бодлого
                </Link>
                -г уншиж, зөвшөөрч байна
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !agreed}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-95 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200 mt-1"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Бүртгэж байна...
                </span>
              ) : 'Бүртгүүлэх'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-100 dark:bg-white/10" />
            <span className="text-xs text-slate-400 dark:text-gray-500">эсвэл</span>
            <div className="flex-1 h-px bg-slate-100 dark:bg-white/10" />
          </div>

          <p className="text-center text-sm text-slate-500 dark:text-gray-400">
            Бүртгэлтэй юу?{' '}
            <Link href="/login" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors">
              Нэвтрэх
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
