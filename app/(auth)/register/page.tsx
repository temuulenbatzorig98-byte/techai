'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      setError('Нууц үг таарахгүй байна')
      return
    }
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error)
      return
    }

    router.push(`/verify?userId=${data.userId}&email=${encodeURIComponent(form.email)}`)
  }

  return (
    <div className="min-h-screen hero-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-syne text-2xl font-bold gradient-text">
            AutoLearn AI
          </Link>
          <p className="text-gray-400 mt-2">Шинэ дансаа үүсгэнэ үү</p>
        </div>

        <div className="bg-[#111827] border border-white/10 rounded-2xl p-8">
          <h1 className="font-syne text-xl font-bold text-white mb-6">Бүртгүүлэх</h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: 'name', label: 'Нэр', type: 'text', placeholder: 'Таны нэр' },
              { key: 'email', label: 'Имэйл', type: 'email', placeholder: 'email@example.com' },
              { key: 'password', label: 'Нууц үг', type: 'password', placeholder: '8+ тэмдэгт' },
              { key: 'confirmPassword', label: 'Нууц үг давтах', type: 'password', placeholder: '••••••••' },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="block text-sm text-gray-400 mb-1.5">{label}</label>
                <input
                  type={type}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                  placeholder={placeholder}
                />
              </div>
            ))}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl font-semibold disabled:opacity-50 hover:opacity-90 transition"
            >
              {loading ? 'Бүртгэж байна...' : 'Бүртгүүлэх'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Бүртгэлтэй юу?{' '}
            <Link href="/login" className="text-purple-400 hover:text-purple-300">
              Нэвтрэх
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
