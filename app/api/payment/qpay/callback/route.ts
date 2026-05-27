import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { notifyNewPayment } from '@/lib/telegram'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { payment_status, object_id } = body

    if (payment_status !== 'PAID') return NextResponse.json({ ok: true })

    const payment = await prisma.payment.findUnique({
      where: { qpayInvoiceId: object_id },
      include: { user: true, course: true },
    })

    if (!payment || payment.status === 'PAID') return NextResponse.json({ ok: true })

    await prisma.$transaction([
      prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'PAID', paidAt: new Date() },
      }),
      prisma.enrollment.create({
        data: { userId: payment.userId, courseId: payment.courseId },
      }),
      prisma.course.update({
        where: { id: payment.courseId },
        data: { totalStudents: { increment: 1 } },
      }),
    ])

    await notifyNewPayment({
      userName: payment.user.name,
      courseTitle: payment.course.titleMn || payment.course.title,
      amount: payment.amount,
      paymentId: payment.id,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('QPAY callback error:', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
