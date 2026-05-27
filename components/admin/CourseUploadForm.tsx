'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function CourseUploadForm() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '',
    titleMn: '',
    description: '',
    descriptionMn: '',
    price: '',
    originalPrice: '',
    level: 'BEGINNER',
    category: '',
    slug: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k: string, v: string) => {
    setForm((p) => ({ ...p, [k]: v }))
    if (k === 'titleMn' && !form.slug) {
      const slug = v.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
      setForm((p) => ({ ...p, slug, [k]: v }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/courses', {
      method: 'POST',
      body: JSON.stringify({ ...form, price: Number(form.price), originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined }),
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error); return }
    router.push(`/admin/courses/${data.course.id}`)
  }

  const fields = [
    { key: 'titleMn', label: 'Гарчиг (Монгол)', placeholder: 'AI Chatbot Бүтээх' },
    { key: 'title', label: 'Гарчиг (Англи)', placeholder: 'Build AI Chatbot' },
    { key: 'slug', label: 'URL slug', placeholder: 'ai-chatbot-buiteh' },
    { key: 'category', label: 'Ангилал', placeholder: 'AI Chatbot' },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">{error}</div>}

      {fields.map(({ key, label, placeholder }) => (
        <div key={key}>
          <label className="block text-sm text-gray-400 mb-1.5">{label}</label>
          <input value={form[key as keyof typeof form]} onChange={e => set(key, e.target.value)} required
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            placeholder={placeholder} />
        </div>
      ))}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Үнэ (₮)</label>
          <input type="number" value={form.price} onChange={e => set('price', e.target.value)} required
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
            placeholder="79000" />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Хуучин үнэ (₮)</label>
          <input type="number" value={form.originalPrice} onChange={e => set('originalPrice', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
            placeholder="120000" />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1.5">Түвшин</label>
        <select value={form.level} onChange={e => set('level', e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500">
          <option value="BEGINNER">Анхан шат</option>
          <option value="INTERMEDIATE">Дунд шат</option>
          <option value="ADVANCED">Ахисан шат</option>
        </select>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1.5">Тайлбар (Монгол)</label>
        <textarea value={form.descriptionMn} onChange={e => set('descriptionMn', e.target.value)} required rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 resize-none"
          placeholder="Курсын тайлбар..." />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1.5">Тайлбар (Англи)</label>
        <textarea value={form.description} onChange={e => set('description', e.target.value)} required rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 resize-none"
          placeholder="Course description..." />
      </div>

      <button type="submit" disabled={loading}
        className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl font-semibold disabled:opacity-50">
        {loading ? 'Хадгалж байна...' : 'Курс үүсгэх'}
      </button>
    </form>
  )
}
