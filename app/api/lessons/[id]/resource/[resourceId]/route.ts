import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { getPresignedVideoUrl } from '@/lib/r2'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string; resourceId: string } }
) {
  const session = await getServerSession(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const resource = await prisma.resource.findUnique({
    where: { id: params.resourceId },
    include: { lesson: { include: { section: true } } },
  })
  if (!resource) return NextResponse.json({ error: 'Файл олдсонгүй' }, { status: 404 })

  // Verify the resource belongs to the claimed lesson
  if (resource.lessonId !== params.id) {
    return NextResponse.json({ error: 'Хандах боломжгүй' }, { status: 403 })
  }

  // Check enrollment (admins bypass)
  if (session.role !== 'ADMIN') {
    const enrolled = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.userId,
          courseId: resource.lesson.section.courseId,
        },
      },
    })
    if (!enrolled) return NextResponse.json({ error: 'Курст бүртгэгдээгүй байна' }, { status: 403 })
  }

  const url = await getPresignedVideoUrl(resource.fileKey, 300)
  return NextResponse.redirect(url)
}
