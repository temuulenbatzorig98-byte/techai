export const dynamic = 'force-dynamic'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function MyDownloadsPage() {
  const token = cookies().get('auth_token')?.value
  const session = token ? await verifyToken(token) : null
  if (!session) return null

  const [allProducts, purchases] = await Promise.all([
    prisma.product.findMany({
      where: { isPublished: true },
      select: {
        id: true,
        title: true,
        description: true,
        fileName: true,
        thumbnailUrl: true,
        price: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.productPurchase.findMany({
      where: { userId: session.userId },
      select: { productId: true },
    }),
  ])

  const purchasedIds = new Set(purchases.map((p) => p.productId))

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="font-syne text-2xl font-bold text-slate-900 dark:text-white mb-2">Бүтээгдэхүүн</h1>
      <p className="text-sm text-slate-500 dark:text-gray-400 mb-8">
        Төлбөр төлсөн бүтээгдэхүүнээ татаж авна уу
      </p>

      {allProducts.length === 0 ? (
        <div className="text-center py-20 text-slate-400 dark:text-gray-500">
          Одоогоор бүтээгдэхүүн байхгүй байна
        </div>
      ) : (
        <div className="space-y-3">
          {allProducts.map((product) => {
            const isPurchased = purchasedIds.has(product.id)
            return (
              <div key={product.id}
                className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-xl p-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-purple-600/10 to-cyan-500/10 flex-shrink-0 flex items-center justify-center">
                  {product.thumbnailUrl
                    ? <img src={product.thumbnailUrl} alt={product.title} className="w-full h-full object-cover" />
                    : <span className="text-2xl">📦</span>
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-slate-900 dark:text-white font-semibold truncate">{product.title}</p>
                  {product.description && (
                    <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5 line-clamp-1">{product.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold text-cyan-500">₮{product.price.toLocaleString()}</span>
                    {isPurchased && (
                      <span className="text-xs bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-0.5 rounded-full">
                        Худалдаж авсан
                      </span>
                    )}
                  </div>
                </div>

                {isPurchased ? (
                  <a href={`/api/products/${product.id}/download`}
                    className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 2v8M4 7l4 4 4-4" /><path d="M2 14h12" />
                    </svg>
                    Татах
                  </a>
                ) : (
                  <Link href={`/products/${product.id}`}
                    className="flex-shrink-0 px-4 py-2 border border-purple-500/40 text-purple-600 dark:text-purple-400 rounded-xl text-sm font-semibold hover:bg-purple-50 dark:hover:bg-purple-500/10 transition-colors whitespace-nowrap">
                    Төлбөр төлөх
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
