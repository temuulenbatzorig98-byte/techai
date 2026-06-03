import Link from 'next/link'

export function PricingSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-transparent to-[#0a0e1a]">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-syne text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Хялбар <span className="gradient-text">Үнийн бодлого</span>
        </h2>
        <p className="text-slate-500 dark:text-gray-400 mb-12">
          Нэг курс — нэг үнэ. Нэмэлт захиалгагүй, насан туршийн эрх.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-2xl p-8 text-left">
            <div className="text-sm text-slate-500 dark:text-gray-400 mb-2">Тус бүрийн курс</div>
            <div className="font-syne text-4xl font-bold text-slate-900 dark:text-white mb-1">₮49,000+</div>
            <div className="text-sm text-slate-400 dark:text-gray-500 mb-6">нэг удаагийн төлбөр</div>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-gray-400 mb-8">
              {['Бүрэн видео хичээл', 'Татаж авах материал', 'Насан туршийн эрх', 'Шинэчлэлтийн эрх'].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>{f}
                </li>
              ))}
            </ul>
            <Link href="/courses" className="block text-center py-3 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-300 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition text-sm">
              Курс сонгох →
            </Link>
          </div>

          <div className="bg-gradient-to-br from-purple-600/20 to-cyan-500/20 border border-purple-500/30 rounded-2xl p-8 text-left relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs px-3 py-1 rounded-full">
              ОНЦЛОГ
            </div>
            <div className="text-sm text-slate-500 dark:text-gray-400 mb-2">Бүх курс багц</div>
            <div className="font-syne text-4xl font-bold text-slate-900 dark:text-white mb-1">₮299,000</div>
            <div className="text-sm text-green-400 mb-6">₮800,000 утгатай — 63% хэмнэлт</div>
            <ul className="space-y-3 text-sm text-slate-700 dark:text-gray-300 mb-8">
              {['Бүх курсид нэвтрэх эрх', 'Шинэ курс нэмэгдэхэд', 'Онцгой дэмжлэг', 'Telegram хаалттай бүлэг'].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="text-cyan-400">✓</span>{f}
                </li>
              ))}
            </ul>
            <Link href="/register" className="block text-center py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl font-semibold text-sm hover:opacity-90 transition">
              Одоо авах →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
