import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-4 text-center relative overflow-hidden">
      {/* Glow effects */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[300px] h-[200px] bg-cyan-500/15 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-gray-300 mb-8">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Монголын #1 AI боловсролын платформ
        </div>

        <h1 className="font-syne text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          Үнэгүй 24/7{' '}
          <span className="gradient-text">ажилтантай</span>
          <br />
          болмоор байна уу?
        </h1>

        <p className="text-lg lg:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          AI Chatbot бүтээх, n8n workflow, Facebook automation - зэргийг монгол хэлээр судлан өөрийн бизнесдээ хэрэгжүүлээрэй.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/courses"
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-2xl font-semibold text-lg hover:opacity-90 transition hover:scale-105 transform shadow-lg shadow-purple-500/25"
          >
            Курсуудыг үзэх →
          </Link>
          <Link
            href="/register"
            className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-semibold text-lg hover:bg-white/10 transition"
          >
            Үнэгүй бүртгүүлэх
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-400">
          {['✓ Монгол хэлээр', '✓ Практик дасгал', '✓ QPAY төлбөр', '✓ Насан туршийн эрх'].map((f) => (
            <span key={f}>{f}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
