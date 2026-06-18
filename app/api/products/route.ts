import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const products = await prisma.product.findMany({
    where: { isPublished: true },
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
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ products })
}
