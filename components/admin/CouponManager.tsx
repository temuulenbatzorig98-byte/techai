'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Coupon {
  id: string
  code: string
  discountType: string
  discountValue: number
  maxUses: number | null
  usedCount: number
  validFrom: Date
  validUntil: Date
  isActive: boolean
  _count: { payments: number }
}

export function CouponManager({ coupons: initial }: { coupons: Coupon[] }) {
  const router = useRouter()
  const [coupons, setCoupons] = useState(initial)
  const [form, setForm] = useState({ code: '', discountType: 'PERCENT', discountValue: '', maxUses: '', validFrom: '', validUntil: '' })
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/admin/coupons', {
      method: 'POST',
      body: JSON.stringify({
        ...form,
        discountValue: Number(form.discountValue),
        maxUses: form.maxUses ? Number(form.maxUses) : null,
        code: form.code.toUpperCase(),
        validFrom: new Date(form.validFrom).toISOString(),
        validUntil: new Date(form.validUntil).toISOString(),
      }),
      headers: { 'Content-Type': 'application/json' },
    })
    setLoading(false)
    if (res.ok) {
      setShowForm(false)
      setForm({ code: '', discountType: 'PERCENT', discountValue: '', maxUses: '', validFrom: '', validUntil: '' })
      router.refresh()
    }
  }

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`"${code}" купоныг устгах уу?`)) return
    setDeleting(id)
    const res = await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setCoupons((prev) => prev.filter((c) => c.id !== id))
    } else {
      const data = await res.json()
      alert(data.error || 'Устгахад алдаа гарлаа')
    }
    setDeleting(null)
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl text-sm font-semibold">
          {showForm ? 'Болих' : '+ Шинэ купон'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-2xl p-6 mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 dark:text-gray-400 mb-1">Код</label>
              <input value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} required
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-purple-500"
                placeholder="SUMMER30" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 dark:text-gray-400 mb-1">Хямдралын төрөл</label>
              <select value={form.discountType} onChange={e => setForm(p => ({ ...p, discountType: e.target.value }))}
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-900 dark:text-white text-sm focus:outline-none">
                <option value="PERCENT">Хувь (%)</option>
                <option value="FIXED">Тогтмол (₮)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 dark:text-gray-400 mb-1">Утга</label>
              <input type="number" value={form.discountValue} onChange={e => setForm(p => ({ ...p, discountValue: e.target.value }))} required
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-900 dark:text-white text-sm focus:outline-none"
                placeholder={form.discountType === 'PERCENT' ? '30' : '10000'} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 dark:text-gray-400 mb-1">Хэрэглэх тоо (хоосон = хязгааргүй)</label>
              <input type="number" value={form.maxUses} onChange={e => setForm(p => ({ ...p, maxUses: e.target.value }))}
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-900 dark:text-white text-sm focus:outline-none" placeholder="100" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 dark:text-gray-400 mb-1">Эхлэх огноо</label>
              <input type="datetime-local" value={form.validFrom} onChange={e => setForm(p => ({ ...p, validFrom: e.target.value }))} required
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-900 dark:text-white text-sm focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 dark:text-gray-400 mb-1">Дуусах огноо</label>
              <input type="datetime-local" value={form.validUntil} onChange={e => setForm(p => ({ ...p, validUntil: e.target.value }))} required
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-900 dark:text-white text-sm focus:outline-none" />
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl text-sm font-semibold disabled:opacity-50">
            {loading ? 'Хадгалж байна...' : 'Купон үүсгэх'}
          </button>
        </form>
      )}

      <div className="space-y-3">
        {coupons.map((c) => (
          <div key={c.id} className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <code className="text-cyan-400 font-bold">{c.code}</code>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                {c.discountType === 'PERCENT' ? `${c.discountValue}%` : `₮${c.discountValue.toLocaleString()}`} хямдрал
                {c.maxUses ? ` · ${c.usedCount}/${c.maxUses} хэрэглэгдсэн` : ` · ${c.usedCount} удаа хэрэглэгдсэн`}
              </p>
              <p className="text-xs text-slate-400 dark:text-gray-500">
                {new Date(c.validFrom).toLocaleDateString('mn-MN')} — {new Date(c.validUntil).toLocaleDateString('mn-MN')}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className={`text-xs px-2 py-0.5 rounded-full ${c.isActive ? 'bg-green-600/20 text-green-400' : 'bg-gray-600/20 text-slate-500 dark:text-gray-400'}`}>
                {c.isActive ? 'Идэвхтэй' : 'Идэвхгүй'}
              </span>
              <button
                onClick={() => handleDelete(c.id, c.code)}
                disabled={deleting === c.id}
                className="text-xs text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition disabled:opacity-50"
              >
                {deleting === c.id ? '...' : 'Устгах'}
              </button>
            </div>
          </div>
        ))}
        {coupons.length === 0 && <div className="text-center py-10 text-slate-400 dark:text-gray-500">Купон байхгүй</div>}
      </div>
    </div>
  )
}
