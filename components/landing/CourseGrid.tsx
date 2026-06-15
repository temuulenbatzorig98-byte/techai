'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const GRADIENTS = [
  'from-purple-600 to-blue-600',
  'from-cyan-600 to-teal-600',
  'from-pink-600 to-rose-600',
  'from-orange-500 to-amber-500',
  'from-green-600 to-emerald-500',
  'from-indigo-600 to-violet-600',
]

const ICONS = ['🤖', '⚡', '🚀', '🎯', '💡', '🔥']

const LEVEL_LABEL: Record<string, string> = {
  BEGINNER: 'Анхан шат',
  INTERMEDIATE: 'Дунд шат',
  ADVANCED: 'Ахисан шат',
}

const LEVEL_CLASS: Record<string, string> = {
  BEGINNER: 'badge-beginner',
  INTERMEDIATE: 'badge-intermediate',
  ADVANCED: 'badge-advanced',
}

interface Course {
  id: string
  slug: string
  title: string
  titleMn: string
  descriptionMn: string | null
  description: string | null
  thumbnailUrl: string | null
  price: number
  originalPrice: number | null
  level: string
  category: string
  totalStudents: number
  totalLessons: number
}

export function CourseGrid({ courses }: { courses: Course[] }) {
  const [pairIndex, setPairIndex] = useState(0)
  const [fading, setFading] = useState(false)

  const totalPairs = Math.ceil(courses.length / 2)

  useEffect(() => {
    if (courses.length <= 2) return
    const interval = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setPairIndex((i) => (i + 1) % totalPairs)
        setFading(false)
      }, 350)
    }, 3500)
    return () => clearInterval(interval)
  }, [courses.length, totalPairs])

  const pair = [courses[pairIndex * 2], courses[pairIndex * 2 + 1]].filter(Boolean)

  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-purple-500 dark:text-purple-400 mb-4">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-purple-400" />
            Платформ
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-purple-400" />
          </div>
          <h2 className="font-syne text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Онцлох <span className="gradient-text">Курсууд</span>
          </h2>
          <p className="text-slate-500 dark:text-gray-400 max-w-xl mx-auto text-base leading-relaxed">
            Монголын ажилчдад зориулсан практик AI мэдлэг
          </p>
        </div>

        {/* Course cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 max-w-3xl mx-auto transition-opacity duration-350"
          style={{ opacity: fading ? 0 : 1 }}
        >
          {pair.map((c, i) => {
            const absIndex = pairIndex * 2 + i
            const gradient = GRADIENTS[absIndex % GRADIENTS.length]
            const icon = ICONS[absIndex % ICONS.length]
            const desc = c.descriptionMn || c.description || ''

            return (
              <div
                key={c.id}
                className="group bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden hover:border-purple-400/50 dark:hover:border-purple-500/40 card-premium"
              >
                {/* Thumbnail */}
                <div className={`h-40 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden relative`}>
                  {c.thumbnailUrl ? (
                    <img
                      src={c.thumbnailUrl}
                      alt={c.titleMn}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                    />
                  ) : (
                    <span className="text-5xl animate-float">{icon}</span>
                  )}
                </div>

                {/* Body */}
                <div className="p-5">
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-white/10 font-medium">
                      {c.category}
                    </span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${LEVEL_CLASS[c.level] ?? 'badge-beginner'}`}>
                      {LEVEL_LABEL[c.level] ?? c.level}
                    </span>
                  </div>

                  <h3 className="font-syne font-bold text-slate-900 dark:text-white text-[15px] mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200 line-clamp-1">
                    {c.titleMn || c.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">{desc}</p>

                  <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-slate-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
                      </svg>
                      {c.totalStudents.toLocaleString()} оюутан
                    </span>
                    <span>·</span>
                    <span>{c.totalLessons} хичээл</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      {c.price === 0 ? (
                        <span className="text-xl font-bold text-emerald-500 dark:text-emerald-400">Үнэгүй</span>
                      ) : (
                        <>
                          <span className="text-xl font-bold text-slate-900 dark:text-white">₮{c.price.toLocaleString()}</span>
                          {c.originalPrice && (
                            <span className="text-sm text-slate-400 dark:text-gray-500 line-through">₮{c.originalPrice.toLocaleString()}</span>
                          )}
                        </>
                      )}
                    </div>
                    <Link
                      href={`/courses/${c.slug}`}
                      className="text-sm px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl font-medium hover:opacity-90 hover:-translate-y-px transition-all duration-200 hover:shadow-md hover:shadow-purple-500/20"
                    >
                      Үзэх
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Carousel indicators */}
        {totalPairs > 1 && (
          <div className="flex justify-center gap-2 mb-10">
            {Array.from({ length: totalPairs }).map((_, i) => (
              <button
                key={i}
                onClick={() => { setFading(true); setTimeout(() => { setPairIndex(i); setFading(false) }, 350) }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === pairIndex
                    ? 'bg-purple-500 w-6'
                    : 'bg-slate-300 dark:bg-white/20 hover:bg-slate-400 dark:hover:bg-white/40 w-2'
                }`}
              />
            ))}
          </div>
        )}

        {/* See all button */}
        <div className="text-center">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-7 py-3 border border-slate-200 dark:border-white/15 text-slate-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/5 hover:border-slate-300 dark:hover:border-white/25 hover:-translate-y-px transition-all duration-200"
          >
            Бүх курсийг үзэх
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
