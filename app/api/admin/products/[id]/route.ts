import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { deleteR2Object } from '@/lib/r2'

async function requireAdmin(req: NextRequest) {
  const session = await getServerSession(req)
  if (!session || session.role !== 'ADMIN') return null
  return session
}

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().int().min(0).optional(),
  thumbnailUrl: z.string().optional(),
  isPublished: z.boolean().optional(),
  fileKey: z.string().optional(),
  fileName: z.string().optional(),
})

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { _count: { select: { purchases: true } } },
  })
  if (!product) return NextResponse.json({ error: 'Олдсонгүй' }, { status: 404 })
  return NextResponse.json({ product })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  try {
    const data = updateSchema.parse(await req.json())
    const product = await prisma.product.update({ where: { id: params.id }, data })
    return NextResponse.json({ product })
  } catch (err) {
    if (err instanceof z.ZodError)
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    return NextResponse.json({ error: 'Серверийн алдаа' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const product = await prisma.product.findUnique({ where: { id: params.id } })
  if (!product) return NextResponse.json({ error: 'Олдсонгүй' }, { status: 404 })

  try { await deleteR2Object(product.fileKey) } catch {}
  if (product.thumbnailUrl) {
    const key = product.thumbnailUrl.split('/').slice(-2).join('/')
    try { await deleteR2Object(key) } catch {}
  }

  await prisma.product.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
