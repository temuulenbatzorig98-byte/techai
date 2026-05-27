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
    where: { slug: params.slug, isPublished: true },
    include: {
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

  const levelLabel: Record<string, string> = {
    BEGINNER: 'Анхан шат',
    INTERMEDIATE: 'Дунд шат',
    ADVANCED: 'Ахисан шат',
  }

  const formatDuration = (s: number) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    return h > 0 ? `${h} цаг ${m} мин` : `${m} минут`
  }

  return (
    <main className="min-h-screen bg-[#0d1220]">
      <Navbar />

      {/* Hero */}
      <div className="border-b border-white/10 bg-[#111827]">
        <div className="max-w-7xl mx-auto px-4 py-16 grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="flex gap-2 mb-4">
              <span className="text-xs bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full">
                {course.category}
              </span>
              <span className="text-xs bg-cyan-600/20 text-cyan-400 border border-cyan-600/30 px-3 py-1 rounded-full">
                {levelLabel[course.level]}
              </span>
            </div>
            <h1 className="font-syne text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
              {course.titleMn || course.title}
            </h1>
            <p className="text-gray-400 leading-relaxed mb-6">{course.descriptionMn || course.description}</p>
            <div className="flex flex-wrap gap-6 text-sm text-gray-400">
              <span>⭐ {course.rating.toFixed(1)} үнэлгээ</span>
              <span>👥 {course.totalStudents.toLocaleString()} оюутан</span>
              <span>📚 {course.totalLessons} хичээл</span>
              <span>⏱ {formatDuration(course.totalDuration)}</span>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-[#0d1220] border border-white/10 rounded-2xl p-6 sticky top-24 card-glow">
              {course.thumbnailUrl && (
                <img
                  src={course.thumbnailUrl}
                  alt={course.titleMn}
                  className="w-full aspect-video object-cover rounded-xl mb-4"
                />
              )}
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-bold text-cyan-400">
                  ₮{course.price.toLocaleString()}
                </span>
                {course.originalPrice && (
                  <span className="text-gray-500 line-through text-lg">
                    ₮{course.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              {course.originalPrice && (
                <p className="text-sm text-green-400 mb-4">
                  {Math.round((1 - course.price / course.originalPrice) * 100)}% хямдрал
                </p>
              )}
              <QPAYEnrollButton
                courseId={course.id}
                courseTitle={course.titleMn || course.title}
                amount={course.price}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="font-syne text-2xl font-bold text-white mb-6">Хичээлийн агуулга</h2>
        <LessonList sections={course.sections} />
      </div>

      <Footer />
      <ChatWidget />
    </main>
  )
}
