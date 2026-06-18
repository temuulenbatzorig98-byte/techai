import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { generateOTP, sendOTPEmail } from '@/lib/otp'

const schema = z.object({
  userId: z.string(),
})

export async function POST(req: NextRequest) {
  try {
    const { userId } = schema.parse(await req.json())

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, isVerified: true },
    })

    if (!user) return NextResponse.json({ error: 'Хэрэглэгч олдсонгүй' }, { status: 404 })
    if (user.isVerified) return NextResponse.json({ error: 'Аль хэдийн баталгаажсан байна' }, { status: 400 })
    if (!user.email) return NextResponse.json({ error: 'Имэйл хаяг байхгүй' }, { status: 400 })

    // Rate limit: check if an OTP was sent in the last 60 seconds
    const recent = await prisma.oTPCode.findFirst({
      where: {
        userId,
        type: 'EMAIL_VERIFY',
        createdAt: { gte: new Date(Date.now() - 60 * 1000) },
      },
    })
    if (recent) return NextResponse.json({ error: '60 секунд хүлээгээд дахин илгээнэ үү' }, { status: 429 })

    const otp = await generateOTP(userId, 'EMAIL_VERIFY')
    await sendOTPEmail(user.email, otp, user.name)

    return NextResponse.json({ message: 'Код дахин илгээгдлээ' })
  } catch (err) {
    if (err instanceof z.ZodError)
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    console.error('resend-otp error:', err)
    return NextResponse.json({ error: 'Серверийн алдаа' }, { status: 500 })
  }
}
