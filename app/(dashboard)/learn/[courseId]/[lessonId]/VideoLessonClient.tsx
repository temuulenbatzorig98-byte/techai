'use client'
import { useState, useEffect, useCallback } from 'react'
import { CoursePlayer } from '@/components/course/CoursePlayer'
import Link from 'next/link'

interface Resource {
  id: string
  name: string
  fileKey: string
  fileType: string
}

interface Lesson {
  id: string
  title: string
  titleMn?: string | null
  videoKey?: string | null
  duration: number
  resources: Resource[]
}

interface Props {
  lesson: Lesson
  course: { id: string; titleMn: string; sections: any[] }
  startAt: number
  isCompleted: boolean
  completedLessonIds: string[]
}

const FILE_ICONS: Record<string, string> = {
  PDF: '📄',
  ZIP: '🗜️',
  IMAGE: '🖼️',
  OTHER: '📎',
}

export function VideoLessonClient({ lesson, course, startAt, isCompleted, completedLessonIds }: Props) {
  const [videoUrl, setVideoUrl] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [completed, setCompleted] = useState(isCompleted)
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set(completedLessonIds))
  const [marking, setMarking] = useState(false)
  const [tab, setTab] = useState<'lesson' | 'materials'>('lesson')

  useEffect(() => {
    if (lesson.videoKey) {
      fetch(`/api/lessons/${lesson.id}/video-url`)
        .then((r) => r.json())
        .then((d) => setVideoUrl(d.url))
    }
  }, [lesson.id, lesson.videoKey])

  const markComplete = useCallback(async () => {
    if (completed || marking) return
    setMarking(true)
    try {
      await fetch(`/api/lessons/${lesson.id}/progress`, {
        method: 'POST',
        body: JSON.stringify({ watchedTime: lesson.duration || 1, completed: true }),
        headers: { 'Content-Type': 'application/json' },
      })
      setCompleted(true)
      setCompletedIds((prev) => { const next = new Set(prev); next.add(lesson.id); return next })
    } finally {
      setMarking(false)
    }
  }, [completed, marking, lesson.id, lesson.duration])

  return (
    <div className="flex h-screen bg-white dark:bg-[#0d1220] overflow-hidden -m-6 lg:-m-8">
      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <div className="flex items-center gap-4 px-4 py-3 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#111827] shrink-0">
          <Link href="/my-courses" className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white text-sm shrink-0">
            ← Буцах
          </Link>
          <span className="text-slate-900 dark:text-white font-medium truncate flex-1 text-sm">
            {lesson.titleMn || lesson.title}
          </span>
          {completed ? (
            <span className="text-xs text-green-500 font-medium flex items-center gap-1 shrink-0">✅ Дууссан</span>
          ) : (
            <button
              onClick={markComplete}
              disabled={marking}
              className="text-xs text-purple-400 border border-purple-500/30 px-3 py-1.5 rounded-lg hover:bg-purple-500/10 transition disabled:opacity-50 shrink-0"
            >
              {marking ? '...' : '✓ Дуусгав'}
            </button>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-xs text-slate-500 dark:text-gray-400 border border-slate-200 dark:border-white/10 px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 shrink-0"
          >
            {sidebarOpen ? 'Хаах' : 'Жагсаалт'}
          </button>
        </div>

        {/* Video — always visible */}
        <div className="shrink-0 bg-black">
          {videoUrl ? (
            <CoursePlayer
              lessonId={lesson.id}
              videoUrl={videoUrl}
              startAt={startAt}
              onComplete={markComplete}
            />
          ) : (
            <div className="w-full aspect-video flex items-center justify-center text-slate-400 dark:text-gray-500 text-sm">
              {lesson.videoKey ? 'Видео ачаалж байна...' : 'Энэ хичээлд видео байхгүй'}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#111827] shrink-0">
          <button
            onClick={() => setTab('lesson')}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition ${
              tab === 'lesson'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Хичээл
          </button>
          <button
            onClick={() => setTab('materials')}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition flex items-center gap-2 ${
              tab === 'materials'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Татах материалууд
            {lesson.resources.length > 0 && (
              <span className="text-xs bg-purple-600/20 text-purple-500 dark:text-purple-400 px-1.5 py-0.5 rounded-full">
                {lesson.resources.length}
              </span>
            )}
          </button>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto">
          {tab === 'lesson' && (
            <div className="p-4 lg:p-6">
              {lesson.resources.length > 0 && (
                <div className="bg-purple-600/10 border border-purple-500/20 rounded-xl px-4 py-3 flex items-center gap-3">
                  <span className="text-purple-400 text-lg">📦</span>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {lesson.resources.length} татах материал байна
                    </p>
                    <button
                      onClick={() => setTab('materials')}
                      className="text-xs text-purple-400 hover:text-purple-300 underline underline-offset-2"
                    >
                      Материалуудыг харах →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'materials' && (
            <div className="p-4 lg:p-6">
              <h2 className="font-syne font-bold text-slate-900 dark:text-white mb-1">Татах материалууд</h2>
              <p className="text-xs text-slate-500 dark:text-gray-400 mb-5">
                Доорх файлуудыг татаж авна уу
              </p>

              {lesson.resources.length === 0 ? (
                <div className="text-center py-12 text-slate-400 dark:text-gray-500">
                  <div className="text-4xl mb-3">📭</div>
                  <p className="text-sm">Энэ хичээлд материал байхгүй байна</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {lesson.resources.map((r) => (
                    <a
                      key={r.id}
                      href={`/api/lessons/${lesson.id}/resource/${r.id}`}
                      className="flex items-center gap-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 hover:border-purple-500/40 hover:bg-purple-600/5 transition group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-purple-600/20 flex items-center justify-center text-2xl shrink-0 group-hover:bg-purple-600/30 transition">
                        {FILE_ICONS[r.fileType] ?? '📎'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{r.name}</p>
                        <p className="text-xs text-slate-400 dark:text-gray-500 mt-0.5">{r.fileType}</p>
                      </div>
                      <span className="text-slate-400 dark:text-gray-500 group-hover:text-purple-400 transition shrink-0">↓</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar — lesson list */}
      {sidebarOpen && (
        <div className="w-72 border-l border-slate-200 dark:border-white/10 bg-white dark:bg-[#111827] overflow-y-auto hidden lg:block shrink-0">
          <div className="p-4 border-b border-slate-200 dark:border-white/10">
            <p className="text-xs font-semibold text-slate-500 dark:text-gray-400 truncate">{course.titleMn}</p>
          </div>
          {course.sections.map((section: any) => (
            <div key={section.id}>
              <div className="px-4 py-2 text-xs font-semibold text-slate-500 dark:text-gray-400 bg-slate-50 dark:bg-white/5 sticky top-0">
                {section.title}
              </div>
              {section.lessons.map((l: any) => {
                const isDone = completedIds.has(l.id)
                const isCurrent = l.id === lesson.id
                return (
                  <Link
                    key={l.id}
                    href={`/learn/${course.id}/${l.id}`}
                    className={`flex items-center gap-3 px-4 py-3 text-sm border-b border-slate-100 dark:border-white/5 transition ${
                      isCurrent
                        ? 'bg-purple-600/20 text-purple-600 dark:text-purple-300'
                        : 'text-slate-500 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-white/5'
                    }`}
                  >
                    <span className="text-base shrink-0">
                      {isDone ? '✅' : isCurrent ? '▶' : '○'}
                    </span>
                    <span className="truncate">{l.titleMn || l.title}</span>
                  </Link>
                )
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
