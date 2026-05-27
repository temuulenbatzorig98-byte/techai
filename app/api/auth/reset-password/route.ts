import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { generateOTP, sendOTPEmail } from '@/lib/otp'
import { verifyOTP } from '@/lib/otp'

const requestSchema = z.object({ email: z.string().email() })
const resetSchema = z.object({
  userId: z.string(),
  code: z.string().length(6),
  newPassword: z.string().min(8),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (body.newPassword) {
      const data = resetSchema.parse(body)
      const valid = await verifyOTP(data.userId, data.code, 'PASSWORD_RESET')
      if (!valid) return NextResponse.json({ error: 'Буруу эсвэл хугацаа дууссан код' }, { status: 400 })

      const passwordHash = await hash(data.newPassword, 12)
      await prisma.user.update({ where: { id: data.userId }, data: { passwordHash } })
      return NextResponse.json({ message: 'Нууц үг амжилттай шинэчлэгдлээ' })
    }

    const { email } = requestSchema.parse(body)
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return NextResponse.json({ message: 'Хэрэв имэйл бүртгэлтэй бол OTP илгээнэ' })

    const otp = await generateOTP(user.id, 'PASSWORD_RESET')
    await sendOTPEmail(email, otp, user.name)

    return NextResponse.json({ message: 'OTP илгээгдлээ', userId: user.id })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Серверийн алдаа' }, { status: 500 })
  }
}
