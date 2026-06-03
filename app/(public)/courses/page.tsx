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
      <div className="max-w-7xl mx-auto px-4 py-20">
        <h1 className="font-syne text-4xl font-bold text-slate-900 dark:text-white mb-2">
          Бүх <span className="gradient-text">Курсууд</span>
        </h1>
        <p className="text-slate-500 dark:text-gray-400 mb-10">
          AI автоматжуулалтын ирээдүйд бэлд — {courses.length} курс нээлттэй байна
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
        {courses.length === 0 && (
          <div className="text-center py-20 text-slate-400 dark:text-gray-500">
            Одоогоор курс байхгүй байна
          </div>
        )}
      </div>
      <Footer />
      <ChatWidget />
    </main>
  )
}
