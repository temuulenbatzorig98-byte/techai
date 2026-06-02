import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

export async function getPresignedUploadUrl(key: string, contentType: string, expiresIn = 3600) {
  return getSignedUrl(
    r2,
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn }
  )
}

export async function getPresignedVideoUrl(key: string, expiresIn = 7200) {
  return getSignedUrl(
    r2,
    new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    }),
    { expiresIn }
  )
}

export async function deleteR2Object(key: string) {
  await r2.send(
    new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    })
  )
}

export function generateVideoKey(courseId: string, lessonId: string, filename: string): string {
  const ext = filename.split('.').pop()
  return `courses/${courseId}/lessons/${lessonId}/video.${ext}`
}

export function generateResourceKey(lessonId: string, filename: string): string {
  return `resources/${lessonId}/${Date.now()}-${filename}`
}

export function generateThumbnailKey(filename: string): string {
  const ext = filename.split('.').pop()
  return `thumbnails/${Date.now()}.${ext}`
}
