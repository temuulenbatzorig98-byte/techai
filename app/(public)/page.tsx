import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/landing/HeroSection'
import { StatsBar } from '@/components/landing/StatsBar'
import { CourseGrid } from '@/components/landing/CourseGrid'
import { ChatWidget } from '@/components/chatbot/ChatWidget'
import { prisma } from '@/lib/prisma'

export const revalidate = 60

export default async function HomePage() {
  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    select: {
      id: true,
      slug: true,
      title: true,
      titleMn: true,
      descriptionMn: true,
      description: true,
      thumbnailUrl: true,
      price: true,
      originalPrice: true,
      level: true,
      category: true,
      totalStudents: true,
      totalLessons: true,
    },
    orderBy: [{ isFeatured: 'desc' }, { totalStudents: 'desc' }],
  })

  return (
    <main className="hero-bg min-h-screen">
      <Navbar />
      <HeroSection />
      <StatsBar />
      <CourseGrid courses={courses} />
      <Footer />
      <ChatWidget />
    </main>
  )
}
