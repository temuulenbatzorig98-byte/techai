export const dynamic = 'force-dynamic'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const token = cookies().get('auth_token')?.value
  const session = token ? await verifyToken(token) : null
  if (!session) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true, isVerified: true },
  })

  if (!user) redirect('/login')

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-syne text-2xl font-bold text-white mb-8">Профайл</h1>

      <div className="bg-[#111827] border border-white/10 rounded-2xl p-8 mb-6">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-3xl font-bold text-white">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-syne text-xl font-bold text-white">{user.name}</h2>
            <p className="text-gray-400 text-sm">{user.role === 'ADMIN' ? 'Админ' : 'Оюутан'}</p>
            <div className={`mt-1 inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${user.isVerified ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
              {user.isVerified ? '✓ Баталгаажсан' : '⚠ Баталгаажаагүй'}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { label: 'Нэр', value: user.name },
            { label: 'Имэйл', value: user.email ?? '—' },
            { label: 'Утас', value: user.phone ?? '—' },
            { label: 'Бүртгүүлсэн', value: new Date(user.createdAt).toLocaleDateString('mn-MN') },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center py-3 border-b border-white/5">
              <span className="text-sm text-gray-400">{label}</span>
              <span className="text-sm text-white">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
