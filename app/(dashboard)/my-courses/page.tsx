export const dynamic = 'force-dynamic'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { UnenrollButton } from '@/components/dashboard/UnenrollButton'

export default async function MyCoursesPage() {
  const token = cookies().get('auth_token')?.value
  const session = token ? await verifyToken(token) : null
  if (!session) return null

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.userId },
    include: {
      course: {
        include: {
          sections: { include: { lessons: { select: { id: true } } } },
        },
      },
    },
    orderBy: { enrolledAt: 'desc' },
  })

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="font-syne text-2xl font-bold text-white mb-8">Миний курсууд</h1>

      {enrollments.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📚</div>
          <p className="text-gray-400 mb-6">Та одоогоор ямар нэг курст бүртгэгдээгүй байна</p>
          <Link href="/courses"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl font-semibold text-sm">
            Курсийн каталог
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map(({ course, enrolledAt }) => {
            const firstLesson = course.sections[0]?.lessons[0]
            return (
              <div key={course.id} className="bg-[#111827] border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/30 transition">
                {course.thumbnailUrl && (
                  <img src={course.thumbnailUrl} alt={course.titleMn} className="w-full aspect-video object-cover" />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-white mb-1 line-clamp-2">{course.titleMn || course.title}</h3>
                  <p className="text-xs text-gray-400 mb-4">
                    Бүртгүүлсэн: {new Date(enrolledAt).toLocaleDateString('mn-MN')}
                  </p>
                  {firstLesson ? (
                    <Link href={`/learn/${course.id}/${firstLesson.id}`}
                      className="block text-center py-2 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl text-sm font-medium">
                      Үргэлжлүүлэх →
                    </Link>
                  ) : (
                    <span className="block text-center py-2 bg-white/5 text-gray-400 rounded-xl text-sm">
                      Хичээл байхгүй
                    </span>
                  )}
                  <UnenrollButton courseId={course.id} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
