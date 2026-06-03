'use client'
import { useState } from 'react'

interface User {
  name: string
  email: string | null
  phone: string | null
}

export function ProfileEditForm({ user }: { user: User }) {
  const [name, setName] = useState(user.name)
  const [phone, setPhone] = useState(user.phone ?? '')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.trim(),
        phone: phone.trim() === '' ? null : phone.trim(),
      }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error ?? 'Алдаа гарлаа')
      return
    }

    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  const clearPhone = () => {
    setPhone('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm px-4 py-3 rounded-xl">
          ✓ Мэдээлэл амжилттай хадгалагдлаа
        </div>
      )}

      <div>
        <label className="block text-sm text-slate-500 dark:text-gray-400 mb-1.5">Нэр</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          required
          minLength={2}
          className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
          placeholder="Таны нэр"
        />
      </div>

      <div>
        <label className="block text-sm text-slate-500 dark:text-gray-400 mb-1.5">Имэйл</label>
        <input
          value={user.email ?? ''}
          disabled
          className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-400 dark:text-gray-500 cursor-not-allowed"
        />
        <p className="text-xs text-gray-600 mt-1">Имэйл хаягийг өөрчлөх боломжгүй</p>
      </div>

      <div>
        <label className="block text-sm text-slate-500 dark:text-gray-400 mb-1.5">Утасны дугаар</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500 text-sm select-none">+976</span>
          <input
            value={phone}
            onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 8))}
            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-16 pr-12 py-3 text-slate-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
            placeholder="88001234"
            inputMode="numeric"
          />
          {phone && (
            <button
              type="button"
              onClick={clearPhone}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500 hover:text-red-400 transition text-lg leading-none"
              title="Устгах"
            >
              ×
            </button>
          )}
        </div>
        <p className="text-xs text-gray-600 mt-1">8 оронтой Монгол дугаар. Хоосон үлдээвэл устгана.</p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl font-semibold disabled:opacity-50 hover:opacity-90 transition"
      >
        {loading ? 'Хадгалж байна...' : 'Хадгалах'}
      </button>
    </form>
  )
}
