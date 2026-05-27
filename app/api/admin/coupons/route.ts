import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'

const schema = z.object({
  code: z.string().min(3).max(20),
  discountType: z.enum(['PERCENT', 'FIXED']),
  discountValue: z.number().positive(),
  maxUses: z.number().positive().nullable().optional(),
  validFrom: z.string(),
  validUntil: z.string(),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(req)
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  try {
    const data = schema.parse(await req.json())
    const coupon = await prisma.coupon.create({
      data: {
        code: data.code.toUpperCase(),
        discountType: data.discountType,
        discountValue: data.discountValue,
        maxUses: data.maxUses ?? null,
        validFrom: new Date(data.validFrom),
        validUntil: new Date(data.validUntil),
      },
    })
    return NextResponse.json({ coupon }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Серверийн алдаа' }, { status: 500 })
  }
}
