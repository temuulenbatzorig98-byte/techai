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

export function CouponManager({ coupons }: { coupons: Coupon[] }) {
  const router = useRouter()
  const [form, setForm] = useState({ code: '', discountType: 'PERCENT', discountValue: '', maxUses: '', validFrom: '', validUntil: '' })
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/admin/coupons', {
      method: 'POST',
      body: JSON.stringify({
        ...form,
        discountValue: Number(form.discountValue),
        maxUses: form.maxUses ? Number(form.maxUses) : null,
        code: form.code.toUpperCase(),
      }),
      headers: { 'Content-Type': 'application/json' },
    })
    setLoading(false)
    setShowForm(false)
    router.refresh()
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
        <form onSubmit={handleCreate} className="bg-[#111827] border border-white/10 rounded-2xl p-6 mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Код</label>
              <input value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                placeholder="SUMMER30" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Хямдралын төрөл</label>
              <select value={form.discountType} onChange={e => setForm(p => ({ ...p, discountType: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none">
                <option value="PERCENT">Хувь (%)</option>
                <option value="FIXED">Тогтмол (₮)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Утга</label>
              <input type="number" value={form.discountValue} onChange={e => setForm(p => ({ ...p, discountValue: e.target.value }))} required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none"
                placeholder={form.discountType === 'PERCENT' ? '30' : '10000'} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Хэрэглэх тоо (хоосон = хязгааргүй)</label>
              <input type="number" value={form.maxUses} onChange={e => setForm(p => ({ ...p, maxUses: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none" placeholder="100" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Эхлэх огноо</label>
              <input type="datetime-local" value={form.validFrom} onChange={e => setForm(p => ({ ...p, validFrom: e.target.value }))} required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Дуусах огноо</label>
              <input type="datetime-local" value={form.validUntil} onChange={e => setForm(p => ({ ...p, validUntil: e.target.value }))} required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none" />
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
          <div key={c.id} className="bg-[#111827] border border-white/10 rounded-xl p-4 flex items-center justify-between">
            <div>
              <code className="text-cyan-400 font-bold">{c.code}</code>
              <p className="text-xs text-gray-400 mt-1">
                {c.discountType === 'PERCENT' ? `${c.discountValue}%` : `₮${c.discountValue.toLocaleString()}`} хямдрал
                {c.maxUses && ` · ${c.usedCount}/${c.maxUses} хэрэглэгдсэн`}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(c.validFrom).toLocaleDateString('mn-MN')} — {new Date(c.validUntil).toLocaleDateString('mn-MN')}
              </p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${c.isActive ? 'bg-green-600/20 text-green-400' : 'bg-gray-600/20 text-gray-400'}`}>
              {c.isActive ? 'Идэвхтэй' : 'Идэвхгүй'}
            </span>
          </div>
        ))}
        {coupons.length === 0 && <div className="text-center py-10 text-gray-500">Купон байхгүй</div>}
      </div>
    </div>
  )
}
