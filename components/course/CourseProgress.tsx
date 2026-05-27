import Link from 'next/link'
import { prisma } from '@/lib/prisma'

interface Course {
  id: string
  titleMn: string
  thumbnailUrl?: string | null
  totalLessons: number
  slug: string
}

interface Props {
  course: Course
  userId: string
}

export async function CourseProgress({ course, userId }: Props) {
  const completed = await prisma.lessonProgress.count({
    where: { userId, lesson: { section: { courseId: course.id } }, completed: true },
  })

  const pct = course.totalLessons > 0 ? Math.round((completed / course.totalLessons) * 100) : 0

  return (
    <Link href={`/my-courses`} className="group bg-[#111827] border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/30 transition block">
      {course.thumbnailUrl ? (
        <img src={course.thumbnailUrl} alt={course.titleMn} className="w-full aspect-video object-cover" />
      ) : (
        <div className="w-full aspect-video bg-gradient-to-br from-purple-600/20 to-cyan-500/20 flex items-center justify-center text-3xl">🎓</div>
      )}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-white mb-3 line-clamp-2">{course.titleMn}</h3>
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span>{completed} / {course.totalLessons} хичээл</span>
          <span className="text-cyan-400 font-medium">{pct}%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-1.5">
          <div
            className="bg-gradient-to-r from-purple-500 to-cyan-500 h-1.5 rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </Link>
  )
}
