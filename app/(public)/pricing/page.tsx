import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { PricingSection } from '@/components/landing/PricingSection'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0d1220]">
      <Navbar />
      <div className="pt-24">
        <div className="text-center py-12 px-4">
          <h1 className="font-syne text-4xl lg:text-5xl font-bold text-white mb-4">
            Үнийн <span className="gradient-text">мэдээлэл</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Нэг удаагийн төлбөрөөр насан туршийн эрх авна. Нэмэлт захиалга байхгүй.
          </p>
        </div>
        <PricingSection />
      </div>
      <Footer />
    </div>
  )
}
