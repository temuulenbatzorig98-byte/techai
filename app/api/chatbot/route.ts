import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getChatReply } from '@/lib/ai-chat'

const schema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().max(2000),
      })
    )
    .min(1)
    .max(20),
})

export async function POST(req: NextRequest) {
  try {
    const { messages } = schema.parse(await req.json())
    const reply = await getChatReply(messages)
    return NextResponse.json({ reply })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    }
    console.error('Chatbot error:', err)
    return NextResponse.json({ reply: 'Уучлаарай, одоогоор хариулт өгөх боломжгүй байна.' })
  }
}
