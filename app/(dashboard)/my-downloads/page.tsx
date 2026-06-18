export const dynamic = 'force-dynamic'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function MyDownloadsPage() {
  const token = cookies().get('auth_token')?.value
  const session = token ? await verifyToken(token) : null
  if (!session) return null

  const purchases = await prisma.productPurchase.findMany({
    where: { userId: session.userId },
    include: {
      product: {
        select: { id: true, title: true, description: true, fileName: true, thumbnailUrl: true, price: true },
      },
    },
    orderBy: { purchasedAt: 'desc' },
  })

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="font-syne text-2xl font-bold text-slate-900 dark:text-white mb-8">Миний татаж авсан</h1>

      {purchases.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-400 dark:text-gray-500 mb-4">Одоогоор татаж авсан бүтээгдэхүүн байхгүй байна</p>
          <Link href="/products"
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl text-sm font-semibold">
            Бүтээгдэхүүнүүд үзэх
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {purchases.map(({ product, purchasedAt }) => (
            <div key={product.id} className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-xl p-4 flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-purple-600/10 to-cyan-500/10 flex-shrink-0 flex items-center justify-center">
                {product.thumbnailUrl
                  ? <img src={product.thumbnailUrl} alt={product.title} className="w-full h-full object-cover" />
                  : <span className="text-2xl">📦</span>
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-900 dark:text-white font-semibold truncate">{product.title}</p>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5 truncate">{product.fileName}</p>
                <p className="text-xs text-slate-400 dark:text-gray-500 mt-0.5">
                  {new Date(purchasedAt).toLocaleDateString('mn-MN')}
                </p>
              </div>
              <a href={`/api/products/${product.id}/download`}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 2v8M4 7l4 4 4-4" /><path d="M2 14h12" />
                </svg>
                Татах
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
