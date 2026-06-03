import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { r2, generateThumbnailKey } from '@/lib/r2'
import { PutObjectCommand } from '@aws-sdk/client-s3'

export async function POST(req: NextRequest) {
  const session = await getServerSession(req)
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'Файл олдсонгүй' }, { status: 400 })

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Зөвхөн JPG, PNG, WebP формат зөвшөөрнө' }, { status: 400 })
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Файлын хэмжээ 5MB-аас хэтрэхгүй байх ёстой' }, { status: 400 })
    }

    const key = generateThumbnailKey(file.name)
    const buffer = Buffer.from(await file.arrayBuffer())

    await r2.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    }))

    const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`
    return NextResponse.json({ publicUrl, key })
  } catch (err) {
    console.error('Thumbnail upload error:', err)
    return NextResponse.json({ error: 'Зураг хадгалахад алдаа гарлаа' }, { status: 500 })
  }
}
