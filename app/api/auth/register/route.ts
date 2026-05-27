import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { generateOTP, sendOTPEmail } from '@/lib/otp'
import { notifyNewUser } from '@/lib/telegram'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().min(8).optional(),
  password: z.string().min(8),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    if (!data.email && !data.phone) {
      return NextResponse.json({ error: 'Имэйл эсвэл утасны дугаар шаардлагатай' }, { status: 400 })
    }

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email: data.email }, { phone: data.phone }] },
    })
    if (existing) {
      return NextResponse.json({ error: 'Хэрэглэгч бүртгэлтэй байна' }, { status: 409 })
    }

    const passwordHash = await hash(data.password, 12)
    const user = await prisma.user.create({
      data: {
        email: data.email,
        phone: data.phone,
        name: data.name,
        passwordHash,
      },
    })

    const otp = await generateOTP(user.id, data.email ? 'EMAIL_VERIFY' : 'PHONE_VERIFY')

    if (data.email) {
      await sendOTPEmail(data.email, otp, data.name)
    }

    await notifyNewUser({ name: data.name, email: data.email, phone: data.phone })

    return NextResponse.json({ message: 'OTP илгээгдлээ', userId: user.id }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    }
    console.error(err)
    return NextResponse.json({ error: 'Серверийн алдаа' }, { status: 500 })
  }
}
