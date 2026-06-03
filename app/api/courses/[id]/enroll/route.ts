import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { syncCourseStats } from '@/lib/course-stats'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(req)
  if (!session) return NextResponse.json({ enrolled: false })

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session.userId, courseId: params.id } },
  })

  return NextResponse.json({ enrolled: !!enrollment, enrollment })
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const course = await prisma.course.findUnique({
    where: { id: params.id, isPublished: true },
    select: { price: true },
  })
  if (!course) return NextResponse.json({ error: 'Олдсонгүй' }, { status: 404 })
  if (course.price !== 0) return NextResponse.json({ error: 'Төлбөртэй курс' }, { status: 400 })

  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: session.userId, courseId: params.id } },
    create: { userId: session.userId, courseId: params.id },
    update: {},
  })

  await syncCourseStats(params.id)

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.enrollment.deleteMany({
    where: { userId: session.userId, courseId: params.id },
  })

  return NextResponse.json({ ok: true })
}
