import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { z } from 'zod'

async function requireAdmin(req: NextRequest) {
  const session = await getServerSession(req)
  if (!session || session.role !== 'ADMIN') return null
  return session
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
      sections: {
        orderBy: { order: 'asc' },
        include: { lessons: { orderBy: { order: 'asc' } } },
      },
    },
  })
  if (!course) return NextResponse.json({ error: 'Олдсонгүй' }, { status: 404 })
  return NextResponse.json({ course })
}

const updateSchema = z.object({
  titleMn: z.string().min(2).optional(),
  title: z.string().min(2).optional(),
  descriptionMn: z.string().optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  originalPrice: z.number().optional(),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
  category: z.string().optional(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  thumbnailUrl: z.string().optional(),
})

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  try {
    const data = updateSchema.parse(await req.json())
    const course = await prisma.course.update({ where: { id: params.id }, data })
    return NextResponse.json({ course })
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    return NextResponse.json({ error: 'Серверийн алдаа' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  await prisma.course.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
