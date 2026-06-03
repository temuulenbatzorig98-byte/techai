export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import { CouponManager } from '@/components/admin/CouponManager'

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    include: { _count: { select: { payments: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="font-syne text-2xl font-bold text-slate-900 dark:text-white mb-8">Купон удирдлага</h1>
      <CouponManager coupons={coupons} />
    </div>
  )
}
