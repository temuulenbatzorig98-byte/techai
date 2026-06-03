'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLoading } from '@/components/layout/GlobalLoader'

interface Lesson {
  id: string
  title: string
  titleMn?: string | null
  videoKey?: string | null
  duration: number
  order: number
  isFree: boolean
  isPublished: boolean
}

interface Section {
  id: string
  title: string
  order: number
  lessons: Lesson[]
}

interface Course {
  id: string
  title: string
  titleMn: string
  description: string
  descriptionMn: string
  price: number
  originalPrice?: number | null
  level: string
  category: string
  isPublished: boolean
  isFeatured: boolean
  thumbnailUrl?: string | null
  sections: Section[]
}

interface R2File {
  key: string
  name: string
  size: number
  lastModified?: string
}

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

// ── R2 File Picker Modal ──────────────────────────────────────
function R2Picker({ onSelect, onClose }: { onSelect: (key: string) => void; onClose: () => void }) {
  const [files, setFiles] = useState<R2File[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/admin/r2-files')
      .then((r) => r.json())
      .then((d) => { setFiles(d.files ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = files.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.key.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
      <div className="bg-white dark:bg-[#0d1220] border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-2xl flex flex-col" style={{ maxHeight: '80vh' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-white/10 shrink-0">
          <h3 className="font-syne font-bold text-slate-900 dark:text-white">Cloudflare R2 — Бичлэг сонгох</h3>
          <button onClick={onClose} className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white text-xl leading-none">✕</button>
        </div>

        <div className="px-5 py-3 border-b border-slate-200 dark:border-white/10 shrink-0">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Нэрээр хайх..."
            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-gray-600 focus:outline-none focus:border-purple-500"
            autoFocus
          />
        </div>

        <div className="overflow-y-auto flex-1 px-3 py-3">
          {loading && (
            <div className="flex items-center justify-center h-32">
              <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400 dark:text-gray-500 text-sm">
              {files.length === 0 ? 'R2 bucket хоосон байна' : 'Хайлтад тохирсон файл олдсонгүй'}
            </div>
          )}
          {!loading && filtered.map((f) => (
            <button
              key={f.key}
              onClick={() => onSelect(f.key)}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition text-left group"
            >
              <div className="w-10 h-10 bg-purple-600/20 rounded-xl flex items-center justify-center shrink-0 text-lg group-hover:bg-purple-600/40 transition">
                🎬
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-900 dark:text-white font-medium truncate">{f.name}</p>
                <p className="text-xs text-slate-400 dark:text-gray-500 truncate">{f.key}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xs text-slate-500 dark:text-gray-400">{formatSize(f.size)}</p>
                {f.lastModified && (
                  <p className="text-xs text-gray-600">{new Date(f.lastModified).toLocaleDateString('mn-MN')}</p>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="px-5 py-3 border-t border-slate-200 dark:border-white/10 shrink-0">
          <p className="text-xs text-gray-600">{files.length} файл олдлоо</p>
        </div>
      </div>
    </div>
  )
}

// ── Video Key Input with R2 Picker ────────────────────────────
function VideoKeyInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [showPicker, setShowPicker] = useState(false)
  return (
    <div>
      {showPicker && (
        <R2Picker
          onSelect={(key) => { onChange(key); setShowPicker(false) }}
          onClose={() => setShowPicker(false)}
        />
      )}
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="R2 key эсвэл R2-с сонгох"
          className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-gray-600 focus:outline-none focus:border-purple-500"
        />
        <button
          type="button"
          onClick={() => setShowPicker(true)}
          className="px-4 py-2.5 bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-xl text-sm font-medium hover:bg-purple-600/50 transition whitespace-nowrap"
        >
          ☁ R2-с сонгох
        </button>
      </div>
      {value && (
        <p className="text-xs text-green-500/70 mt-1.5">✓ {value}</p>
      )}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────
export default function AdminCourseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { show: showLoader, hide: hideLoader } = useLoading()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const [newSectionTitle, setNewSectionTitle] = useState('')
  const [addingSection, setAddingSection] = useState(false)

  const [addingLessonTo, setAddingLessonTo] = useState<string | null>(null)
  const [newLesson, setNewLesson] = useState({ title: '', titleMn: '', videoKey: '', isFree: false })

  const [editingLesson, setEditingLesson] = useState<Lesson & { sectionId: string } | null>(null)
  const [granting, setGranting] = useState(false)
  const [thumbPreview, setThumbPreview] = useState<string | null>(null)
  const [uploadingThumb, setUploadingThumb] = useState(false)
  const thumbInputRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    const res = await fetch(`/api/admin/courses/${id}`)
    if (!res.ok) { router.push('/admin/courses'); return }
    const data = await res.json()
    setCourse(data.course)
    setLoading(false)
  }, [id, router])

  useEffect(() => { load() }, [load])

  const flash = (text: string) => {
    setMsg(text)
    setTimeout(() => setMsg(''), 3500)
  }

  const deleteCourse = async () => {
    if (!confirm('Курсыг бүрмөсөн устгах уу? Бүх хичээл, бүлэг мөн устна.')) return
    showLoader()
    await fetch(`/api/admin/courses/${id}`, { method: 'DELETE' })
    hideLoader()
    router.push('/admin/courses')
  }

  const togglePublish = async () => {
    if (!course) return
    setSaving(true)
    const res = await fetch(`/api/admin/courses/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublished: !course.isPublished }),
    })
    const data = await res.json()
    setSaving(false)
    if (res.ok) { setCourse((c) => c ? { ...c, isPublished: data.course.isPublished } : c); flash('Хадгаллаа') }
  }

  const addSection = async () => {
    if (!newSectionTitle.trim()) return
    setAddingSection(true)
    showLoader()
    const order = (course?.sections.length ?? 0) + 1
    const res = await fetch('/api/admin/sections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId: id, title: newSectionTitle.trim(), order }),
    })
    setAddingSection(false)
    if (res.ok) { setNewSectionTitle(''); await load(); flash('Бүлэг нэмэгдлээ') }
    hideLoader()
  }

  const deleteSection = async (sectionId: string) => {
    if (!confirm('Энэ бүлгийг устгах уу? Дотрах хичээлүүд мөн устна.')) return
    showLoader()
    await fetch(`/api/admin/sections/${sectionId}`, { method: 'DELETE' })
    await load()
    hideLoader()
    flash('Устгагдлаа')
  }

  const addLesson = async () => {
    if (!addingLessonTo || !newLesson.title.trim()) return
    showLoader()
    const section = course?.sections.find((s) => s.id === addingLessonTo)
    const order = (section?.lessons.length ?? 0) + 1

    const res = await fetch('/api/admin/lessons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sectionId: addingLessonTo,
        title: newLesson.title.trim(),
        titleMn: newLesson.titleMn.trim() || undefined,
        videoKey: newLesson.videoKey.trim() || undefined,
        order,
        isFree: newLesson.isFree,
        isPublished: true,
      }),
    })
    if (res.ok) {
      setNewLesson({ title: '', titleMn: '', videoKey: '', isFree: false })
      setAddingLessonTo(null)
      await load()
      flash('Хичээл нэмэгдлээ')
    }
    hideLoader()
  }

  const saveLesson = async () => {
    if (!editingLesson) return
    showLoader()
    const res = await fetch(`/api/admin/lessons/${editingLesson.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: editingLesson.title,
        titleMn: editingLesson.titleMn || undefined,
        videoKey: editingLesson.videoKey || undefined,
        isFree: editingLesson.isFree,
        isPublished: editingLesson.isPublished,
      }),
    })
    hideLoader()
    if (res.ok) { setEditingLesson(null); await load(); flash('Хичээл хадгалагдлаа') }
  }

  const handleThumbSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !course) return
    setThumbPreview(URL.createObjectURL(file))
    setUploadingThumb(true)
    try {
      const thumbForm = new FormData()
      thumbForm.append('file', file)
      const res = await fetch('/api/admin/upload-thumbnail', {
        method: 'POST',
        body: thumbForm,
      })
      const { publicUrl, error: uploadErr } = await res.json()
      if (!res.ok) throw new Error(uploadErr || 'Upload алдаа')
      await fetch(`/api/admin/courses/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ thumbnailUrl: publicUrl }),
      })
      setCourse((c) => c ? { ...c, thumbnailUrl: publicUrl } : c)
      flash('Зураг хадгалагдлаа')
    } catch {
      flash('Зураг upload хийхэд алдаа гарлаа')
      setThumbPreview(null)
    } finally {
      setUploadingThumb(false)
      if (thumbInputRef.current) thumbInputRef.current.value = ''
    }
  }

  const grantAccess = async () => {
    setGranting(true)
    const res = await fetch(`/api/admin/courses/${id}/grant-access`, { method: 'POST' })
    const data = await res.json()
    setGranting(false)
    if (res.ok) {
      if (data.firstLessonId) {
        router.push(`/learn/${id}/${data.firstLessonId}`)
      } else {
        flash('Хандалт олгогдлоо — хичээл байхгүй байна')
      }
    }
  }

  const deleteLesson = async (lessonId: string) => {
    if (!confirm('Хичээлийг устгах уу?')) return
    showLoader()
    await fetch(`/api/admin/lessons/${lessonId}`, { method: 'DELETE' })
    await load()
    hideLoader()
    flash('Устгагдлаа')
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!course) return null

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/courses" className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white text-sm">← Курсууд</Link>
          <span className="text-gray-600">/</span>
          <h1 className="font-syne text-xl font-bold text-slate-900 dark:text-white">{course.titleMn}</h1>
        </div>
        <div className="flex items-center gap-3">
          {msg && <span className="text-green-400 text-sm">{msg}</span>}
          <button
            onClick={grantAccess}
            disabled={granting}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 disabled:opacity-50"
          >
            {granting ? '...' : '▶ Тест үзэх'}
          </button>
          <button
            onClick={deleteCourse}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
          >
            Устгах
          </button>
          <button
            onClick={togglePublish}
            disabled={saving}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              course.isPublished
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30'
                : 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
            }`}
          >
            {saving ? '...' : course.isPublished ? 'Нуух' : 'Нийтлэх'}
          </button>
        </div>
      </div>

      {/* Thumbnail */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-700 dark:text-gray-300">Зураг (Thumbnail)</p>
          <button
            onClick={() => thumbInputRef.current?.click()}
            disabled={uploadingThumb}
            className="text-xs px-3 py-1.5 bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-lg hover:bg-purple-600/50 transition disabled:opacity-50"
          >
            {uploadingThumb ? 'Хадгалж байна...' : '🖼 Зураг солих'}
          </button>
          <input
            ref={thumbInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleThumbSelect}
            className="hidden"
          />
        </div>
        <div
          onClick={() => !uploadingThumb && thumbInputRef.current?.click()}
          className="relative cursor-pointer group"
        >
          {thumbPreview || course.thumbnailUrl ? (
            <img
              src={thumbPreview ?? course.thumbnailUrl!}
              alt="thumbnail"
              className="w-full aspect-video object-cover"
            />
          ) : (
            <div className="w-full aspect-video bg-gradient-to-br from-purple-600/10 to-cyan-500/10 flex flex-col items-center justify-center gap-2 text-gray-600">
              <span className="text-4xl">🖼️</span>
              <span className="text-sm">Зураг оруулахын тулд дарна уу</span>
            </div>
          )}
          {uploadingThumb && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white/20 border-t-purple-500 rounded-full animate-spin" />
            </div>
          )}
          {!uploadingThumb && (thumbPreview || course.thumbnailUrl) && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center">
              <span className="text-slate-900 dark:text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition">Зураг солих</span>
            </div>
          )}
        </div>
      </div>

      {/* Course info */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-2xl p-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div><p className="text-slate-400 dark:text-gray-500 mb-1">Үнэ</p><p className="text-slate-900 dark:text-white font-semibold">₮{course.price.toLocaleString()}</p></div>
        <div><p className="text-slate-400 dark:text-gray-500 mb-1">Ангилал</p><p className="text-slate-900 dark:text-white font-semibold">{course.category}</p></div>
        <div><p className="text-slate-400 dark:text-gray-500 mb-1">Түвшин</p><p className="text-slate-900 dark:text-white font-semibold">{course.level}</p></div>
        <div>
          <p className="text-slate-400 dark:text-gray-500 mb-1">Төлөв</p>
          <p className={`font-semibold ${course.isPublished ? 'text-green-400' : 'text-amber-400'}`}>
            {course.isPublished ? '● Нийтлэгдсэн' : '● Нуугдсан'}
          </p>
        </div>
      </div>

      {/* Sections & Lessons */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-syne text-lg font-bold text-slate-900 dark:text-white">Бүлэг ба хичээлүүд</h2>
          <span className="text-xs text-slate-400 dark:text-gray-500">{course.sections.flatMap((s) => s.lessons).length} хичээл</span>
        </div>

        <div className="space-y-4">
          {course.sections.map((section) => (
            <div key={section.id} className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden">
              {/* Section header */}
              <div className="flex items-center justify-between px-5 py-3 bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
                <p className="font-semibold text-slate-900 dark:text-white">{section.title}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setAddingLessonTo(section.id); setNewLesson({ title: '', titleMn: '', videoKey: '', isFree: false }) }}
                    className="text-xs px-3 py-1 bg-purple-600/30 text-purple-300 rounded-lg hover:bg-purple-600/50 transition"
                  >
                    + Хичээл нэмэх
                  </button>
                  <button onClick={() => deleteSection(section.id)} className="text-xs text-red-400 hover:text-red-300 px-2">✕</button>
                </div>
              </div>

              {/* Lessons */}
              <div className="divide-y divide-white/5">
                {section.lessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-slate-400 dark:text-gray-500 text-xs w-5 shrink-0">{lesson.order}.</span>
                      <div className="min-w-0">
                        <p className="text-sm text-slate-900 dark:text-white truncate">{lesson.titleMn || lesson.title}</p>
                        {lesson.videoKey
                          ? <p className="text-xs text-green-500/70">☁ {lesson.videoKey.split('/').pop()}</p>
                          : <p className="text-xs text-gray-600">Видео байхгүй</p>
                        }
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      {lesson.isFree && <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full">Үнэгүй</span>}
                      <button
                        onClick={() => setEditingLesson({ ...lesson, sectionId: section.id })}
                        className="text-xs px-3 py-1 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-300 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5"
                      >
                        Засах
                      </button>
                      <button onClick={() => deleteLesson(lesson.id)} className="text-xs text-red-400 hover:text-red-300">✕</button>
                    </div>
                  </div>
                ))}
                {section.lessons.length === 0 && (
                  <div className="px-5 py-4 text-sm text-gray-600">Хичээл байхгүй байна</div>
                )}
              </div>

              {/* Add lesson form */}
              {addingLessonTo === section.id && (
                <div className="px-5 py-4 bg-purple-600/10 border-t border-purple-500/20 space-y-3">
                  <p className="text-xs font-semibold text-purple-300">Шинэ хичээл нэмэх</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-500 dark:text-gray-400 mb-1 block">Гарчиг (MN) *</label>
                      <input
                        value={newLesson.titleMn}
                        onChange={(e) => setNewLesson((p) => ({ ...p, titleMn: e.target.value }))}
                        placeholder="1-р хичээл: Танилцуулга"
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-gray-600 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 dark:text-gray-400 mb-1 block">Гарчиг (EN) *</label>
                      <input
                        value={newLesson.title}
                        onChange={(e) => setNewLesson((p) => ({ ...p, title: e.target.value }))}
                        placeholder="Lesson 1: Introduction"
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-gray-600 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 dark:text-gray-400 mb-1 block">Бичлэг сонгох</label>
                    <VideoKeyInput value={newLesson.videoKey} onChange={(v) => setNewLesson((p) => ({ ...p, videoKey: v }))} />
                  </div>
                  <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-gray-300 cursor-pointer">
                    <input type="checkbox" checked={newLesson.isFree} onChange={(e) => setNewLesson((p) => ({ ...p, isFree: e.target.checked }))} className="w-4 h-4 rounded" />
                    Үнэгүй хичээл (preview)
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={addLesson}
                      disabled={!newLesson.title.trim()}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-lg text-sm font-medium disabled:opacity-40"
                    >
                      Нэмэх
                    </button>
                    <button onClick={() => setAddingLessonTo(null)} className="px-4 py-2 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-gray-400 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-white/5">
                      Болих
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add section */}
        <div className="mt-4 flex gap-2">
          <input
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addSection()}
            placeholder="Шинэ бүлгийн нэр (жш: Бүлэг 1: Танилцуулга)"
            className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 text-sm"
          />
          <button
            onClick={addSection}
            disabled={addingSection || !newSectionTitle.trim()}
            className="px-5 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl text-sm font-semibold disabled:opacity-40"
          >
            {addingSection ? '...' : '+ Бүлэг'}
          </button>
        </div>
      </div>

      {/* Edit lesson modal */}
      {editingLesson && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-syne font-bold text-slate-900 dark:text-white text-lg">Хичээл засах</h3>
            <div>
              <label className="text-xs text-slate-500 dark:text-gray-400 mb-1 block">Гарчиг (Монгол)</label>
              <input
                value={editingLesson.titleMn ?? ''}
                onChange={(e) => setEditingLesson((l) => l ? { ...l, titleMn: e.target.value } : l)}
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 dark:text-gray-400 mb-1 block">Гарчиг (Англи)</label>
              <input
                value={editingLesson.title}
                onChange={(e) => setEditingLesson((l) => l ? { ...l, title: e.target.value } : l)}
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 dark:text-gray-400 mb-1 block">Бичлэг сонгох</label>
              <VideoKeyInput
                value={editingLesson.videoKey ?? ''}
                onChange={(v) => setEditingLesson((l) => l ? { ...l, videoKey: v } : l)}
              />
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-gray-300 cursor-pointer">
                <input type="checkbox" checked={editingLesson.isFree}
                  onChange={(e) => setEditingLesson((l) => l ? { ...l, isFree: e.target.checked } : l)} />
                Үнэгүй
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-gray-300 cursor-pointer">
                <input type="checkbox" checked={editingLesson.isPublished}
                  onChange={(e) => setEditingLesson((l) => l ? { ...l, isPublished: e.target.checked } : l)} />
                Нийтлэгдсэн
              </label>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={saveLesson} className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl font-semibold text-sm">
                Хадгалах
              </button>
              <button onClick={() => setEditingLesson(null)} className="flex-1 py-3 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-gray-400 rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-white/5">
                Болих
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
