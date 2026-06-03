export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import { SyncStatsButton } from '@/components/admin/SyncStatsButton'

export default async function AdminDashboard() {
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const [totalUsers, totalCourses, totalEnrollments, revenueResult, monthlyRevenue, recentPayments] =
    await Promise.all([
      prisma.user.count(),
      prisma.course.count({ where: { isPublished: true } }),
      prisma.enrollment.count(),
      prisma.payment.aggregate({ where: { status: 'PAID' }, _sum: { amount: true } }),
      prisma.payment.aggregate({ where: { status: 'PAID', paidAt: { gte: monthStart } }, _sum: { amount: true } }),
      prisma.payment.findMany({
        where: { status: 'PAID' },
        include: { user: { select: { name: true } }, course: { select: { titleMn: true } } },
        orderBy: { paidAt: 'desc' },
        take: 8,
      }),
    ])

  const stats = [
    { label: 'Нийт хэрэглэгч', value: totalUsers.toLocaleString(), icon: '👥', color: 'text-purple-400' },
    { label: 'Нийт орлого', value: `₮${(revenueResult._sum.amount || 0).toLocaleString()}`, icon: '💰', color: 'text-green-400' },
    { label: 'Сарын орлого', value: `₮${(monthlyRevenue._sum.amount || 0).toLocaleString()}`, icon: '📈', color: 'text-cyan-400' },
    { label: 'Нийт бүртгэл', value: totalEnrollments.toLocaleString(), icon: '🎓', color: 'text-amber-400' },
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-syne text-2xl font-bold text-slate-900 dark:text-white">Админ Хяналтын Самбар</h1>
        <SyncStatsButton />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-2xl p-5">
            <div className="text-2xl mb-3">{s.icon}</div>
            <div className={`text-2xl font-bold ${s.color} mb-1`}>{s.value}</div>
            <div className="text-xs text-slate-500 dark:text-gray-400">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-2xl p-6">
        <h2 className="font-syne font-bold text-slate-900 dark:text-white mb-4">Сүүлийн төлбөрүүд</h2>
        <div className="space-y-3">
          {recentPayments.map((p) => (
            <div key={p.id} className="flex items-center justify-between py-2 border-b border-white/5">
              <div>
                <p className="text-sm text-slate-900 dark:text-white">{p.user.name}</p>
                <p className="text-xs text-slate-500 dark:text-gray-400">{p.course.titleMn}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-green-400">₮{p.amount.toLocaleString()}</p>
                <p className="text-xs text-slate-400 dark:text-gray-500">
                  {p.paidAt ? new Date(p.paidAt).toLocaleDateString('mn-MN') : '—'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
