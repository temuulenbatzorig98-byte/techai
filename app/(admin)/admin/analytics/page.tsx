export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'

export default async function AdminAnalyticsPage() {
  const [
    totalUsers, totalCourses, totalEnrollments,
    paidPayments, recentPayments, topCourses,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.course.count(),
    prisma.enrollment.count(),
    prisma.payment.aggregate({ where: { status: 'PAID' }, _sum: { amount: true }, _count: true }),
    prisma.payment.findMany({
      where: { status: 'PAID' },
      include: { user: { select: { name: true } }, course: { select: { titleMn: true } } },
      orderBy: { paidAt: 'desc' },
      take: 5,
    }),
    prisma.course.findMany({
      orderBy: { totalStudents: 'desc' },
      take: 5,
      select: { titleMn: true, totalStudents: true, price: true },
    }),
  ])

  const stats = [
    { label: 'Нийт хэрэглэгч', value: totalUsers.toLocaleString(), icon: '👥' },
    { label: 'Нийт курс', value: totalCourses.toLocaleString(), icon: '📚' },
    { label: 'Нийт бүртгэл', value: totalEnrollments.toLocaleString(), icon: '🎓' },
    { label: 'Нийт орлого', value: `₮${(paidPayments._sum.amount ?? 0).toLocaleString()}`, icon: '💰' },
    { label: 'Амжилттай төлбөр', value: paidPayments._count.toLocaleString(), icon: '✅' },
  ]

  return (
    <div>
      <h1 className="font-syne text-2xl font-bold text-slate-900 dark:text-white mb-8">Аналитик</h1>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {stats.map(({ label, value, icon }) => (
          <div key={label} className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-2xl p-5">
            <div className="text-2xl mb-2">{icon}</div>
            <div className="font-syne text-xl font-bold text-slate-900 dark:text-white">{value}</div>
            <div className="text-xs text-slate-500 dark:text-gray-400 mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-2xl p-6">
          <h2 className="font-syne text-lg font-bold text-slate-900 dark:text-white mb-4">Сүүлийн төлбөрүүд</h2>
          <div className="space-y-3">
            {recentPayments.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-white/5">
                <div>
                  <div className="text-sm text-slate-900 dark:text-white">{p.user.name}</div>
                  <div className="text-xs text-slate-500 dark:text-gray-400">{p.course.titleMn}</div>
                </div>
                <div className="text-sm text-green-400 font-medium">₮{p.amount.toLocaleString()}</div>
              </div>
            ))}
            {recentPayments.length === 0 && <p className="text-slate-400 dark:text-gray-500 text-sm">Төлбөр байхгүй</p>}
          </div>
        </div>

        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-2xl p-6">
          <h2 className="font-syne text-lg font-bold text-slate-900 dark:text-white mb-4">Эрэлттэй курсууд</h2>
          <div className="space-y-3">
            {topCourses.map((c, i) => (
              <div key={c.titleMn} className="flex items-center justify-between py-2 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 dark:text-gray-500 text-sm w-4">{i + 1}</span>
                  <div className="text-sm text-slate-900 dark:text-white">{c.titleMn}</div>
                </div>
                <div className="text-xs text-slate-500 dark:text-gray-400">{c.totalStudents} оюутан</div>
              </div>
            ))}
            {topCourses.length === 0 && <p className="text-slate-400 dark:text-gray-500 text-sm">Курс байхгүй</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
