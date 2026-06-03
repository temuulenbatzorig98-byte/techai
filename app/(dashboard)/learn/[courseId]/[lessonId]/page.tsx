export const dynamic = 'force-dynamic'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import { VideoLessonClient } from './VideoLessonClient'

interface Props {
  params: { courseId: string; lessonId: string }
}

export default async function LessonPage({ params }: Props) {
  const token = cookies().get('auth_token')?.value
  const session = token ? await verifyToken(token) : null
  if (!session) redirect('/login')

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session.userId, courseId: params.courseId } },
  })
  if (!enrollment) redirect(`/courses`)

  const [lesson, course] = await Promise.all([
    prisma.lesson.findUnique({
      where: { id: params.lessonId, section: { courseId: params.courseId } },
      include: { resources: true },
    }),
    prisma.course.findUnique({
      where: { id: params.courseId },
      include: {
        sections: {
          include: { lessons: { orderBy: { order: 'asc' }, select: { id: true, title: true, titleMn: true, duration: true, isFree: true } } },
          orderBy: { order: 'asc' },
        },
      },
    }),
  ])

  if (!lesson || !course) notFound()

  const progress = await prisma.lessonProgress.findUnique({
    where: { userId_lessonId: { userId: session.userId, lessonId: params.lessonId } },
  })

  const completedLessonIds = await prisma.lessonProgress.findMany({
    where: { userId: session.userId, lesson: { section: { courseId: params.courseId } }, completed: true },
    select: { lessonId: true },
  }).then((rows) => rows.map((r) => r.lessonId))

  return (
    <VideoLessonClient
      lesson={lesson}
      course={course}
      startAt={progress?.watchedTime || 0}
      isCompleted={progress?.completed ?? false}
      completedLessonIds={completedLessonIds}
    />
  )
}
