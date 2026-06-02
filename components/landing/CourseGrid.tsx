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
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-syne text-3xl lg:text-4xl font-bold text-white mb-4">
            Онцлох <span className="gradient-text">Курсууд</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Монголын ажилчдад зориулсан практик AI мэдлэг
          </p>
        </div>

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
              <div key={c.id} className="group bg-[#111827] border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/40 transition card-glow">
                <div className={`h-36 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
                  {c.thumbnailUrl ? (
                    <img src={c.thumbnailUrl} alt={c.titleMn} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  ) : (
                    <span className="text-5xl animate-float">{icon}</span>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex gap-2 mb-3">
                    <span className="text-xs bg-white/5 text-gray-400 border border-white/10 px-2 py-0.5 rounded-full">{c.category}</span>
                    <span className="text-xs bg-white/5 text-gray-400 border border-white/10 px-2 py-0.5 rounded-full">{LEVEL_LABEL[c.level] ?? c.level}</span>
                  </div>
                  <h3 className="font-syne font-bold text-white text-lg mb-2">{c.titleMn || c.title}</h3>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">{desc}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <span>👥 {c.totalStudents.toLocaleString()}</span>
                    <span>📚 {c.totalLessons} хичээл</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      {c.price === 0 ? (
                        <span className="text-xl font-bold text-green-400">Үнэгүй</span>
                      ) : (
                        <>
                          <span className="text-xl font-bold text-cyan-400">₮{c.price.toLocaleString()}</span>
                          {c.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">₮{c.originalPrice.toLocaleString()}</span>
                          )}
                        </>
                      )}
                    </div>
                    <Link
                      href={`/courses/${c.slug}`}
                      className="text-sm px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl font-medium hover:opacity-90 transition"
                    >
                      Үзэх
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {totalPairs > 1 && (
          <div className="flex justify-center gap-2 mb-8">
            {Array.from({ length: totalPairs }).map((_, i) => (
              <button
                key={i}
                onClick={() => { setFading(true); setTimeout(() => { setPairIndex(i); setFading(false) }, 350) }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === pairIndex ? 'bg-purple-500 w-6' : 'bg-white/20 hover:bg-white/40'}`}
              />
            ))}
          </div>
        )}

        <div className="text-center">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 border border-white/10 text-gray-300 rounded-xl hover:bg-white/5 transition"
          >
            Бүх курсийг үзэх →
          </Link>
        </div>
      </div>
    </section>
  )
}
