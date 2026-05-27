import { NextRequest, NextResponse } from 'next/server'
import { compare } from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { signToken, setAuthCookie } from '@/lib/auth'

const schema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  password: z.string().min(1),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    const user = await prisma.user.findFirst({
      where: { OR: [{ email: data.email }, { phone: data.phone }] },
    })

    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: 'Нэвтрэх мэдээлэл буруу байна' }, { status: 401 })
    }

    const valid = await compare(data.password, user.passwordHash)
    if (!valid) {
      return NextResponse.json({ error: 'Нэвтрэх мэдээлэл буруу байна' }, { status: 401 })
    }

    if (!user.isVerified) {
      return NextResponse.json(
        { error: 'Имэйл баталгаажуулаагүй байна', userId: user.id, needsVerify: true },
        { status: 403 }
      )
    }

    const token = await signToken({ userId: user.id, role: user.role, email: user.email ?? undefined })

    const res = NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl },
    })

    const cookie = setAuthCookie(token)
    res.cookies.set(cookie)

    return res
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Серверийн алдаа' }, { status: 500 })
  }
}
