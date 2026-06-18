import Link from 'next/link'

interface Product {
  id: string
  title: string
  description: string | null
  price: number
  thumbnailUrl: string | null
  displaySales: number
}

export function ProductsSection({ products }: { products: Product[] }) {
  if (products.length === 0) return null

  return (
    <section className="py-24 px-4 border-t border-slate-100 dark:border-white/5">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-cyan-500 dark:text-cyan-400 mb-4">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-cyan-400" />
            Дижитал бүтээгдэхүүн
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-cyan-400" />
          </div>
          <h2 className="font-syne text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Онцлох <span className="gradient-text">Бүтээгдэхүүн</span>
          </h2>
          <p className="text-slate-500 dark:text-gray-400 max-w-xl mx-auto text-base leading-relaxed">
            Нэг удаа төлж, хязгааргүй ашиглаарай
          </p>
        </div>

        {/* Product cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 max-w-5xl mx-auto">
          {products.map((p) => (
            <Link key={p.id} href={`/products/${p.id}`}
              className="group bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden hover:border-cyan-400/50 dark:hover:border-cyan-500/40 card-premium transition-all">
              <div className="aspect-video bg-gradient-to-br from-cyan-600/10 to-purple-600/10 flex items-center justify-center overflow-hidden">
                {p.thumbnailUrl ? (
                  <img src={p.thumbnailUrl} alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]" />
                ) : (
                  <span className="text-5xl">📦</span>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-syne font-bold text-slate-900 dark:text-white text-[15px] mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-1">
                  {p.title}
                </h3>
                {p.description && (
                  <p className="text-sm text-slate-500 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                )}
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xl font-bold text-cyan-500 dark:text-cyan-400">
                    ₮{p.price.toLocaleString()}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 dark:text-gray-500">{p.displaySales.toLocaleString()} татаж авсан</span>
                    <span className="text-xs bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                      Татах
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* See all button */}
        <div className="text-center">
          <Link href="/products"
            className="inline-flex items-center gap-2 px-7 py-3 border border-slate-200 dark:border-white/15 text-slate-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/5 hover:border-slate-300 dark:hover:border-white/25 hover:-translate-y-px transition-all duration-200">
            Бүх бүтээгдэхүүн үзэх
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
