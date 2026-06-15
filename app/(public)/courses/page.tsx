export const dynamic = 'force-dynamic'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CourseCard } from '@/components/course/CourseCard'
import { prisma } from '@/lib/prisma'
import { ChatWidget } from '@/components/chatbot/ChatWidget'

export const revalidate = 60

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    select: {
      id: true,
      slug: true,
      title: true,
      titleMn: true,
      thumbnailUrl: true,
      price: true,
      originalPrice: true,
      level: true,
      category: true,
      rating: true,
      totalStudents: true,
      totalLessons: true,
      totalDuration: true,
    },
    orderBy: { totalStudents: 'desc' },
  })

  return (
    <main className="min-h-screen bg-white dark:bg-[#0d1220]">
      <Navbar />

      {/* Page header */}
      <div className="border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#111827]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-10">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-purple-500 dark:text-purple-400 mb-4">
            <div className="h-px w-6 bg-purple-400" />
            Платформ
          </div>
          <h1 className="font-syne text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Бүх <span className="gradient-text">Курсууд</span>
          </h1>
          <p className="text-slate-500 dark:text-gray-400 text-base">
            AI автоматжуулалтын ирээдүйд бэлд —{' '}
            <span className="font-medium text-slate-700 dark:text-gray-300">{courses.length} курс</span>{' '}
            нээлттэй байна
          </p>
        </div>
      </div>

      {/* Courses grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-purple-50 dark:bg-purple-500/10 rounded-2xl flex items-center justify-center mb-5">
              <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <p className="text-slate-700 dark:text-white font-semibold mb-1">Курс байхгүй байна</p>
            <p className="text-slate-400 dark:text-gray-500 text-sm">Одоогоор нийтлэгдсэн курс байхгүй байна</p>
          </div>
        )}
      </div>

      <Footer />
      <ChatWidget />
    </main>
  )
}
