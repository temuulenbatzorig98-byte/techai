export const revalidate = 60
import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { isPublished: true },
    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      fileName: true,
      thumbnailUrl: true,
      displaySales: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <>
      <Navbar />
      <main className="min-h-screen hero-bg pt-24 pb-16">
        <div className="section-container">
          <div className="text-center mb-12">
            <h1 className="font-syne text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
              Татаж авах <span className="gradient-text">бүтээгдэхүүнүүд</span>
            </h1>
            <p className="text-slate-500 dark:text-gray-400 max-w-xl mx-auto">
              Нэг удаа төлж, хязгааргүй татаж авна уу
            </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20 text-slate-400 dark:text-gray-500">Удахгүй нэмэгдэнэ...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <Link key={p.id} href={`/products/${p.id}`}
                  className="group bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden card-premium hover:border-purple-500/30 transition-all">
                  <div className="aspect-video bg-gradient-to-br from-purple-600/10 to-cyan-500/10 flex items-center justify-center overflow-hidden">
                    {p.thumbnailUrl ? (
                      <img src={p.thumbnailUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <span className="text-5xl">📦</span>
                    )}
                  </div>
                  <div className="p-5">
                    <h2 className="font-syne font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">{p.title}</h2>
                    {p.description && (
                      <p className="text-sm text-slate-500 dark:text-gray-400 mb-4 line-clamp-2">{p.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-cyan-400">₮{p.price.toLocaleString()}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400 dark:text-gray-500">{p.displaySales.toLocaleString()} татаж авсан</span>
                        <span className="text-xs bg-purple-600/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-full">
                          Татах
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
