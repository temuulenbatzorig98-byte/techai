import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { z } from 'zod'

const schema = z.object({
  watchedTime: z.number().nonnegative(),
  completed: z.boolean().optional(),
})

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = schema.parse(await req.json())

    const progress = await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId: session.userId, lessonId: params.id } },
      update: {
        watchedTime: data.watchedTime,
        completed: data.completed ?? false,
        lastWatchAt: new Date(),
      },
      create: {
        userId: session.userId,
        lessonId: params.id,
        watchedTime: data.watchedTime,
        completed: data.completed ?? false,
      },
    })

    return NextResponse.json({ progress })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Серверийн алдаа' }, { status: 500 })
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const progress = await prisma.lessonProgress.findUnique({
    where: { userId_lessonId: { userId: session.userId, lessonId: params.id } },
  })

  return NextResponse.json({ progress })
}
