'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useLoading } from '@/components/layout/GlobalLoader'

export function CourseUploadForm() {
  const router = useRouter()
  const { show: showLoader, hide: hideLoader } = useLoading()
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
  const [isFree, setIsFree] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [thumbnailPreview, setThumbnailPreview] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const set = (k: string, v: string) => {
    setForm((p) => ({ ...p, [k]: v }))
    if (k === 'titleMn' && !form.slug) {
      const slug = v.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
      setForm((p) => ({ ...p, slug, [k]: v }))
    }
  }

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setThumbnailPreview(URL.createObjectURL(file))
    setUploading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: JSON.stringify({ type: 'thumbnail', filename: file.name, contentType: file.type }),
        headers: { 'Content-Type': 'application/json' },
      })
      const { uploadUrl, publicUrl, error: apiError } = await res.json()
      if (!res.ok) throw new Error(apiError || 'Upload алдаа')

      await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } })
      setThumbnailUrl(publicUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Зураг upload хийхэд алдаа гарлаа')
      setThumbnailPreview('')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    showLoader()
    const res = await fetch('/api/courses', {
      method: 'POST',
      body: JSON.stringify({
        ...form,
        price: isFree ? 0 : Number(form.price),
        originalPrice: isFree ? undefined : (form.originalPrice ? Number(form.originalPrice) : undefined),
        thumbnailUrl: thumbnailUrl || undefined,
      }),
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { hideLoader(); setError(data.error); return }
    hideLoader()
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

      <div>
        <label className="block text-sm text-slate-500 dark:text-gray-400 mb-1.5">Зураг (Thumbnail)</label>
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          className="relative cursor-pointer aspect-video bg-slate-50 dark:bg-white/5 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-xl overflow-hidden hover:border-purple-500/50 transition flex items-center justify-center"
        >
          {thumbnailPreview ? (
            <>
              <img src={thumbnailPreview} alt="preview" className="w-full h-full object-cover" />
              {uploading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-white/20 border-t-purple-500 rounded-full animate-spin" />
                </div>
              )}
              {!uploading && thumbnailUrl && (
                <div className="absolute top-2 right-2 bg-green-500 text-slate-900 dark:text-white text-xs px-2 py-1 rounded-full">✓ Хадгалагдсан</div>
              )}
            </>
          ) : (
            <div className="text-center p-6">
              <div className="text-3xl mb-2">🖼️</div>
              <p className="text-sm text-slate-500 dark:text-gray-400">Зураг сонгоход дарна уу</p>
              <p className="text-xs text-gray-600 mt-1">JPG, PNG, WebP • Дээд тал 5MB</p>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageSelect}
          className="hidden"
        />
      </div>

      {fields.map(({ key, label, placeholder }) => (
        <div key={key}>
          <label className="block text-sm text-slate-500 dark:text-gray-400 mb-1.5">{label}</label>
          <input value={form[key as keyof typeof form]} onChange={e => set(key, e.target.value)} required
            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            placeholder={placeholder} />
        </div>
      ))}

      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={isFree} onChange={e => setIsFree(e.target.checked)} className="w-4 h-4 rounded accent-purple-500" />
        <span className="text-sm text-slate-700 dark:text-gray-300">Үнэгүй курс</span>
      </label>

      {!isFree && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-500 dark:text-gray-400 mb-1.5">Үнэ (₮)</label>
            <input type="number" value={form.price} onChange={e => set('price', e.target.value)} required
              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
              placeholder="79000" />
          </div>
          <div>
            <label className="block text-sm text-slate-500 dark:text-gray-400 mb-1.5">Хуучин үнэ (₮)</label>
            <input type="number" value={form.originalPrice} onChange={e => set('originalPrice', e.target.value)}
              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
              placeholder="120000" />
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm text-slate-500 dark:text-gray-400 mb-1.5">Түвшин</label>
        <select value={form.level} onChange={e => set('level', e.target.value)}
          className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500">
          <option value="BEGINNER">Анхан шат</option>
          <option value="INTERMEDIATE">Дунд шат</option>
          <option value="ADVANCED">Ахисан шат</option>
        </select>
      </div>

      <div>
        <label className="block text-sm text-slate-500 dark:text-gray-400 mb-1.5">Тайлбар (Монгол)</label>
        <textarea value={form.descriptionMn} onChange={e => set('descriptionMn', e.target.value)} required rows={3}
          className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 resize-none"
          placeholder="Курсын тайлбар..." />
      </div>
      <div>
        <label className="block text-sm text-slate-500 dark:text-gray-400 mb-1.5">Тайлбар (Англи)</label>
        <textarea value={form.description} onChange={e => set('description', e.target.value)} required rows={3}
          className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 resize-none"
          placeholder="Course description..." />
      </div>

      <button type="submit" disabled={loading || uploading}
        className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl font-semibold disabled:opacity-50">
        {loading ? 'Хадгалж байна...' : uploading ? 'Зураг upload хийж байна...' : 'Курс үүсгэх'}
      </button>
    </form>
  )
}
