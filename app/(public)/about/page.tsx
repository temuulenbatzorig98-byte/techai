import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0d1220]">
      <Navbar />
      <div className="pt-24 pb-12 px-4 max-w-4xl mx-auto">

        <div className="text-center py-12">
          <h1 className="font-syne text-4xl lg:text-5xl font-bold text-white mb-4">
            Бидний <span className="gradient-text">тухай</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Negun AI — Монголын хамгийн дэвшилтэт AI боловсролын платформ
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-[#111827] border border-white/10 rounded-2xl p-8">
            <div className="text-3xl mb-4">🎯</div>
            <h2 className="font-syne text-xl font-bold text-white mb-3">Манай зорилго</h2>
            <p className="text-gray-400 leading-relaxed">
              Монголын залуучуудад AI технологийн мэдлэг, чадварыг хялбар, хүртээмжтэй байдлаар олгох.
              Ирээдүйн ажлын байранд бэлтгэх, бизнесийн боломжийг нэмэгдүүлэх.
            </p>
          </div>
          <div className="bg-[#111827] border border-white/10 rounded-2xl p-8">
            <div className="text-3xl mb-4">🚀</div>
            <h2 className="font-syne text-xl font-bold text-white mb-3">Яагаад бид?</h2>
            <p className="text-gray-400 leading-relaxed">
              Монгол хэл дээрх AI сургалт, практик даалгавар, шууд дэмжлэг.
              Суралцсан мэдлэгээ тэр даруй ажилдаа ашиглах боломжтой.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { value: '1,000+', label: 'Оюутан' },
            { value: '10+', label: 'Курс' },
            { value: '95%', label: 'Сэтгэл ханамж' },
            { value: '24/7', label: 'Дэмжлэг' },
          ].map(({ value, label }) => (
            <div key={label} className="bg-[#111827] border border-white/10 rounded-2xl p-6 text-center">
              <div className="font-syne text-3xl font-bold gradient-text mb-1">{value}</div>
              <div className="text-sm text-gray-400">{label}</div>
            </div>
          ))}
        </div>

        <div className="bg-[#111827] border border-white/10 rounded-2xl p-8 mb-16">
          <h2 className="font-syne text-2xl font-bold text-white mb-6">Холбоо барих</h2>
          <div className="space-y-4 text-gray-400">
            <p>📧 Имэйл: <a href="mailto:info@negun.store" className="text-purple-400 hover:text-purple-300">info@negun.store</a></p>
            <p>📱 Telegram: <a href="https://t.me/autolearn_mn" className="text-purple-400 hover:text-purple-300">@autolearn_mn</a></p>
            <p>🌐 Вэбсайт: negun.store</p>
          </div>
        </div>

        <div className="text-center">
          <Link href="/courses"
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl font-semibold hover:opacity-90 transition">
            Курсуудыг үзэх →
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}
