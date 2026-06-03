'use client'
import { useState, useEffect, useCallback } from 'react'
import { CoursePlayer } from '@/components/course/CoursePlayer'
import Link from 'next/link'

interface Lesson {
  id: string
  title: string
  titleMn?: string | null
  videoKey?: string | null
  duration: number
  resources: { id: string; name: string; fileKey: string; fileType: string }[]
}

interface Props {
  lesson: Lesson
  course: { id: string; titleMn: string; sections: any[] }
  startAt: number
  isCompleted: boolean
  completedLessonIds: string[]
}

export function VideoLessonClient({ lesson, course, startAt, isCompleted, completedLessonIds }: Props) {
  const [videoUrl, setVideoUrl] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [completed, setCompleted] = useState(isCompleted)
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set(completedLessonIds))
  const [marking, setMarking] = useState(false)

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
      {/* Main video area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center gap-4 px-4 py-3 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#111827]">
          <Link href="/my-courses" className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white text-sm">
            ← Буцах
          </Link>
          <span className="text-slate-900 dark:text-white font-medium truncate flex-1">
            {lesson.titleMn || lesson.title}
          </span>
          {completed ? (
            <span className="text-xs text-green-500 font-medium flex items-center gap-1">✅ Дууссан</span>
          ) : (
            <button
              onClick={markComplete}
              disabled={marking}
              className="text-xs text-purple-400 border border-purple-500/30 px-3 py-1.5 rounded-lg hover:bg-purple-500/10 transition disabled:opacity-50"
            >
              {marking ? '...' : '✓ Дуусгав'}
            </button>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-xs text-slate-500 dark:text-gray-400 border border-slate-200 dark:border-white/10 px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5"
          >
            {sidebarOpen ? 'Хаах' : 'Жагсаалт'}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {videoUrl ? (
            <CoursePlayer
              lessonId={lesson.id}
              videoUrl={videoUrl}
              startAt={startAt}
              onComplete={markComplete}
            />
          ) : (
            <div className="w-full aspect-video bg-white dark:bg-[#111827] rounded-xl flex items-center justify-center text-slate-400 dark:text-gray-500">
              {lesson.videoKey ? 'Видео ачаалж байна...' : 'Энэ хичээлд видео байхгүй'}
            </div>
          )}

          {lesson.resources.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-gray-300 mb-3">Материалууд</h3>
              <div className="flex flex-wrap gap-2">
                {lesson.resources.map((r) => (
                  <a
                    key={r.id}
                    href={`/api/lessons/${lesson.id}/resource/${r.id}`}
                    className="flex items-center gap-2 text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-slate-700 dark:text-gray-300 hover:bg-white/10"
                  >
                    📎 {r.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="w-72 border-l border-slate-200 dark:border-white/10 bg-white dark:bg-[#111827] overflow-y-auto hidden lg:block">
          <div className="p-4 border-b border-slate-200 dark:border-white/10">
            <p className="text-xs text-slate-500 dark:text-gray-400 truncate">{course.titleMn}</p>
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
