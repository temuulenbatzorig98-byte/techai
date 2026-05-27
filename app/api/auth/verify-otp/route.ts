import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyOTP } from '@/lib/otp'
import { signToken, setAuthCookie } from '@/lib/auth'

const schema = z.object({
  userId: z.string(),
  code: z.string().length(6),
  type: z.enum(['EMAIL_VERIFY', 'PHONE_VERIFY', 'PASSWORD_RESET']),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    const valid = await verifyOTP(data.userId, data.code, data.type)
    if (!valid) {
      return NextResponse.json({ error: 'Буруу эсвэл хугацаа дууссан код' }, { status: 400 })
    }

    if (data.type === 'EMAIL_VERIFY' || data.type === 'PHONE_VERIFY') {
      await prisma.user.update({
        where: { id: data.userId },
        data: { isVerified: true },
      })

      const user = await prisma.user.findUnique({ where: { id: data.userId } })
      if (!user) return NextResponse.json({ error: 'Хэрэглэгч олдсонгүй' }, { status: 404 })

      const token = await signToken({ userId: user.id, role: user.role, email: user.email ?? undefined })
      const res = NextResponse.json({ message: 'Амжилттай баталгаажлаа' })
      res.cookies.set(setAuthCookie(token))
      return res
    }

    return NextResponse.json({ message: 'OTP баталгаажлаа', verified: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Серверийн алдаа' }, { status: 500 })
  }
}
