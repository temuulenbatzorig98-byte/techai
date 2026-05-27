import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkQPAYPayment } from '@/lib/qpay'
import { getServerSession } from '@/lib/auth'
import { notifyNewPayment } from '@/lib/telegram'

export async function GET(req: NextRequest, { params }: { params: { invoiceId: string } }) {
  const session = await getServerSession(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const payment = await prisma.payment.findUnique({
    where: { qpayInvoiceId: params.invoiceId },
    include: { user: true, course: true },
  })

  if (!payment) return NextResponse.json({ error: 'Төлбөр олдсонгүй' }, { status: 404 })
  if (payment.userId !== session.userId && session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  if (payment.status === 'PAID') {
    return NextResponse.json({ paid: true, status: 'PAID' })
  }

  if (payment.expiresAt && payment.expiresAt < new Date()) {
    await prisma.payment.update({ where: { id: payment.id }, data: { status: 'EXPIRED' } })
    return NextResponse.json({ paid: false, status: 'EXPIRED' })
  }

  try {
    const qpayResult = await checkQPAYPayment(params.invoiceId)

    if (qpayResult.payment_status === 'PAID' || qpayResult.count > 0) {
      const existing = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: payment.userId, courseId: payment.courseId } },
      })

      if (!existing) {
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
      }

      return NextResponse.json({ paid: true, status: 'PAID' })
    }
  } catch (err) {
    console.error('QPAY check error:', err)
  }

  return NextResponse.json({ paid: false, status: payment.status })
}
