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

const LEVEL_CLASS: Record<string, string> = {
  BEGINNER: 'badge-beginner',
  INTERMEDIATE: 'badge-intermediate',
  ADVANCED: 'badge-advanced',
}

export function CourseCard({ course }: { course: Course }) {
  const hours = Math.floor(course.totalDuration / 3600)
  const mins = Math.floor((course.totalDuration % 3600) / 60)
  const duration = hours > 0 ? `${hours}ц ${mins}м` : `${mins}м`
  const discountPct = course.originalPrice && course.price > 0
    ? Math.round((1 - course.price / course.originalPrice) * 100)
    : 0

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group block bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden hover:border-purple-400/50 dark:hover:border-purple-500/40 card-premium"
    >
      {/* Thumbnail */}
      <div className="aspect-video bg-gradient-to-br from-purple-600/20 to-cyan-500/20 overflow-hidden relative">
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt={course.titleMn}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">🎓</div>
        )}
        {/* Discount badge overlay */}
        {discountPct > 0 && (
          <div className="absolute top-3 right-3 bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            -{discountPct}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-white/10 font-medium">
            {course.category}
          </span>
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${LEVEL_CLASS[course.level] ?? 'badge-beginner'}`}>
            {LEVEL_LABEL[course.level] ?? course.level}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200 text-[15px] leading-snug">
          {course.titleMn || course.title}
        </h3>

        {/* Meta row */}
        <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {course.rating.toFixed(1)}
          </span>
          <span>·</span>
          <span>{course.totalStudents.toLocaleString()} оюутан</span>
          <span>·</span>
          <span>{course.totalLessons} хичээл</span>
          {course.totalDuration > 0 && (
            <>
              <span>·</span>
              <span>{duration}</span>
            </>
          )}
        </div>

        {/* Price row */}
        <div className="flex items-center gap-2">
          {course.price === 0 ? (
            <span className="text-xl font-bold text-emerald-500 dark:text-emerald-400">Үнэгүй</span>
          ) : (
            <>
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                ₮{course.price.toLocaleString()}
              </span>
              {course.originalPrice && (
                <span className="text-sm text-slate-400 dark:text-gray-500 line-through">
                  ₮{course.originalPrice.toLocaleString()}
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </Link>
  )
}
