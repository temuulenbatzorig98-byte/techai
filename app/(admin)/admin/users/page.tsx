export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: { _count: { select: { enrollments: true, payments: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="font-syne text-2xl font-bold text-slate-900 dark:text-white mb-8">
        Хэрэглэгчид ({users.length})
      </h1>

      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-white/10">
              {['Нэр', 'Имэйл', 'Үүрэг', 'Курс', 'Бүртгүүлсэн', 'Статус'].map((h) => (
                <th key={h} className="text-left text-xs text-slate-500 dark:text-gray-400 px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-white/5 hover:bg-white/2">
                <td className="px-4 py-3 text-slate-900 dark:text-white">{u.name}</td>
                <td className="px-4 py-3 text-slate-500 dark:text-gray-400">{u.email || u.phone || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${u.role === 'ADMIN' ? 'bg-purple-600/20 text-purple-400' : 'bg-gray-600/20 text-slate-500 dark:text-gray-400'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-700 dark:text-gray-300">{u._count.enrollments}</td>
                <td className="px-4 py-3 text-slate-500 dark:text-gray-400 text-xs">
                  {new Date(u.createdAt).toLocaleDateString('mn-MN')}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${u.isVerified ? 'bg-green-600/20 text-green-400' : 'bg-amber-600/20 text-amber-400'}`}>
                    {u.isVerified ? 'Баталгаажсан' : 'Хүлээгдэж буй'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
