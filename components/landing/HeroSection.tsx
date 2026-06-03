import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-4 text-center relative overflow-hidden">
      {/* Glow effects */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[300px] h-[200px] bg-cyan-500/15 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full px-4 py-2 text-sm text-slate-700 dark:text-gray-300 mb-8">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Монголын #1 AI боловсролын платформ
        </div>

        <h1 className="font-syne text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
          AI ашигладаг хүмүүс{' '}
          <span className="gradient-text">цаг хэмнэдэг.</span>
        </h1>

        <p className="text-lg lg:text-xl text-slate-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Та ч бас AI Chatbot бүтээж, Excel ажлаа автоматжуулж, бүтээмжээ өсгөөрэй.
          <br className="hidden sm:block" />
          Энгийн ойлгомжтой видео хичээлүүдээр AI хэрэгслүүдийг бодит ажил дээр ашиглаж сурна.
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
            className="px-8 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-2xl font-semibold text-lg hover:bg-white/10 transition"
          >
            Үнэгүй бүртгүүлэх
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-slate-500 dark:text-gray-400">
          {['✓ Монгол хэлээр', '✓ Практик дасгал', '✓ QPAY төлбөр', '✓ Насан туршийн эрх'].map((f) => (
            <span key={f}>{f}</span>
          ))}
        </div>

        {/* Demo video */}
        <div className="mt-16 relative max-w-3xl mx-auto">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/40 to-cyan-500/40 rounded-2xl blur-lg" />
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl shadow-purple-500/20">
            <div className="bg-white dark:bg-[#111827]/80 px-4 py-2.5 flex items-center gap-2 border-b border-slate-200 dark:border-white/10">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <span className="text-xs text-slate-400 dark:text-gray-500 ml-2">AI Agent — демо бичлэг</span>
            </div>
            <div className="aspect-video">
              <iframe
                src="https://www.youtube.com/embed/z7fmKmg-lQI?start=36&rel=0&modestbranding=1"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="AI Agent демо"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
