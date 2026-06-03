import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { getPresignedVideoUrl } from '@/lib/r2'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const lesson = await prisma.lesson.findUnique({
    where: { id: params.id },
    include: { section: { include: { course: true } } },
  })

  if (!lesson) return NextResponse.json({ error: 'Хичээл олдсонгүй' }, { status: 404 })

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.userId,
        courseId: lesson.section.courseId,
      },
    },
  })
  if (!enrollment && session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Курст бүртгэгдээгүй байна' }, { status: 403 })
  }

  if (!lesson.videoKey) {
    return NextResponse.json({ error: 'Видео олдсонгүй' }, { status: 404 })
  }

  // If videoKey is an external URL (YouTube etc.), return it directly
  if (lesson.videoKey.startsWith('https://') || lesson.videoKey.startsWith('http://')) {
    return NextResponse.json({ url: lesson.videoKey, duration: lesson.duration })
  }

  const url = await getPresignedVideoUrl(lesson.videoKey)
  return NextResponse.json({ url, duration: lesson.duration })
}
