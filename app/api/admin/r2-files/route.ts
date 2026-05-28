import { NextRequest, NextResponse } from 'next/server'
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { getServerSession } from '@/lib/auth'

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

export async function GET(req: NextRequest) {
  const session = await getServerSession(req)
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const prefix = searchParams.get('prefix') ?? ''

  const res = await r2.send(
    new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME,
      Prefix: prefix,
      MaxKeys: 200,
    })
  )

  const files = (res.Contents ?? [])
    .filter((obj) => obj.Key && obj.Size && obj.Size > 0)
    .map((obj) => ({
      key: obj.Key!,
      size: obj.Size!,
      lastModified: obj.LastModified?.toISOString(),
      name: obj.Key!.split('/').pop() ?? obj.Key!,
    }))

  return NextResponse.json({ files })
}
