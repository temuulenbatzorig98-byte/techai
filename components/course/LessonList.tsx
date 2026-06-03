'use client'
import { useState } from 'react'

interface Lesson {
  id: string
  title: string
  titleMn?: string | null
  duration: number
  isFree: boolean
}

interface Section {
  id: string
  title: string
  order: number
  lessons: Lesson[]
}

function formatDuration(s: number) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${String(sec).padStart(2, '0')}`
}

export function LessonList({ sections }: { sections: Section[] }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set([sections[0]?.id]))

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-3">
      {sections.map((section) => (
        <div key={section.id} className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden">
          <button
            onClick={() => toggle(section.id)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/3 transition"
          >
            <span className="font-medium text-slate-900 dark:text-white">{section.title}</span>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 dark:text-gray-400">{section.lessons.length} хичээл</span>
              <span className="text-slate-500 dark:text-gray-400">{expanded.has(section.id) ? '▲' : '▼'}</span>
            </div>
          </button>

          {expanded.has(section.id) && (
            <div className="border-t border-slate-200 dark:border-white/10">
              {section.lessons.map((lesson) => (
                <div key={lesson.id} className="flex items-center justify-between px-5 py-3 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-sm">{lesson.isFree ? '▶' : '🔒'}</span>
                    <span className="text-sm text-slate-700 dark:text-gray-300">{lesson.titleMn || lesson.title}</span>
                    {lesson.isFree && (
                      <span className="text-xs bg-green-600/20 text-green-400 px-2 py-0.5 rounded-full">Үнэгүй</span>
                    )}
                  </div>
                  {lesson.duration > 0 && (
                    <span className="text-xs text-slate-400 dark:text-gray-500">{formatDuration(lesson.duration)}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
