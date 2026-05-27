'use client'
import { useState, useEffect } from 'react'
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
}

export function VideoLessonClient({ lesson, course, startAt }: Props) {
  const [videoUrl, setVideoUrl] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    if (lesson.videoKey) {
      fetch(`/api/lessons/${lesson.id}/video-url`)
        .then((r) => r.json())
        .then((d) => setVideoUrl(d.url))
    }
  }, [lesson.id, lesson.videoKey])

  return (
    <div className="flex h-screen bg-[#0d1220] overflow-hidden -m-6 lg:-m-8">
      {/* Main video area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center gap-4 px-4 py-3 border-b border-white/10 bg-[#111827]">
          <Link href="/my-courses" className="text-gray-400 hover:text-white text-sm">
            ← Буцах
          </Link>
          <span className="text-white font-medium truncate">
            {lesson.titleMn || lesson.title}
          </span>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto text-xs text-gray-400 border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/5"
          >
            {sidebarOpen ? 'Хаах' : 'Хичээлийн жагсаалт'}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {videoUrl ? (
            <CoursePlayer
              lessonId={lesson.id}
              videoUrl={videoUrl}
              startAt={startAt}
            />
          ) : (
            <div className="w-full aspect-video bg-[#111827] rounded-xl flex items-center justify-center text-gray-500">
              {lesson.videoKey ? 'Видео ачаалж байна...' : 'Энэ хичээлд видео байхгүй'}
            </div>
          )}

          {lesson.resources.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Материалууд</h3>
              <div className="flex flex-wrap gap-2">
                {lesson.resources.map((r) => (
                  <a
                    key={r.id}
                    href={`/api/lessons/${lesson.id}/resource/${r.id}`}
                    className="flex items-center gap-2 text-xs bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-gray-300 hover:bg-white/10"
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
        <div className="w-72 border-l border-white/10 bg-[#111827] overflow-y-auto hidden lg:block">
          <div className="p-4 border-b border-white/10">
            <p className="text-xs text-gray-400 truncate">{course.titleMn}</p>
          </div>
          {course.sections.map((section: any) => (
            <div key={section.id}>
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 bg-white/5 sticky top-0">
                {section.title}
              </div>
              {section.lessons.map((l: any) => (
                <Link
                  key={l.id}
                  href={`/learn/${course.id}/${l.id}`}
                  className={`flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5 border-b border-white/5 transition ${
                    l.id === lesson.id ? 'bg-purple-600/20 text-purple-300' : 'text-gray-400'
                  }`}
                >
                  <span className="text-base">{l.id === lesson.id ? '▶' : '○'}</span>
                  <span className="truncate">{l.titleMn || l.title}</span>
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
