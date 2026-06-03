import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { z } from 'zod'

const schema = z.object({
  code: z.string(),
  courseId: z.string(),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(req)
  if (!session) return NextResponse.json({ error: 'Нэвтэрнэ үү' }, { status: 401 })

  try {
    const { code, courseId } = schema.parse(await req.json())

    const course = await prisma.course.findUnique({ where: { id: courseId }, select: { price: true } })
    if (!course) return NextResponse.json({ error: 'Курс олдсонгүй' }, { status: 404 })

    const coupon = await prisma.coupon.findFirst({
      where: {
        code: code.toUpperCase(),
        isActive: true,
        validFrom: { lte: new Date() },
        validUntil: { gte: new Date() },
      },
    })

    if (!coupon) return NextResponse.json({ error: 'Купон хүчингүй эсвэл хугацаа дууссан' }, { status: 400 })

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ error: 'Купон дууссан байна' }, { status: 400 })
    }

    const discountedAmount =
      coupon.discountType === 'PERCENT'
        ? Math.round(course.price * (1 - coupon.discountValue / 100))
        : Math.max(0, course.price - coupon.discountValue)

    const discountAmount = course.price - discountedAmount
    const discountLabel =
      coupon.discountType === 'PERCENT'
        ? `${coupon.discountValue}% хямдрал`
        : `₮${coupon.discountValue.toLocaleString()} хямдрал`

    return NextResponse.json({
      valid: true,
      discountedAmount,
      discountAmount,
      discountLabel,
      originalAmount: course.price,
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Серверийн алдаа' }, { status: 500 })
  }
}
