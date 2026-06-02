import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from '@/lib/auth'
import { getPresignedUploadUrl, generateVideoKey, generateResourceKey, generateThumbnailKey } from '@/lib/r2'

const schema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('video'), courseId: z.string(), lessonId: z.string(), filename: z.string(), contentType: z.string() }),
  z.object({ type: z.literal('resource'), courseId: z.string(), lessonId: z.string(), filename: z.string(), contentType: z.string() }),
  z.object({ type: z.literal('thumbnail'), filename: z.string(), contentType: z.string() }),
])

export async function POST(req: NextRequest) {
  const session = await getServerSession(req)
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  try {
    const data = schema.parse(await req.json())
    let key: string
    if (data.type === 'video') {
      key = generateVideoKey(data.courseId, data.lessonId, data.filename)
    } else if (data.type === 'resource') {
      key = generateResourceKey(data.lessonId, data.filename)
    } else {
      key = generateThumbnailKey(data.filename)
    }

    const uploadUrl = await getPresignedUploadUrl(key, data.contentType)
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`

    return NextResponse.json({ uploadUrl, key, publicUrl })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Серверийн алдаа' }, { status: 500 })
  }
}
