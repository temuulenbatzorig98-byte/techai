import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { syncCourseStats } from '@/lib/course-stats'
import { z } from 'zod'

async function requireAdmin(req: NextRequest) {
  const session = await getServerSession(req)
  if (!session || session.role !== 'ADMIN') return null
  return session
}

const patchSchema = z.object({
  title: z.string().min(1).optional(),
  titleMn: z.string().optional(),
  videoKey: z.string().optional(),
  duration: z.number().int().optional(),
  order: z.number().int().optional(),
  isFree: z.boolean().optional(),
  isPublished: z.boolean().optional(),
})

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  try {
    const data = patchSchema.parse(await req.json())
    const lesson = await prisma.lesson.update({ where: { id: params.id }, data })

    const section = await prisma.section.findUnique({ where: { id: lesson.sectionId } })
    if (section) await syncCourseStats(section.courseId)

    return NextResponse.json({ lesson })
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    return NextResponse.json({ error: 'Серверийн алдаа' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const lesson = await prisma.lesson.findUnique({ where: { id: params.id } })
  await prisma.lesson.delete({ where: { id: params.id } })

  if (lesson) {
    const section = await prisma.section.findUnique({ where: { id: lesson.sectionId } })
    if (section) await syncCourseStats(section.courseId)
  }

  return NextResponse.json({ ok: true })
}
