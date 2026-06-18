import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { getPresignedDownloadUrl } from '@/lib/r2'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(req)
  if (!session) return NextResponse.json({ error: 'Нэвтэрнэ үү' }, { status: 401 })

  const product = await prisma.product.findUnique({ where: { id: params.id } })
  if (!product) return NextResponse.json({ error: 'Бүтээгдэхүүн олдсонгүй' }, { status: 404 })

  if (session.role !== 'ADMIN') {
    const purchase = await prisma.productPurchase.findUnique({
      where: { userId_productId: { userId: session.userId, productId: params.id } },
    })
    if (!purchase) return NextResponse.json({ error: 'Энэ бүтээгдэхүүнийг худалдаж аваагүй байна' }, { status: 403 })
  }

  const url = await getPresignedDownloadUrl(product.fileKey, product.fileName, 300)
  return NextResponse.redirect(url)
}
