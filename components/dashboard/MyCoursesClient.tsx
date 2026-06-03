'use client'
import { useState } from 'react'
import Link from 'next/link'
import { QPAYModal } from '@/components/payment/QPAYModal'
import { useRouter } from 'next/navigation'

interface Lesson {
  id: string
  title: string
  titleMn: string | null
  duration: number
  order: number
  isFree: boolean
}

interface Section {
  id: string
  title: string
  order: number
  lessons: Lesson[]
}

interface Course {
  id: string
  slug: string
  title: string
  titleMn: string
  thumbnailUrl: string | null
  price: number
  totalLessons: number
  sections: Section[]
}

interface ActiveCourse {
  course: Course
  enrolledAt: Date
}

interface InactiveCourse {
  course: Course
}

interface Props {
  active: ActiveCourse[]
  inactive: InactiveCourse[]
}

function fmt(sec: number) {
  if (!sec) return ''
  return `${Math.floor(sec / 60)}м`
}

function ActiveCard({ course, enrolledAt }: ActiveCourse) {
  const firstLesson = course.sections[0]?.lessons[0]
  return (
    <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/30 transition">
      {course.thumbnailUrl ? (
        <img src={course.thumbnailUrl} alt={course.titleMn} className="w-full aspect-video object-cover" />
      ) : (
        <div className="w-full aspect-video bg-gradient-to-br from-purple-600/20 to-cyan-500/20 flex items-center justify-center text-4xl">🎓</div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-1 line-clamp-2">{course.titleMn || course.title}</h3>
        <p className="text-xs text-slate-400 dark:text-gray-500 mb-3">Бүртгүүлсэн: {new Date(enrolledAt).toLocaleDateString('mn-MN')}</p>

        <div className="space-y-3 mb-4">
          {course.sections.map((s) => (
            <div key={s.id}>
              <p className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">{s.title}</p>
              <div className="space-y-1">
                {s.lessons.map((l) => (
                  <Link
                    key={l.id}
                    href={`/learn/${course.id}/${l.id}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/3 hover:bg-purple-500/10 transition group"
                  >
                    <span className="text-green-400 text-xs shrink-0">▶</span>
                    <span className="text-sm text-slate-700 dark:text-gray-300 group-hover:text-purple-300 flex-1 line-clamp-1">{l.titleMn || l.title}</span>
                    {l.duration > 0 && <span className="text-xs text-gray-600 shrink-0">{fmt(l.duration)}</span>}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {firstLesson ? (
          <Link
            href={`/learn/${course.id}/${firstLesson.id}`}
            className="block text-center py-2 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl text-sm font-medium hover:opacity-90 transition"
          >
            Үргэлжлүүлэх →
          </Link>
        ) : (
          <span className="block text-center py-2 bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-gray-400 rounded-xl text-sm">Хичээл байхгүй</span>
        )}
      </div>
    </div>
  )
}

function InactiveCard({ course }: InactiveCourse) {
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  return (
    <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden">
      {course.thumbnailUrl ? (
        <img src={course.thumbnailUrl} alt={course.titleMn} className="w-full aspect-video object-cover grayscale-[50%] opacity-70" />
      ) : (
        <div className="w-full aspect-video bg-gradient-to-br from-gray-700/30 to-gray-600/20 flex items-center justify-center text-4xl opacity-40">🎓</div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-1 line-clamp-2">{course.titleMn || course.title}</h3>
        <p className="text-xs text-slate-400 dark:text-gray-500 mb-3 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-500 inline-block" />
          Идэвхжүүлэгдээгүй
        </p>

        <div className="space-y-3 mb-4">
          {course.sections.map((s) => (
            <div key={s.id}>
              <p className="text-xs font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-wide mb-1.5">{s.title}</p>
              <div className="space-y-1">
                {s.lessons.map((l) => (
                  <div key={l.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/3 cursor-not-allowed">
                    <span className="text-gray-600 text-xs shrink-0">🔒</span>
                    <span className="text-sm text-slate-400 dark:text-gray-500 flex-1 line-clamp-1">{l.titleMn || l.title}</span>
                    {l.duration > 0 && <span className="text-xs text-gray-700 shrink-0">{fmt(l.duration)}</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {course.price === 0 ? (
          <Link
            href={`/courses/${course.slug}`}
            className="block text-center py-2.5 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition"
          >
            Үнэгүй бүртгүүлэх
          </Link>
        ) : (
          <button
            onClick={() => setShowModal(true)}
            className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition"
          >
            Төлбөр төлөх — ₮{course.price.toLocaleString()}
          </button>
        )}
      </div>

      {showModal && (
        <QPAYModal
          courseId={course.id}
          courseTitle={course.titleMn || course.title}
          amount={course.price}
          onSuccess={() => { setShowModal(false); router.refresh() }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

export function MyCoursesClient({ active, inactive }: Props) {
  const hasAny = active.length > 0 || inactive.length > 0

  if (!hasAny) {
    return (
      <div className="max-w-5xl mx-auto">
        <h1 className="font-syne text-2xl font-bold text-slate-900 dark:text-white mb-8">Миний курсууд</h1>
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📚</div>
          <p className="text-slate-500 dark:text-gray-400 mb-6">Та одоогоор ямар нэг курст бүртгэгдээгүй байна</p>
          <Link href="/courses"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl font-semibold text-sm inline-block">
            Курсийн каталог
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <h1 className="font-syne text-2xl font-bold text-slate-900 dark:text-white">Миний курсууд</h1>

      {/* Идэвхитэй */}
      {active.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-5">
            <h2 className="font-syne text-lg font-semibold text-slate-900 dark:text-white">Идэвхитэй</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/20">
              {active.length} курс
            </span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {active.map((item) => (
              <ActiveCard key={item.course.id} {...item} />
            ))}
          </div>
        </section>
      )}

      {/* Идэвхгүй */}
      {inactive.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-5">
            <h2 className="font-syne text-lg font-semibold text-slate-900 dark:text-white">Идэвхгүй</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-slate-500 dark:text-gray-400 border border-slate-200 dark:border-white/10">
              {inactive.length} курс
            </span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {inactive.map((item) => (
              <InactiveCard key={item.course.id} {...item} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
