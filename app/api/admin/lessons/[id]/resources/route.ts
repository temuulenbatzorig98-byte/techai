import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { r2 } from '@/lib/r2'
import { PutObjectCommand } from '@aws-sdk/client-s3'

function getResourceType(mimeType: string): 'PDF' | 'ZIP' | 'IMAGE' | 'OTHER' {
  if (mimeType === 'application/pdf') return 'PDF'
  if (mimeType === 'application/zip' || mimeType === 'application/x-zip-compressed') return 'ZIP'
  if (mimeType.startsWith('image/')) return 'IMAGE'
  return 'OTHER'
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(req)
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  try {
    const lesson = await prisma.lesson.findUnique({ where: { id: params.id } })
    if (!lesson) return NextResponse.json({ error: 'Хичээл олдсонгүй' }, { status: 404 })

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'Файл олдсонгүй' }, { status: 400 })

    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: 'Файлын хэмжээ 50MB-аас хэтрэхгүй байх ёстой' }, { status: 400 })
    }

    const ext = file.name.split('.').pop() ?? 'bin'
    const key = `resources/${params.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
    const buffer = Buffer.from(await file.arrayBuffer())

    await r2.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    }))

    const resource = await prisma.resource.create({
      data: {
        lessonId: params.id,
        name: file.name,
        fileKey: key,
        fileType: getResourceType(file.type),
      },
    })

    return NextResponse.json({ resource }, { status: 201 })
  } catch (err) {
    console.error('Resource upload error:', err)
    return NextResponse.json({ error: 'Файл хадгалахад алдаа гарлаа' }, { status: 500 })
  }
}
