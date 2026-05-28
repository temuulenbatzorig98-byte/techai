import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { createQPAYInvoice } from '@/lib/qpay'
import { getServerSession } from '@/lib/auth'

const schema = z.object({
  courseId: z.string(),
  couponCode: z.string().optional(),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(req)
  if (!session) return NextResponse.json({ error: 'Нэвтэрнэ үү' }, { status: 401 })

  try {
    const { courseId, couponCode } = schema.parse(await req.json())

    const course = await prisma.course.findUnique({ where: { id: courseId } })
    if (!course) return NextResponse.json({ error: 'Курс олдсонгүй' }, { status: 404 })

    const enrolled = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: session.userId, courseId } },
    })
    if (enrolled) return NextResponse.json({ error: 'Аль хэдийн бүртгэгдсэн байна' }, { status: 409 })

    let amount = course.price
    let coupon = null

    if (couponCode) {
      coupon = await prisma.coupon.findFirst({
        where: {
          code: couponCode.toUpperCase(),
          isActive: true,
          validFrom: { lte: new Date() },
          validUntil: { gte: new Date() },
        },
      })
      if (coupon) {
        if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
          return NextResponse.json({ error: 'Купон дууссан байна' }, { status: 400 })
        }
        amount =
          coupon.discountType === 'PERCENT'
            ? Math.round(amount * (1 - coupon.discountValue / 100))
            : Math.max(0, amount - coupon.discountValue)
      }
    }

    const senderInvoiceNo = `INV-${session.userId.slice(-6)}-${Date.now()}`

    const qpayData = await createQPAYInvoice({
      invoiceCode: process.env.QPAY_INVOICE_CODE || 'AUTOLEARN_INVOICE',
      senderInvoiceNo,
      invoiceReceiverCode: session.userId,
      invoiceDescription: `Negun AI: ${course.titleMn || course.title}`,
      amount,
      callbackUrl: `${process.env.NEXT_PUBLIC_URL}/api/payment/qpay/callback`,
    })

    const payment = await prisma.payment.create({
      data: {
        userId: session.userId,
        courseId,
        amount,
        status: 'PENDING',
        qpayInvoiceId: qpayData.invoice_id,
        qpayQrText: qpayData.qr_text,
        couponId: coupon?.id,
        discountAmount: course.price - amount,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      },
    })

    if (coupon) {
      await prisma.coupon.update({
        where: { id: coupon.id },
        data: { usedCount: { increment: 1 } },
      })
    }

    return NextResponse.json({
      paymentId: payment.id,
      invoiceId: qpayData.invoice_id,
      qrText: qpayData.qr_text,
      qrImage: qpayData.qr_image,
      amount,
      urls: qpayData.urls || [],
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    }
    console.error('QPAY create error:', err)
    return NextResponse.json({ error: 'Төлбөр үүсгэхэд алдаа гарлаа' }, { status: 500 })
  }
}
