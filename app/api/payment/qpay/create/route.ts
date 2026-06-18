import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { createQPAYInvoice } from '@/lib/qpay'
import { getServerSession } from '@/lib/auth'

const schema = z.union([
  z.object({ courseId: z.string(), productId: z.undefined(), couponCode: z.string().optional() }),
  z.object({ productId: z.string(), courseId: z.undefined(), couponCode: z.undefined() }),
])

export async function POST(req: NextRequest) {
  const session = await getServerSession(req)
  if (!session) return NextResponse.json({ error: 'Нэвтэрнэ үү' }, { status: 401 })

  try {
    const body = schema.parse(await req.json())

    // ── Product payment ────────────────────────────────────────────
    if (body.productId) {
      const product = await prisma.product.findUnique({ where: { id: body.productId } })
      if (!product || !product.isPublished)
        return NextResponse.json({ error: 'Бүтээгдэхүүн олдсонгүй' }, { status: 404 })

      const existing = await prisma.productPurchase.findUnique({
        where: { userId_productId: { userId: session.userId, productId: body.productId } },
      })
      if (existing) return NextResponse.json({ error: 'Аль хэдийн худалдаж авсан байна' }, { status: 409 })

      const senderInvoiceNo = `PRD-${session.userId.slice(-6)}-${Date.now()}`
      const qpayData = await createQPAYInvoice({
        invoiceCode: process.env.QPAY_INVOICE_CODE || 'AUTOLEARN_INVOICE',
        senderInvoiceNo,
        invoiceReceiverCode: session.userId,
        invoiceDescription: `Negun AI: ${product.title}`,
        amount: product.price,
        callbackUrl: `${process.env.NEXT_PUBLIC_URL}/api/payment/qpay/callback`,
      })

      const payment = await prisma.payment.create({
        data: {
          userId: session.userId,
          productId: body.productId,
          amount: product.price,
          status: 'PENDING',
          qpayInvoiceId: qpayData.invoice_id,
          qpayQrText: qpayData.qr_text,
          expiresAt: new Date(Date.now() + 30 * 60 * 1000),
        },
      })

      return NextResponse.json({
        paymentId: payment.id,
        invoiceId: qpayData.invoice_id,
        qrText: qpayData.qr_text,
        qrImage: qpayData.qr_image,
        amount: product.price,
        urls: qpayData.urls || [],
      })
    }

    // ── Course payment ─────────────────────────────────────────────
    const courseId = body.courseId!
    const course = await prisma.course.findUnique({ where: { id: courseId } })
    if (!course) return NextResponse.json({ error: 'Курс олдсонгүй' }, { status: 404 })

    const enrolled = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: session.userId, courseId } },
    })
    if (enrolled) return NextResponse.json({ error: 'Аль хэдийн бүртгэгдсэн байна' }, { status: 409 })

    let amount = course.price
    let coupon = null

    if (body.couponCode) {
      coupon = await prisma.coupon.findFirst({
        where: {
          code: body.couponCode.toUpperCase(),
          isActive: true,
          validFrom: { lte: new Date() },
          validUntil: { gte: new Date() },
        },
      })
      if (coupon) {
        if (coupon.maxUses && coupon.usedCount >= coupon.maxUses)
          return NextResponse.json({ error: 'Купон дууссан байна' }, { status: 400 })
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
    if (err instanceof z.ZodError)
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    console.error('QPAY create error:', err)
    return NextResponse.json({ error: 'Төлбөр үүсгэхэд алдаа гарлаа' }, { status: 500 })
  }
}
