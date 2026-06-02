import { DashboardSidebar } from '@/components/layout/DashboardSidebar'
import { ChatWidget } from '@/components/chatbot/ChatWidget'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get('auth_token')?.value
  const user = token ? await verifyToken(token) : null
  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-[#0d1220] flex">
      <DashboardSidebar userId={user.userId} role={user.role} />
      <main className="flex-1 lg:ml-64 p-6 lg:p-8">{children}</main>
      <ChatWidget />
    </div>
  )
}
