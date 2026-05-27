import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await getServerSession(req)
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const [totalUsers, totalCourses, totalEnrollments, revenueResult, recentPayments] =
    await Promise.all([
      prisma.user.count(),
      prisma.course.count({ where: { isPublished: true } }),
      prisma.enrollment.count(),
      prisma.payment.aggregate({
        where: { status: 'PAID' },
        _sum: { amount: true },
      }),
      prisma.payment.findMany({
        where: { status: 'PAID' },
        include: { user: { select: { name: true } }, course: { select: { titleMn: true } } },
        orderBy: { paidAt: 'desc' },
        take: 10,
      }),
    ])

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthlyRevenue = await prisma.payment.aggregate({
    where: { status: 'PAID', paidAt: { gte: monthStart } },
    _sum: { amount: true },
  })

  return NextResponse.json({
    totalUsers,
    totalCourses,
    totalEnrollments,
    totalRevenue: revenueResult._sum.amount || 0,
    monthlyRevenue: monthlyRevenue._sum.amount || 0,
    recentPayments,
  })
}
