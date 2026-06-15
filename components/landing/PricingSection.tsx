import Link from 'next/link'

export function PricingSection() {
  const freeFeatures = ['Бүрэн видео хичээл', 'Татаж авах материал', 'Насан туршийн эрх', 'Шинэчлэлтийн эрх']
  const premiumFeatures = ['Бүх курсид нэвтрэх эрх', 'Шинэ курс нэмэгдэхэд', 'Онцгой дэмжлэг', 'Telegram хаалттай бүлэг']

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-transparent via-slate-50/80 to-slate-50 dark:via-transparent dark:to-[#0a0e1a]">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-purple-500 dark:text-purple-400 mb-4">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-purple-400" />
            Үнэ
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-purple-400" />
          </div>
          <h2 className="font-syne text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Хялбар <span className="gradient-text">Үнийн бодлого</span>
          </h2>
          <p className="text-slate-500 dark:text-gray-400 text-base">
            Нэг курс — нэг үнэ. Нэмэлт захиалгагүй, насан туршийн эрх.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Individual pricing card */}
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-2xl p-8 text-left flex flex-col shadow-sm shadow-black/[0.03] dark:shadow-none hover:border-slate-300 dark:hover:border-white/20 transition-colors duration-200">
            <div>
              <div className="text-sm font-medium text-slate-500 dark:text-gray-400 mb-3">Тус бүрийн курс</div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-syne text-4xl font-bold text-slate-900 dark:text-white">₮49,000+</span>
              </div>
              <div className="text-sm text-slate-400 dark:text-gray-500 mb-7">нэг удаагийн төлбөр</div>
              <ul className="space-y-3 mb-8">
                {freeFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-slate-600 dark:text-gray-300">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center">
                      <svg className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 6l2.5 2.5L10 3" />
                      </svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/courses"
              className="mt-auto block text-center py-3 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-300 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-white/5 hover:border-slate-300 dark:hover:border-white/20 transition-all duration-200 text-sm"
            >
              Курс сонгох →
            </Link>
          </div>

          {/* Bundle pricing card */}
          <div className="relative rounded-2xl p-8 text-left flex flex-col overflow-hidden pricing-featured-glow bg-gradient-to-br from-purple-600/[0.08] to-cyan-500/[0.08] dark:from-purple-600/15 dark:to-cyan-500/15 border border-purple-300/60 dark:border-purple-500/30">
            {/* Featured badge */}
            <div className="absolute top-5 right-5 bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-purple-500/30">
              ОНЦЛОГ
            </div>

            {/* Decorative glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative">
              <div className="text-sm font-medium text-slate-500 dark:text-gray-400 mb-3">Бүх курс багц</div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-syne text-4xl font-bold text-slate-900 dark:text-white">₮299,000</span>
              </div>
              <div className="text-sm text-emerald-500 dark:text-emerald-400 font-medium mb-7">
                ₮800,000 утгатай — 63% хэмнэлт
              </div>
              <ul className="space-y-3 mb-8">
                {premiumFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-slate-700 dark:text-gray-300">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-500/15 flex items-center justify-center">
                      <svg className="w-3 h-3 text-purple-500 dark:text-purple-400" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 6l2.5 2.5L10 3" />
                      </svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/register"
              className="mt-auto block text-center py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl font-semibold hover:opacity-95 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200 text-sm relative"
            >
              Одоо авах →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
