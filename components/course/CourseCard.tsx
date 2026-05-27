import Link from 'next/link'

interface Course {
  id: string
  slug: string
  titleMn: string
  title: string
  thumbnailUrl?: string | null
  price: number
  originalPrice?: number | null
  level: string
  category: string
  rating: number
  totalStudents: number
  totalLessons: number
  totalDuration: number
}

const LEVEL_LABEL: Record<string, string> = {
  BEGINNER: 'Анхан шат',
  INTERMEDIATE: 'Дунд шат',
  ADVANCED: 'Ахисан шат',
}

export function CourseCard({ course }: { course: Course }) {
  const hours = Math.floor(course.totalDuration / 3600)
  const mins = Math.floor((course.totalDuration % 3600) / 60)
  const duration = hours > 0 ? `${hours}ц ${mins}м` : `${mins}м`

  return (
    <Link href={`/courses/${course.slug}`} className="group block bg-[#111827] border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/40 transition">
      <div className="aspect-video bg-gradient-to-br from-purple-600/20 to-cyan-500/20 overflow-hidden">
        {course.thumbnailUrl ? (
          <img src={course.thumbnailUrl} alt={course.titleMn} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">🎓</div>
        )}
      </div>
      <div className="p-5">
        <div className="flex gap-2 mb-3">
          <span className="text-xs bg-white/5 text-gray-400 border border-white/10 px-2 py-0.5 rounded-full">{course.category}</span>
          <span className="text-xs bg-white/5 text-gray-400 border border-white/10 px-2 py-0.5 rounded-full">{LEVEL_LABEL[course.level]}</span>
        </div>
        <h3 className="font-semibold text-white mb-3 line-clamp-2 group-hover:text-purple-300 transition">
          {course.titleMn || course.title}
        </h3>
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
          <span>⭐ {course.rating.toFixed(1)}</span>
          <span>👥 {course.totalStudents.toLocaleString()}</span>
          <span>📚 {course.totalLessons}</span>
          {course.totalDuration > 0 && <span>⏱ {duration}</span>}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-cyan-400">₮{course.price.toLocaleString()}</span>
          {course.originalPrice && (
            <span className="text-sm text-gray-500 line-through">₮{course.originalPrice.toLocaleString()}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
