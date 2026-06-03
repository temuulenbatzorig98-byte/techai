import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { syncCourseStats } from '@/lib/course-stats'

export async function POST(req: NextRequest) {
  const session = await getServerSession(req)
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const courses = await prisma.course.findMany({ select: { id: true } })
  await Promise.all(courses.map((c) => syncCourseStats(c.id)))

  return NextResponse.json({ synced: courses.length })
}
