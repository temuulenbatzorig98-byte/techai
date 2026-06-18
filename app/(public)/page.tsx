import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/landing/HeroSection'
import { StatsBar } from '@/components/landing/StatsBar'
import { CourseGrid } from '@/components/landing/CourseGrid'
import { ProductsSection } from '@/components/landing/ProductsSection'
import { ChatWidget } from '@/components/chatbot/ChatWidget'
import { prisma } from '@/lib/prisma'

export const revalidate = 60

export default async function HomePage() {
  const [courses, products] = await Promise.all([
    prisma.course.findMany({
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
    }),
    prisma.product.findMany({
      where: { isPublished: true },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        thumbnailUrl: true,
        displaySales: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
  ])

  return (
    <main className="hero-bg min-h-screen">
      <Navbar />
      <HeroSection />
      <StatsBar />
      <CourseGrid courses={courses} />
      <ProductsSection products={products} />
      <Footer />
      <ChatWidget />
    </main>
  )
}
