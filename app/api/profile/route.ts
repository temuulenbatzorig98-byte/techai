import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { z } from 'zod'

const patchSchema = z.object({
  name: z.string().min(2, 'Нэр хамгийн багадаа 2 тэмдэгт байна').optional(),
  phone: z.string().regex(/^\d{8}$/, 'Утасны дугаар 8 оронтой байна').nullable().optional(),
})

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = patchSchema.parse(await req.json())

    if (body.phone) {
      const existing = await prisma.user.findFirst({
        where: { phone: body.phone, NOT: { id: session.userId } },
      })
      if (existing) return NextResponse.json({ error: 'Энэ утасны дугаар аль хэдийн бүртгэлтэй байна' }, { status: 400 })
    }

    const user = await prisma.user.update({
      where: { id: session.userId },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.phone !== undefined && { phone: body.phone }),
      },
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true, isVerified: true },
    })

    return NextResponse.json({ user })
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    return NextResponse.json({ error: 'Серверийн алдаа' }, { status: 500 })
  }
}
