export const dynamic = 'force-dynamic'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Хүлээгдэж буй',
  PAID: 'Амжилттай',
  FAILED: 'Амжилтгүй',
  EXPIRED: 'Хугацаа дууссан',
  REFUNDED: 'Буцаагдсан',
}
const STATUS_COLOR: Record<string, string> = {
  PENDING: 'text-amber-400 bg-amber-400/10',
  PAID: 'text-green-400 bg-green-400/10',
  FAILED: 'text-red-400 bg-red-400/10',
  EXPIRED: 'text-slate-500 dark:text-gray-400 bg-gray-400/10',
  REFUNDED: 'text-blue-400 bg-blue-400/10',
}

export default async function PaymentsPage() {
  const token = cookies().get('auth_token')?.value
  const session = token ? await verifyToken(token) : null
  if (!session) return null

  const payments = await prisma.payment.findMany({
    where: { userId: session.userId },
    include: {
      course: { select: { titleMn: true, title: true } },
      product: { select: { title: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="font-syne text-2xl font-bold text-slate-900 dark:text-white mb-8">Төлбөрийн түүх</h1>

      {payments.length === 0 ? (
        <div className="text-center py-20 text-slate-400 dark:text-gray-500">Төлбөрийн түүх байхгүй</div>
      ) : (
        <div className="space-y-3">
          {payments.map((p) => {
            const title = p.product?.title ?? p.course?.titleMn ?? p.course?.title ?? '—'
            const isProduct = !!p.product
            return (
              <div key={p.id} className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base">{isProduct ? '📦' : '📚'}</span>
                    <p className="text-slate-900 dark:text-white font-medium">{title}</p>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">{new Date(p.createdAt).toLocaleDateString('mn-MN')}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-cyan-400">₮{p.amount.toLocaleString()}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLOR[p.status]}`}>
                    {STATUS_LABEL[p.status]}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
