import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { z } from 'zod'

async function requireAdmin(req: NextRequest) {
  const session = await getServerSession(req)
  if (!session || session.role !== 'ADMIN') return null
  return session
}

const patchSchema = z.object({
  title: z.string().min(1).optional(),
  order: z.number().int().optional(),
})

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  try {
    const data = patchSchema.parse(await req.json())
    const section = await prisma.section.update({ where: { id: params.id }, data })
    return NextResponse.json({ section })
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    return NextResponse.json({ error: 'Серверийн алдаа' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  await prisma.section.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
