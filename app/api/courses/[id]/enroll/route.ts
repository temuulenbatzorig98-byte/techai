import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(req)
  if (!session) return NextResponse.json({ enrolled: false })

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session.userId, courseId: params.id } },
  })

  return NextResponse.json({ enrolled: !!enrollment, enrollment })
}
