import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { randomRating, randomStudents } from '@/lib/course-stats'
import { z } from 'zod'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const level = searchParams.get('level')
  const featured = searchParams.get('featured') === 'true'

  const courses = await prisma.course.findMany({
    where: {
      isPublished: true,
      ...(category && { category }),
      ...(level && { level: level as never }),
      ...(featured && { isFeatured: true }),
    },
    select: {
      id: true,
      slug: true,
      title: true,
      titleMn: true,
      thumbnailUrl: true,
      price: true,
      originalPrice: true,
      level: true,
      category: true,
      rating: true,
      totalStudents: true,
      totalLessons: true,
      totalDuration: true,
      isFeatured: true,
    },
    orderBy: [{ isFeatured: 'desc' }, { totalStudents: 'desc' }],
  })

  return NextResponse.json({ courses })
}

const createSchema = z.object({
  title: z.string().min(3),
  titleMn: z.string().min(3),
  description: z.string().min(10),
  descriptionMn: z.string().min(10),
  price: z.number().min(0),
  originalPrice: z.number().optional(),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  category: z.string(),
  slug: z.string().min(3),
  thumbnailUrl: z.string().url().optional(),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(req)
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  try {
    const data = createSchema.parse(await req.json())
    const course = await prisma.course.create({
      data: { ...data, rating: randomRating(), totalStudents: randomStudents() },
    })
    return NextResponse.json({ course }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Серверийн алдаа' }, { status: 500 })
  }
}
