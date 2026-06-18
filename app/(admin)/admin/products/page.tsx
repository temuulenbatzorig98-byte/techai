export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { _count: { select: { purchases: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-syne text-2xl font-bold text-slate-900 dark:text-white">Бүтээгдэхүүн удирдлага</h1>
        <Link href="/admin/products/new"
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl text-sm font-semibold">
          + Шинэ бүтээгдэхүүн
        </Link>
      </div>

      <div className="space-y-3">
        {products.map((p) => (
          <div key={p.id} className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {p.thumbnailUrl ? (
                <img src={p.thumbnailUrl} alt={p.title} className="w-16 h-10 object-cover rounded-lg" />
              ) : (
                <div className="w-16 h-10 bg-slate-100 dark:bg-white/5 rounded-lg flex items-center justify-center text-xl">📦</div>
              )}
              <div>
                <p className="text-slate-900 dark:text-white font-medium">{p.title}</p>
                <div className="flex gap-3 mt-1">
                  <span className="text-xs text-slate-500 dark:text-gray-400">₮{p.price.toLocaleString()}</span>
                  <span className="text-xs text-slate-500 dark:text-gray-400">{p._count.purchases} худалдаа</span>
                  <span className="text-xs text-slate-500 dark:text-gray-400 font-mono truncate max-w-[160px]">{p.fileName}</span>
                  <span className={`text-xs ${p.isPublished ? 'text-green-400' : 'text-amber-400'}`}>
                    {p.isPublished ? '● Нийтлэгдсэн' : '● Нийтлэгдээгүй'}
                  </span>
                </div>
              </div>
            </div>
            <Link href={`/admin/products/${p.id}`}
              className="text-xs px-3 py-1.5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-300 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5">
              Засах
            </Link>
          </div>
        ))}
        {products.length === 0 && (
          <div className="text-center py-16 text-slate-400 dark:text-gray-500">Бүтээгдэхүүн байхгүй байна</div>
        )}
      </div>
    </div>
  )
}
