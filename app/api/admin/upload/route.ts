import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from '@/lib/auth'
import { getPresignedUploadUrl, generateVideoKey, generateResourceKey } from '@/lib/r2'

const schema = z.object({
  type: z.enum(['video', 'resource']),
  courseId: z.string(),
  lessonId: z.string(),
  filename: z.string(),
  contentType: z.string(),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(req)
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  try {
    const data = schema.parse(await req.json())
    const key =
      data.type === 'video'
        ? generateVideoKey(data.courseId, data.lessonId, data.filename)
        : generateResourceKey(data.lessonId, data.filename)

    const uploadUrl = await getPresignedUploadUrl(key, data.contentType)

    return NextResponse.json({ uploadUrl, key })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Серверийн алдаа' }, { status: 500 })
  }
}
