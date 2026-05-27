import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get('auth_token')?.value
  const user = token ? await verifyToken(token) : null
  if (!user || user.role !== 'ADMIN') redirect('/dashboard')

  return (
    <div className="min-h-screen bg-[#0d1220] flex">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 p-6 lg:p-8">{children}</main>
    </div>
  )
}
