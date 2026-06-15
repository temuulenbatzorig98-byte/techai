export const dynamic = 'force-dynamic'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { CourseProgress } from '@/components/course/CourseProgress'

const STAT_ICONS = [
  (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 3h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1z" />
      <path d="M7 7h6M7 10h6M7 13h4" />
    </svg>
  ),
  (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2l2.4 4.9L18 7.6l-4 3.9.9 5.5L10 14.3l-4.9 2.7.9-5.5-4-3.9 5.6-.7z" />
    </svg>
  ),
  (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="8" /><path d="M10 6v4l3 3" />
    </svg>
  ),
  (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 11l3-3 3 3M10 8v8" /><path d="M4 15c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    </svg>
  ),
]

const STAT_COLORS = [
  'bg-purple-50 dark:bg-purple-500/10 text-purple-500 dark:text-purple-400',
  'bg-amber-50 dark:bg-amber-500/10 text-amber-500 dark:text-amber-400',
  'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-500 dark:text-cyan-400',
  'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 dark:text-emerald-400',
]

export default async function DashboardPage() {
  const token = cookies().get('auth_token')?.value
  const session = token ? await verifyToken(token) : null
  if (!session) return null

  const [user, enrollments] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.userId },
      select: { name: true, email: true, avatarUrl: true },
    }),
    prisma.enrollment.findMany({
      where: { userId: session.userId },
      include: {
        course: {
          select: { id: true, titleMn: true, thumbnailUrl: true, totalLessons: true, slug: true },
        },
      },
      orderBy: { enrolledAt: 'desc' },
      take: 6,
    }),
  ])

  const stats = [
    { label: 'Миний курс', value: enrollments.length, iconIdx: 0 },
    { label: 'Дууссан хичээл', value: '—', iconIdx: 1 },
    { label: 'Нийт цаг', value: '—', iconIdx: 2 },
    { label: 'Гэрчилгээ', value: '0', iconIdx: 3 },
  ]

  return (
    <div className="max-w-5xl mx-auto">
      {/* Welcome header */}
      <div className="mb-10">
        <h1 className="font-syne text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
          Сайн байна уу, {user?.name}! 👋
        </h1>
        <p className="text-slate-500 dark:text-gray-400 mt-1.5">Өнөөдөр юу сурах вэ?</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-2xl p-5 hover:border-slate-300 dark:hover:border-white/20 transition-colors duration-200"
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${STAT_COLORS[s.iconIdx]}`}>
              {STAT_ICONS[s.iconIdx]}
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white font-syne">{s.value}</div>
            <div className="text-xs text-slate-500 dark:text-gray-400 mt-1 font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      {/* My courses section */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-syne text-lg font-bold text-slate-900 dark:text-white">Миний курсууд</h2>
        <Link
          href="/my-courses"
          className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors flex items-center gap-1"
        >
          Бүгдийг харах
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" />
          </svg>
        </Link>
      </div>

      {enrollments.length === 0 ? (
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-2xl p-14 text-center">
          <div className="w-16 h-16 bg-purple-50 dark:bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <p className="text-slate-700 dark:text-white font-semibold mb-1">Курс байхгүй байна</p>
          <p className="text-slate-500 dark:text-gray-400 text-sm mb-6">
            Та одоогоор ямар нэг курст бүртгэгдээгүй байна
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl font-semibold text-sm hover:opacity-90 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200"
          >
            Курс үзэх
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" />
            </svg>
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {enrollments.map(({ course }) => (
            <CourseProgress key={course.id} course={course} userId={session.userId} />
          ))}
        </div>
      )}
    </div>
  )
}
