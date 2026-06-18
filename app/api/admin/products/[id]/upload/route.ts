import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { getPresignedUploadUrl, deleteR2Object } from '@/lib/r2'

const schema = z.object({
  filename: z.string().min(1),
  contentType: z.string().min(1),
})

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(req)
  if (!session || session.role !== 'ADMIN')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const product = await prisma.product.findUnique({ where: { id: params.id } })
  if (!product) return NextResponse.json({ error: 'Бүтээгдэхүүн олдсонгүй' }, { status: 404 })

  try {
    const { filename, contentType } = schema.parse(await req.json())
    const ext = filename.split('.').pop()
    const key = `products/${params.id}/${Date.now()}-${filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`

    const uploadUrl = await getPresignedUploadUrl(key, contentType)

    // Remove old file from R2
    if (product.fileKey) {
      try { await deleteR2Object(product.fileKey) } catch {}
    }

    // Update product with new file info
    await prisma.product.update({
      where: { id: params.id },
      data: { fileKey: key, fileName: filename },
    })

    return NextResponse.json({ uploadUrl, key })
  } catch (err) {
    if (err instanceof z.ZodError)
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    return NextResponse.json({ error: 'Серверийн алдаа' }, { status: 500 })
  }
}
