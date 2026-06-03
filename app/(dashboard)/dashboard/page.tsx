export const dynamic = 'force-dynamic'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { CourseProgress } from '@/components/course/CourseProgress'

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

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-syne text-2xl font-bold text-slate-900 dark:text-white">
          Сайн байна уу, {user?.name}! 👋
        </h1>
        <p className="text-slate-500 dark:text-gray-400 mt-1">Өнөөдөр юу сурах вэ?</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Миний курс', value: enrollments.length, icon: '📚' },
          { label: 'Дууссан хичээл', value: '—', icon: '✅' },
          { label: 'Нийт цаг', value: '—', icon: '⏱' },
          { label: 'Гэрчилгээ', value: '0', icon: '🏆' },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-xl p-4">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">{s.value}</div>
            <div className="text-xs text-slate-500 dark:text-gray-400">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-syne text-lg font-bold text-slate-900 dark:text-white">Миний курсууд</h2>
        <Link href="/my-courses" className="text-sm text-purple-400 hover:text-purple-300">
          Бүгдийг харах →
        </Link>
      </div>

      {enrollments.length === 0 ? (
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-2xl p-12 text-center">
          <div className="text-4xl mb-4">🎓</div>
          <p className="text-slate-500 dark:text-gray-400 mb-4">Та одоогоор ямар нэг курст бүртгэгдээгүй байна</p>
          <Link
            href="/courses"
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl font-semibold text-sm"
          >
            Курс үзэх
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
