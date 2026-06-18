import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from '@/lib/auth'
import { getPresignedUploadUrl } from '@/lib/r2'

const schema = z.object({
  filename: z.string().min(1),
  contentType: z.string().default('application/octet-stream'),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(req)
  if (!session || session.role !== 'ADMIN')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  try {
    const { filename, contentType } = schema.parse(await req.json())
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_')
    const key = `products/uploads/${Date.now()}-${safeName}`

    const uploadUrl = await getPresignedUploadUrl(key, contentType, 3600)
    return NextResponse.json({ uploadUrl, key })
  } catch (err) {
    if (err instanceof z.ZodError)
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    return NextResponse.json({ error: 'Серверийн алдаа' }, { status: 500 })
  }
}
