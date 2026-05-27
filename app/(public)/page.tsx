import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/landing/HeroSection'
import { StatsBar } from '@/components/landing/StatsBar'
import { CourseGrid } from '@/components/landing/CourseGrid'
import { PricingSection } from '@/components/landing/PricingSection'
import { ChatWidget } from '@/components/chatbot/ChatWidget'

export default function HomePage() {
  return (
    <main className="hero-bg min-h-screen">
      <Navbar />
      <HeroSection />
      <StatsBar />
      <CourseGrid />
      <PricingSection />
      <Footer />
      <ChatWidget />
    </main>
  )
}
