'use client'
import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Сайн байна уу! AutoLearn AI-д тавтай морилно уу 👋 Та ямар тусламж хэрэгтэй вэ?' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')

    const next: Message[] = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setLoading(true)

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        body: JSON.stringify({ messages: next }),
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      setMessages([...next, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages([...next, { role: 'assistant', content: 'Уучлаарай, одоогоор хариулт өгөх боломжгүй.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-3 w-80 h-[440px] bg-[#0d1220] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600/20 to-cyan-500/20 border-b border-white/10 p-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-sm">🤖</div>
            <div>
              <p className="text-white text-xs font-semibold">AutoLearn AI</p>
              <p className="text-green-400 text-[10px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse" />Online
              </p>
            </div>
            <button onClick={() => setOpen(false)} className="ml-auto text-gray-400 hover:text-white text-sm">✕</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
            {messages.map((m, i) => (
              <div key={i}
                className={`max-w-[85%] text-xs p-2.5 rounded-xl leading-relaxed ${
                  m.role === 'user'
                    ? 'self-end bg-purple-600/80 text-white rounded-br-sm'
                    : 'self-start bg-white/5 text-gray-300 rounded-bl-sm'
                }`}
                dangerouslySetInnerHTML={{ __html: m.content.replace(/\n/g, '<br/>') }}
              />
            ))}
            {loading && (
              <div className="self-start bg-white/5 rounded-xl rounded-bl-sm p-2.5 flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-white/10 p-2 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Асуулт бичнэ үү..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none placeholder-gray-500 focus:border-purple-500"
            />
            <button onClick={send}
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 text-white text-sm flex items-center justify-center hover:opacity-90">
              ↑
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 shadow-lg shadow-purple-500/30 flex items-center justify-center text-2xl hover:scale-110 transition-transform"
      >
        {open ? '✕' : '🤖'}
      </button>
    </div>
  )
}
