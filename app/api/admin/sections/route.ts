import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { z } from 'zod'

const schema = z.object({
  courseId: z.string(),
  title: z.string().min(1),
  order: z.number().int(),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(req)
  if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  try {
    const data = schema.parse(await req.json())
    const section = await prisma.section.create({ data })
    return NextResponse.json({ section }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    return NextResponse.json({ error: 'Серверийн алдаа' }, { status: 500 })
  }
}
