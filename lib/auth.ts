import { SignJWT, jwtVerify } from 'jose'
import { NextRequest } from 'next/server'
import { prisma } from './prisma'

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

export interface JWTPayload {
  userId: string
  role: string
  email?: string
}

export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret)
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as unknown as JWTPayload
  } catch {
    return null
  }
}

export async function getServerSession(req: NextRequest): Promise<JWTPayload | null> {
  const token =
    req.cookies.get('auth_token')?.value ??
    req.headers.get('authorization')?.replace('Bearer ', '')

  if (!token) return null
  return verifyToken(token)
}

export function setAuthCookie(token: string) {
  return {
    name: 'auth_token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
  }
}
