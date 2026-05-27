import { prisma } from './prisma'
import { OTPType } from '@prisma/client'

export async function generateOTP(userId: string, type: OTPType): Promise<string> {
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 min

  await prisma.oTPCode.create({
    data: { userId, code, type, expiresAt }
  })

  return code
}

export async function verifyOTP(userId: string, code: string, type: OTPType): Promise<boolean> {
  const otp = await prisma.oTPCode.findFirst({
    where: {
      userId,
      code,
      type,
      used: false,
      expiresAt: { gt: new Date() },
    },
  })

  if (!otp) return false

  await prisma.oTPCode.update({
    where: { id: otp.id },
    data: { used: true },
  })

  return true
}

export async function sendOTPEmail(email: string, code: string, name: string) {
  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)

  const result = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: email,
    subject: `AutoLearn AI - Баталгаажуулах код: ${code}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; background: #0d1220; color: #fff; padding: 32px; border-radius: 16px;">
        <h2 style="color: #06b6d4;">Сайн байна уу, ${name}!</h2>
        <p style="color: #9ca3af;">Таны баталгаажуулах код:</p>
        <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #7c3aed; margin: 24px 0; text-align: center;">
          ${code}
        </div>
        <p style="color: #6b7280; font-size: 13px;">Код 10 минутын дотор хүчинтэй.</p>
        <p style="color: #4b5563; font-size: 12px;">Хэрэв та бүртгэл үүсгээгүй бол энэ имэйлийг үл тоомсорлоно уу.</p>
      </div>
    `,
  })
  console.log('[Resend]', JSON.stringify(result))
}
