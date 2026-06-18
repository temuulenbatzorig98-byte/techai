'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminProductNewPage() {
  const router = useRouter()
  const [form, setForm] = useState({ title: '', description: '', price: 0, thumbnailUrl: '', isPublished: false })
  const [pendingFile, setPendingFile] = useState<{ key: string; name: string } | null>(null)
  const [fileUploading, setFileUploading] = useState(false)
  const [fileMsg, setFileMsg] = useState('')
  const [thumbUploading, setThumbUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const thumbRef = useRef<HTMLInputElement>(null)

  const uploadFile = async (file: File) => {
    setFileUploading(true)
    setFileMsg('')
    setError('')
    try {
      const contentType = file.type || 'application/octet-stream'
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'resource', courseId: 'products', lessonId: `new-${Date.now()}`, filename: file.name, contentType }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }

      const putRes = await fetch(data.uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': contentType } })
      if (!putRes.ok) { setError(`R2 upload алдаа: ${putRes.status}`); return }

      setPendingFile({ key: data.key, name: file.name })
      setFileMsg(`✓ ${file.name}`)
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

  const handleSave = async () => {
    if (!pendingFile) { setError('Татах файл оруулна уу'); return }
    if (!form.title.trim()) { setError('Нэр оруулна уу'); return }
    setSaving(true)
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title,
        description: form.description || undefined,
        price: form.price,
        fileKey: pendingFile.key,
        fileName: pendingFile.name,
        thumbnailUrl: form.thumbnailUrl || undefined,
        isPublished: form.isPublished,
      }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setSaving(false); return }
    router.push(`/admin/products/${data.product.id}`)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/products" className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white">← Бүтээгдэхүүнүүд</Link>
        <span className="text-slate-300 dark:text-white/20">/</span>
        <h1 className="font-syne text-xl font-bold text-slate-900 dark:text-white">Шинэ бүтээгдэхүүн</h1>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}

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
          <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">Татах файл <span className="text-red-400">*</span></label>
          <input ref={fileRef} type="file" className="hidden" onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0])} />
          <button onClick={() => fileRef.current?.click()} disabled={fileUploading}
            className="px-4 py-2 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-300 rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-white/5 disabled:opacity-50">
            {fileUploading ? 'Байршуулж байна...' : 'Файл сонгох'}
          </button>
          {fileMsg && <span className="ml-3 text-xs text-green-400">{fileMsg}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">Зураг (заавал биш)</label>
          {form.thumbnailUrl && <img src={form.thumbnailUrl} alt="" className="w-32 h-20 object-cover rounded-lg mb-2" />}
          <input ref={thumbRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadThumb(e.target.files[0])} />
          <button onClick={() => thumbRef.current?.click()} disabled={thumbUploading}
            className="px-4 py-2 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-300 rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-white/5 disabled:opacity-50">
            {thumbUploading ? 'Байршуулж байна...' : 'Зураг сонгох'}
          </button>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <div className={`w-10 h-6 rounded-full transition-colors ${form.isPublished ? 'bg-purple-600' : 'bg-slate-200 dark:bg-white/10'}`}
            onClick={() => setForm((p) => ({ ...p, isPublished: !p.isPublished }))}>
            <div className={`w-4 h-4 bg-white rounded-full mt-1 transition-transform ${form.isPublished ? 'translate-x-5' : 'translate-x-1'}`} />
          </div>
          <span className="text-sm text-slate-700 dark:text-gray-300">Нийтлэх</span>
        </label>

        <button onClick={handleSave} disabled={saving}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl font-semibold text-sm disabled:opacity-50">
          {saving ? 'Үүсгэж байна...' : 'Үүсгэх'}
        </button>
      </div>
    </div>
  )
}
