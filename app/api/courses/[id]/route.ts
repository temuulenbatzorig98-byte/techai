import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
      sections: {
        include: {
          lessons: {
            select: {
              id: true,
              title: true,
              titleMn: true,
              duration: true,
              order: true,
              isFree: true,
              isPublished: true,
            },
            orderBy: { order: 'asc' },
          },
        },
        orderBy: { order: 'asc' },
      },
    },
  })

  if (!course) return NextResponse.json({ error: 'Курс олдсонгүй' }, { status: 404 })
  return NextResponse.json({ course })
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(req)
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const data = await req.json()
  const course = await prisma.course.update({
    where: { id: params.id },
    data,
  })
  return NextResponse.json({ course })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(req)
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  await prisma.course.delete({ where: { id: params.id } })
  return NextResponse.json({ message: 'Курс устгагдлаа' })
}
