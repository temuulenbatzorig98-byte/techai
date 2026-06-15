export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { prisma } from '@/lib/prisma'
import { LessonList } from '@/components/course/LessonList'
import { QPAYEnrollButton } from '@/components/payment/QPAYEnrollButton'
import { ChatWidget } from '@/components/chatbot/ChatWidget'

export const revalidate = 60

interface Props {
  params: { slug: string }
}

export default async function CourseDetailPage({ params }: Props) {
  const course = await prisma.course.findUnique({
    where: { slug: params.slug.toLowerCase(), isPublished: true },
    include: {
      _count: { select: { enrollments: true } },
      sections: {
        include: {
          lessons: {
            select: {
              id: true,
              title: true,
              titleMn: true,
              duration: true,
              order: true,
              isFree: true,
            },
            orderBy: { order: 'asc' },
          },
        },
        orderBy: { order: 'asc' },
      },
    },
  })

  if (!course) notFound()

  const allLessons = course.sections.flatMap((s) => s.lessons)
  const totalLessons = allLessons.length
  const calculatedDuration = allLessons.reduce((sum, l) => sum + l.duration, 0)
  const totalDuration = calculatedDuration > 0 ? calculatedDuration : course.totalDuration
  const totalStudents = course.totalStudents > 0 ? course.totalStudents : course._count.enrollments
  const rating = course.rating > 0 ? course.rating : 4.8

  const levelLabel: Record<string, string> = {
    BEGINNER: 'Анхан шат',
    INTERMEDIATE: 'Дунд шат',
    ADVANCED: 'Ахисан шат',
  }

  const levelClass: Record<string, string> = {
    BEGINNER: 'badge-beginner',
    INTERMEDIATE: 'badge-intermediate',
    ADVANCED: 'badge-advanced',
  }

  const formatDuration = (s: number) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    return h > 0 ? `${h} цаг ${m} мин` : `${m} минут`
  }

  const discountPct = course.originalPrice && course.price > 0
    ? Math.round((1 - course.price / course.originalPrice) * 100)
    : 0

  return (
    <main className="min-h-screen bg-white dark:bg-[#0d1220]">
      <Navbar />

      {/* Hero section */}
      <div className="border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#111827]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-12 grid lg:grid-cols-3 gap-12">

          {/* Left: course info */}
          <div className="lg:col-span-2">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/25">
                {course.category}
              </span>
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${levelClass[course.level] ?? 'badge-beginner'}`}>
                {levelLabel[course.level]}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-syne text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
              {course.titleMn || course.title}
            </h1>

            {/* Description */}
            <p className="text-slate-600 dark:text-gray-400 leading-relaxed mb-7 text-base">
              {course.descriptionMn || course.description}
            </p>

            {/* Meta stats */}
            <div className="flex flex-wrap gap-6">
              {[
                { icon: (
                  <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ), label: `${rating.toFixed(1)} үнэлгээ` },
                { icon: (
                  <svg className="w-4 h-4 text-slate-400 dark:text-gray-500" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 14v-1a4 4 0 00-8 0v1" /><circle cx="8" cy="5" r="3" />
                    <path d="M15 14v-1a4 4 0 00-3-3.87M14 2.13a4 4 0 010 7.75" />
                  </svg>
                ), label: `${totalStudents.toLocaleString()} оюутан` },
                { icon: (
                  <svg className="w-4 h-4 text-slate-400 dark:text-gray-500" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h12v10H2V3z" /><path d="M5 7h6M5 10h4" />
                  </svg>
                ), label: `${totalLessons} хичээл` },
                { icon: (
                  <svg className="w-4 h-4 text-slate-400 dark:text-gray-500" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="8" cy="8" r="6" /><path d="M8 4v4l2.5 2.5" />
                  </svg>
                ), label: formatDuration(totalDuration) },
              ].map(({ icon, label }) => (
                <span key={label} className="flex items-center gap-2 text-sm text-slate-600 dark:text-gray-400">
                  {icon}
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Right: enrollment card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#0d1220] border border-slate-200 dark:border-white/10 rounded-2xl p-6 sticky top-24 shadow-[0_8px_32px_rgba(124,58,237,0.1)] dark:shadow-[0_8px_32px_rgba(124,58,237,0.2)]">
              {/* Thumbnail */}
              {course.thumbnailUrl && (
                <div className="rounded-xl overflow-hidden mb-5 aspect-video">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.titleMn}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-1">
                {course.price === 0 ? (
                  <span className="text-3xl font-bold text-emerald-500 dark:text-emerald-400 font-syne">Үнэгүй</span>
                ) : (
                  <>
                    <span className="text-3xl font-bold text-slate-900 dark:text-white font-syne">
                      ₮{course.price.toLocaleString()}
                    </span>
                    {course.originalPrice && (
                      <span className="text-slate-400 dark:text-gray-500 line-through text-lg">
                        ₮{course.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Discount badge */}
              {discountPct > 0 && (
                <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 9l2 2 4-4" /><circle cx="8" cy="8" r="6" />
                  </svg>
                  {discountPct}% хямдрал
                </div>
              )}

              {/* Enroll button */}
              <QPAYEnrollButton
                courseId={course.id}
                courseTitle={course.titleMn || course.title}
                amount={course.price}
              />

              {/* Guarantees */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/10 space-y-2">
                {['Насан туршийн нэвтрэх эрх', 'Татаж авах материал', '30 хоногийн баталгаа'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs text-slate-500 dark:text-gray-400">
                    <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 7l3.5 3.5L12 3" />
                    </svg>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <h2 className="font-syne text-2xl font-bold text-slate-900 dark:text-white mb-7">
          Хичээлийн агуулга
        </h2>
        <LessonList sections={course.sections} />
      </div>

      <Footer />
      <ChatWidget />
    </main>
  )
}
