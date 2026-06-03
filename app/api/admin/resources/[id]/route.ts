import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { deleteR2Object } from '@/lib/r2'

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(req)
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const resource = await prisma.resource.findUnique({ where: { id: params.id } })
  if (!resource) return NextResponse.json({ error: 'Олдсонгүй' }, { status: 404 })

  await deleteR2Object(resource.fileKey).catch(() => {})
  await prisma.resource.delete({ where: { id: params.id } })

  return NextResponse.json({ ok: true })
}
