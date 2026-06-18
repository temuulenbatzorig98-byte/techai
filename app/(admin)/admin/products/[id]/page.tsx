'use client'
import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Product {
  id: string
  title: string
  description: string | null
  price: number
  fileKey: string
  fileName: string
  thumbnailUrl: string | null
  isPublished: boolean
  _count: { purchases: number }
}

export default function AdminProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [product, setProduct] = useState<Product | null>(null)
  const [form, setForm] = useState({ title: '', description: '', price: 0, thumbnailUrl: '', isPublished: false })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [fileUploading, setFileUploading] = useState(false)
  const [fileMsg, setFileMsg] = useState('')
  const [thumbUploading, setThumbUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const thumbRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch(`/api/admin/products/${id}`)
      .then((r) => r.json())
      .then(({ product: p }) => {
        setProduct(p)
        setForm({ title: p.title, description: p.description || '', price: p.price, thumbnailUrl: p.thumbnailUrl || '', isPublished: p.isPublished })
        setLoading(false)
      })
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    setMsg('')
    setError('')
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title,
        description: form.description || undefined,
        price: form.price,
        thumbnailUrl: form.thumbnailUrl || undefined,
        isPublished: form.isPublished,
      }),
    })
    const data = await res.json()
    setSaving(false)
    if (!res.ok) { setError(data.error); return }
    setMsg('Хадгаллаа')
    setProduct(data.product)
  }

  const handleDelete = async () => {
    if (!confirm('Устгах уу? Худалдаж авсан хэрэглэгчид нь татаж авах боломжгүй болно.')) return
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    router.push('/admin/products')
  }

  const uploadFile = async (file: File) => {
    setFileUploading(true)
    setFileMsg('')
    setError('')
    try {
      const contentType = file.type || 'application/octet-stream'
      const res = await fetch(`/api/admin/products/${id}/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, contentType }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }

      const putRes = await fetch(data.uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': contentType } })
      if (!putRes.ok) { setError(`R2 upload алдаа: ${putRes.status}`); return }

      setFileMsg(`✓ ${file.name}`)
      if (product) setProduct({ ...product, fileName: file.name })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Файл байршуулахад алдаа гарлаа')
    } finally {
      setFileUploading(false)
    }
  }

  const uploadThumb = async (file: File) => {
    setThumbUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/admin/upload-thumbnail', { method: 'POST', body: fd })
    const data = await res.json()
    setThumbUploading(false)
    if (!res.ok) { setError(data.error); return }
    setForm((p) => ({ ...p, thumbnailUrl: data.publicUrl }))
  }

  if (loading) return <div className="text-slate-400 dark:text-gray-500 p-8">Уншиж байна...</div>
  if (!product) return <div className="text-red-400 p-8">Бүтээгдэхүүн олдсонгүй</div>

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/products" className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white">← Бүтээгдэхүүнүүд</Link>
        <span className="text-slate-300 dark:text-white/20">/</span>
        <h1 className="font-syne text-xl font-bold text-slate-900 dark:text-white">{form.title}</h1>
      </div>

      <div className="bg-purple-600/10 border border-purple-500/20 rounded-xl px-4 py-2 mb-6 text-sm text-purple-400">
        {product._count.purchases} хэрэглэгч худалдаж авсан
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}
      {msg && <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm px-4 py-3 rounded-xl mb-4">{msg}</div>}

      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-2xl p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">Нэр</label>
          <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white text-sm outline-none focus:border-purple-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">Тайлбар</label>
          <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3}
            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white text-sm outline-none focus:border-purple-500 resize-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">Үнэ (₮)</label>
          <input type="number" min={0} value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))}
            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white text-sm outline-none focus:border-purple-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">Татах файл</label>
          <p className="text-xs text-slate-500 dark:text-gray-400 mb-2">Одоогийн: <span className="text-cyan-400">{product.fileName}</span></p>
          <input ref={fileRef} type="file" className="hidden" onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0])} />
          <button onClick={() => fileRef.current?.click()} disabled={fileUploading}
            className="px-4 py-2 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-300 rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-white/5 disabled:opacity-50">
            {fileUploading ? 'Байршуулж байна...' : 'Файл солих'}
          </button>
          {fileMsg && <span className="ml-3 text-xs text-green-400">{fileMsg}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">Зураг</label>
          {form.thumbnailUrl && <img src={form.thumbnailUrl} alt="" className="w-32 h-20 object-cover rounded-lg mb-2" />}
          <input ref={thumbRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadThumb(e.target.files[0])} />
          <button onClick={() => thumbRef.current?.click()} disabled={thumbUploading}
            className="px-4 py-2 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-300 rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-white/5 disabled:opacity-50">
            {thumbUploading ? 'Байршуулж байна...' : form.thumbnailUrl ? 'Зураг солих' : 'Зураг нэмэх'}
          </button>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <div className={`w-10 h-6 rounded-full transition-colors ${form.isPublished ? 'bg-purple-600' : 'bg-slate-200 dark:bg-white/10'}`}
            onClick={() => setForm((p) => ({ ...p, isPublished: !p.isPublished }))}>
            <div className={`w-4 h-4 bg-white rounded-full mt-1 transition-transform ${form.isPublished ? 'translate-x-5' : 'translate-x-1'}`} />
          </div>
          <span className="text-sm text-slate-700 dark:text-gray-300">Нийтлэх</span>
        </label>

        <div className="flex gap-3 pt-2">
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl font-semibold text-sm disabled:opacity-50">
            {saving ? 'Хадгалж байна...' : 'Хадгалах'}
          </button>
          <button onClick={handleDelete}
            className="px-4 py-3 border border-red-500/30 text-red-400 rounded-xl text-sm hover:bg-red-500/10">
            Устгах
          </button>
        </div>
      </div>
    </div>
  )
}
