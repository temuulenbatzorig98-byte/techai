import { prisma } from '@/lib/prisma'

export async function syncCourseStats(courseId: string) {
  const sections = await prisma.section.findMany({
    where: { courseId },
    include: { lessons: true },
  })
  const lessons = sections.flatMap((s) => s.lessons)
  await prisma.course.update({
    where: { id: courseId },
    data: {
      totalLessons: lessons.length,
      totalDuration: lessons.reduce((sum, l) => sum + l.duration, 0),
    },
  })
}

export function randomRating() {
  return Math.round((4.0 + Math.random()) * 10) / 10
}

export function randomStudents() {
  return Math.floor(500 + Math.random() * 501)
}
