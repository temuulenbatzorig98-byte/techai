export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'

export default async function AdminPaymentsPage() {
  const payments = await prisma.payment.findMany({
    include: { user: { select: { name: true, email: true } }, course: { select: { titleMn: true } } },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  const statusLabel: Record<string, string> = {
    PAID: 'Төлөгдсөн', PENDING: 'Хүлээгдэж буй',
    FAILED: 'Амжилтгүй', EXPIRED: 'Хугацаа дууссан', REFUNDED: 'Буцаагдсан',
  }
  const statusColor: Record<string, string> = {
    PAID: 'text-green-400 bg-green-400/10', PENDING: 'text-yellow-400 bg-yellow-400/10',
    FAILED: 'text-red-400 bg-red-400/10', EXPIRED: 'text-slate-500 dark:text-gray-400 bg-gray-400/10',
    REFUNDED: 'text-blue-400 bg-blue-400/10',
  }

  const total = payments.filter(p => p.status === 'PAID').reduce((s, p) => s + p.amount, 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-syne text-2xl font-bold text-slate-900 dark:text-white">Төлбөрүүд</h1>
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-xl text-sm">
          Нийт орлого: ₮{total.toLocaleString()}
        </div>
      </div>

      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-gray-400">
                <th className="text-left px-6 py-4">Хэрэглэгч</th>
                <th className="text-left px-6 py-4">Курс</th>
                <th className="text-left px-6 py-4">Дүн</th>
                <th className="text-left px-6 py-4">Төлөв</th>
                <th className="text-left px-6 py-4">Огноо</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-white/3 transition">
                  <td className="px-6 py-4">
                    <div className="text-slate-900 dark:text-white font-medium">{p.user.name}</div>
                    <div className="text-slate-400 dark:text-gray-500 text-xs">{p.user.email}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-700 dark:text-gray-300">{p.course.titleMn}</td>
                  <td className="px-6 py-4 text-slate-900 dark:text-white font-medium">₮{p.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${statusColor[p.status]}`}>
                      {statusLabel[p.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-gray-400">
                    {new Date(p.createdAt).toLocaleDateString('mn-MN')}
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400 dark:text-gray-500">Төлбөр байхгүй</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
