export const dynamic = 'force-dynamic'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { MyCoursesClient } from '@/components/dashboard/MyCoursesClient'

const LESSON_SELECT = {
  id: true,
  title: true,
  titleMn: true,
  duration: true,
  order: true,
  isFree: true,
} as const

export default async function MyCoursesPage() {
  const token = cookies().get('auth_token')?.value
  const session = token ? await verifyToken(token) : null
  if (!session) return null

  const [enrollments, allCourses] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId: session.userId },
      include: {
        course: {
          select: {
            id: true, slug: true, title: true, titleMn: true,
            thumbnailUrl: true, price: true, totalLessons: true,
            sections: {
              orderBy: { order: 'asc' },
              include: { lessons: { orderBy: { order: 'asc' }, select: LESSON_SELECT } },
            },
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    }),
    prisma.course.findMany({
      where: { isPublished: true },
      select: {
        id: true, slug: true, title: true, titleMn: true,
        thumbnailUrl: true, price: true, totalLessons: true,
        sections: {
          orderBy: { order: 'asc' },
          include: { lessons: { orderBy: { order: 'asc' }, select: LESSON_SELECT } },
        },
      },
      orderBy: { totalStudents: 'desc' },
    }),
  ])

  const enrolledCourseIds = new Set(enrollments.map((e) => e.courseId))

  const active = enrollments.map((e) => ({
    course: e.course,
    enrolledAt: e.enrolledAt,
  }))

  const inactive = allCourses
    .filter((c) => !enrolledCourseIds.has(c.id))
    .map((c) => ({ course: c }))

  return <MyCoursesClient active={active} inactive={inactive} />
}
