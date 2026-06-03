import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(req)
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const paymentCount = await prisma.payment.count({ where: { couponId: params.id } })
  if (paymentCount > 0) {
    return NextResponse.json(
      { error: `Энэ купон ${paymentCount} төлбөрт ашиглагдсан тул устгах боломжгүй. Идэвхгүй болгоно уу.` },
      { status: 409 }
    )
  }

  await prisma.coupon.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
