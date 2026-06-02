import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(req)
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: session.userId, courseId: params.id } },
    create: { userId: session.userId, courseId: params.id },
    update: {},
  })

  const firstLesson = await prisma.lesson.findFirst({
    where: { section: { courseId: params.id } },
    orderBy: [{ section: { order: 'asc' } }, { order: 'asc' }],
    select: { id: true },
  })

  return NextResponse.json({ ok: true, firstLessonId: firstLesson?.id ?? null })
}
