import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(req)

  const product = await prisma.product.findUnique({
    where: { id: params.id, isPublished: true },
    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      fileName: true,
      thumbnailUrl: true,
      createdAt: true,
      _count: { select: { purchases: true } },
    },
  })
  if (!product) return NextResponse.json({ error: 'Олдсонгүй' }, { status: 404 })

  let purchased = false
  if (session) {
    const purchase = await prisma.productPurchase.findUnique({
      where: { userId_productId: { userId: session.userId, productId: params.id } },
    })
    purchased = !!purchase
  }

  return NextResponse.json({ product, purchased })
}
