import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { z } from 'zod'

const schema = z.object({
  sectionId: z.string(),
  title: z.string().min(1),
  titleMn: z.string().optional(),
  videoKey: z.string().optional(),
  duration: z.number().int().optional(),
  order: z.number().int(),
  isFree: z.boolean().optional(),
  isPublished: z.boolean().optional(),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(req)
  if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  try {
    const data = schema.parse(await req.json())
    const lesson = await prisma.lesson.create({ data })
    return NextResponse.json({ lesson }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    return NextResponse.json({ error: 'Серверийн алдаа' }, { status: 500 })
  }
}
