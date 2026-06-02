'use client'
import { useState } from 'react'
import Link from 'next/link'
import { UnenrollButton } from './UnenrollButton'
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
  paymentId: string
  course: Course
  amount: number
}

interface Props {
  active: ActiveCourse[]
  inactive: InactiveCourse[]
}

function fmt(sec: number) {
  if (!sec) return ''
  const m = Math.floor(sec / 60)
  return `${m}м`
}

function ActiveCard({ course, enrolledAt }: ActiveCourse) {
  const firstLesson = course.sections[0]?.lessons[0]
  return (
    <div className="bg-[#111827] border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/30 transition">
      {course.thumbnailUrl ? (
        <img src={course.thumbnailUrl} alt={course.titleMn} className="w-full aspect-video object-cover" />
      ) : (
        <div className="w-full aspect-video bg-gradient-to-br from-purple-600/20 to-cyan-500/20 flex items-center justify-center text-4xl">🎓</div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-white mb-1 line-clamp-2">{course.titleMn || course.title}</h3>
        <p className="text-xs text-gray-500 mb-3">Бүртгүүлсэн: {new Date(enrolledAt).toLocaleDateString('mn-MN')}</p>

        <div className="space-y-3 mb-4">
          {course.sections.map((s) => (
            <div key={s.id}>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">{s.title}</p>
              <div className="space-y-1">
                {s.lessons.map((l) => (
                  <Link
                    key={l.id}
                    href={`/learn/${course.id}/${l.id}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/3 hover:bg-purple-500/10 hover:text-purple-300 transition group"
                  >
                    <span className="text-green-400 text-xs shrink-0">▶</span>
                    <span className="text-sm text-gray-300 group-hover:text-purple-300 flex-1 line-clamp-1">
                      {l.titleMn || l.title}
                    </span>
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
          <span className="block text-center py-2 bg-white/5 text-gray-400 rounded-xl text-sm">Хичээл байхгүй</span>
        )}
        <UnenrollButton courseId={course.id} />
      </div>
    </div>
  )
}

function InactiveCard({ paymentId, course, amount }: InactiveCourse) {
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  const handleSuccess = () => {
    setShowModal(false)
    router.refresh()
  }

  return (
    <div className="bg-[#111827] border border-white/10 rounded-2xl overflow-hidden opacity-80">
      {course.thumbnailUrl ? (
        <img src={course.thumbnailUrl} alt={course.titleMn} className="w-full aspect-video object-cover grayscale-[40%]" />
      ) : (
        <div className="w-full aspect-video bg-gradient-to-br from-gray-700/30 to-gray-600/20 flex items-center justify-center text-4xl opacity-50">🎓</div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-white mb-1 line-clamp-2">{course.titleMn || course.title}</h3>
        <p className="text-xs text-amber-400/80 mb-3">⚠ Төлбөр хүлээгдэж байна</p>

        <div className="space-y-3 mb-4">
          {course.sections.map((s) => (
            <div key={s.id}>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{s.title}</p>
              <div className="space-y-1">
                {s.lessons.map((l) => (
                  <div
                    key={l.id}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/3 cursor-not-allowed"
                  >
                    <span className="text-gray-600 text-xs shrink-0">🔒</span>
                    <span className="text-sm text-gray-500 flex-1 line-clamp-1">{l.titleMn || l.title}</span>
                    {l.duration > 0 && <span className="text-xs text-gray-700 shrink-0">{fmt(l.duration)}</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition"
        >
          Төлбөр төлөх — ₮{amount.toLocaleString()}
        </button>
      </div>

      {showModal && (
        <QPAYModal
          courseId={course.id}
          courseTitle={course.titleMn || course.title}
          amount={amount}
          onSuccess={handleSuccess}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

export function MyCoursesClient({ active, inactive }: Props) {
  const [tab, setTab] = useState<'active' | 'inactive'>('active')

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="font-syne text-2xl font-bold text-white mb-6">Миний курсууд</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1 w-fit mb-8">
        <button
          onClick={() => setTab('active')}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
            tab === 'active'
              ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Идэвхитэй
          {active.length > 0 && (
            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${tab === 'active' ? 'bg-white/20' : 'bg-white/10'}`}>
              {active.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab('inactive')}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
            tab === 'inactive'
              ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Идэвхгүй
          {inactive.length > 0 && (
            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${tab === 'inactive' ? 'bg-white/20' : 'bg-amber-500/30 text-amber-400'}`}>
              {inactive.length}
            </span>
          )}
        </button>
      </div>

      {/* Active tab */}
      {tab === 'active' && (
        active.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📚</div>
            <p className="text-gray-400 mb-6">Та одоогоор ямар нэг курст бүртгэгдээгүй байна</p>
            <Link href="/courses"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl font-semibold text-sm inline-block">
              Курсийн каталог
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {active.map((item) => (
              <ActiveCard key={item.course.id} {...item} />
            ))}
          </div>
        )
      )}

      {/* Inactive tab */}
      {tab === 'inactive' && (
        inactive.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">✅</div>
            <p className="text-gray-400">Хүлээгдэж буй төлбөр байхгүй байна</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {inactive.map((item) => (
              <InactiveCard key={item.paymentId} {...item} />
            ))}
          </div>
        )
      )}
    </div>
  )
}
