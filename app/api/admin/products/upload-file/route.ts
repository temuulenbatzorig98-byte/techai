import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { r2 } from '@/lib/r2'
import { PutObjectCommand } from '@aws-sdk/client-s3'

export async function POST(req: NextRequest) {
  const session = await getServerSession(req)
  if (!session || session.role !== 'ADMIN')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'Файл олдсонгүй' }, { status: 400 })

    if (file.size > 200 * 1024 * 1024)
      return NextResponse.json({ error: 'Файлын хэмжээ 200MB-аас хэтрэхгүй байх ёстой' }, { status: 400 })

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const key = `products/uploads/${Date.now()}-${safeName}`
    const contentType = file.type || 'application/octet-stream'
    const buffer = Buffer.from(await file.arrayBuffer())

    await r2.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }))

    return NextResponse.json({ key, fileName: file.name })
  } catch (err) {
    console.error('Product file upload error:', err)
    return NextResponse.json({ error: 'Файл байршуулахад алдаа гарлаа' }, { status: 500 })
  }
}
