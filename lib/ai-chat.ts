import OpenAI from 'openai'

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const SYSTEM_PROMPT = `Та AutoLearn AI платформын найрсаг туслах байна. Та оюутнуудад дараах зүйлсээр тусалдаг:
- Зорилгод нь тохирсон курс зөвлөмж өгөх
- AI автоматжуулалт, chatbot, n8n, Facebook автоматжуулалт талаар асуулт хариулах
- Курс худалдан авалт болон төлбөрийн асуудлаар туслах
- Платформын ерөнхий асуултанд хариулах

Хэрэглэгч монгол хэлээр бичвэл монгол хэлээр, англиар бичвэл англи хэлээр хариулна уу.
Хариултаа товч, тодорхой байлга. Заримдаа emoji ашиглаж болно.

Платформын мэдээлэл:
- AutoLearn AI нь Монголын хамгийн том AI боловсролын платформ
- QPAY-р төлбөр хийнэ
- Курсууд: AI Chatbot Бүтээх, n8n Автоматжуулалт, Facebook Marketing AI, ChatGPT Бизнест
- Үнэ: 49,000₮ - 199,000₮`

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function getChatReply(messages: ChatMessage[]): Promise<string> {
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 1024,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
  })

  return response.choices[0]?.message?.content ?? 'Уучлаарай, хариулт авахад алдаа гарлаа.'
}
