import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { randomSales } from '@/lib/course-stats'

async function requireAdmin(req: NextRequest) {
  const session = await getServerSession(req)
  if (!session || session.role !== 'ADMIN') return null
  return session
}

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  price: z.number().int().min(0),
  fileKey: z.string().min(1),
  fileName: z.string().min(1),
  thumbnailUrl: z.string().optional(),
  isPublished: z.boolean().optional(),
})

export async function GET(req: NextRequest) {
  if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const products = await prisma.product.findMany({
    include: { _count: { select: { purchases: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ products })
}

export async function POST(req: NextRequest) {
  if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  try {
    const data = createSchema.parse(await req.json())
    const product = await prisma.product.create({ data: { ...data, displaySales: randomSales() } })
    return NextResponse.json({ product }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError)
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    return NextResponse.json({ error: 'Серверийн алдаа' }, { status: 500 })
  }
}
