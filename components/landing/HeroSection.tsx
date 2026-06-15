import Link from 'next/link'

export function HeroSection() {
  const features = [
    'Монгол хэлээр',
    'Практик дасгал',
    'QPAY төлбөр',
    'Насан туршийн эрх',
  ]

  return (
    <section className="pt-32 pb-24 px-4 text-center relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-purple-600/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-28 left-1/2 -translate-x-1/2 w-[350px] h-[250px] bg-cyan-500/10 rounded-full blur-[90px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto">

        {/* Live badge */}
        <div className="inline-flex items-center gap-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none rounded-full px-4 py-2 text-sm text-slate-700 dark:text-gray-300 mb-10 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
          </span>
          Монголын #1 AI боловсролын платформ
        </div>

        {/* Headline */}
        <h1 className="font-syne text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6 leading-[1.1] tracking-tight animate-fade-in-up">
          AI ашигладаг хүмүүс{' '}
          <span className="gradient-text">цаг хэмнэдэг.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg lg:text-xl text-slate-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-100">
          Та ч бас AI Chatbot бүтээж, Excel ажлаа автоматжуулж, бүтээмжээ өсгөөрэй.
          <br className="hidden sm:block" />
          Энгийн ойлгомжтой видео хичээлүүдээр AI хэрэгслүүдийг бодит ажил дээр ашиглаж сурна.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up delay-200">
          <Link
            href="/courses"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-2xl font-semibold text-base hover:opacity-95 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-200"
          >
            Курсуудыг үзэх
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-2xl font-semibold text-base hover:bg-slate-50 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all duration-200"
          >
            Үнэгүй бүртгүүлэх
          </Link>
        </div>

        {/* Trust badges */}
        <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-slate-500 dark:text-gray-500 animate-fade-in-up delay-300">
          {features.map((f) => (
            <span key={f} className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8l3.5 3.5L13 4" />
              </svg>
              {f}
            </span>
          ))}
        </div>

        {/* Demo video */}
        <div className="mt-16 relative max-w-3xl mx-auto animate-fade-in-up delay-400">
          {/* Glow ring */}
          <div className="absolute -inset-1.5 bg-gradient-to-r from-purple-600/30 to-cyan-500/30 rounded-[20px] blur-xl" />
          <div className="absolute -inset-px bg-gradient-to-r from-purple-600/20 to-cyan-500/20 rounded-2xl" />

          {/* Browser chrome */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 dark:border-white/10 shadow-2xl shadow-purple-500/15">
            <div className="bg-white dark:bg-[#111827] px-4 py-3 flex items-center gap-2 border-b border-slate-100 dark:border-white/10">
              <div className="flex gap-1.5 flex-shrink-0">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                <div className="w-3 h-3 rounded-full bg-green-400/80" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-slate-100 dark:bg-white/5 rounded-md px-8 py-1 text-xs text-slate-400 dark:text-gray-500">
                  AI Agent — демо бичлэг
                </div>
              </div>
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
