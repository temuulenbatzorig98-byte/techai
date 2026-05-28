import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await getServerSession(req)
  if (!session) return NextResponse.json({ user: null })
  return NextResponse.json({ user: { userId: session.userId, role: session.role, email: session.email } })
}
