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

const COURSE_INCLUDE = {
  sections: {
    orderBy: { order: 'asc' as const },
    include: {
      lessons: {
        orderBy: { order: 'asc' as const },
        select: LESSON_SELECT,
      },
    },
  },
} as const

export default async function MyCoursesPage() {
  const token = cookies().get('auth_token')?.value
  const session = token ? await verifyToken(token) : null
  if (!session) return null

  const [enrollments, pendingPayments] = await Promise.all([
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
    prisma.payment.findMany({
      where: {
        userId: session.userId,
        status: 'PENDING',
        course: {
          enrollments: { none: { userId: session.userId } },
        },
      },
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
      orderBy: { createdAt: 'desc' },
    }),
  ])

  const active = enrollments.map((e) => ({
    course: e.course,
    enrolledAt: e.enrolledAt,
  }))

  const enrolledCourseIds = new Set(enrollments.map((e) => e.courseId))
  const seen = new Set<string>()
  const inactive = pendingPayments
    .filter((p) => !enrolledCourseIds.has(p.courseId) && !seen.has(p.courseId) && seen.add(p.courseId))
    .map((p) => ({
      paymentId: p.id,
      course: p.course,
      amount: p.amount,
    }))

  return <MyCoursesClient active={active} inactive={inactive} />
}
