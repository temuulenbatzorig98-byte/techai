'use client'
import { useState, useEffect } from 'react'

interface QPAYModalProps {
  courseId: string
  courseTitle: string
  amount: number
  onSuccess: () => void
  onClose: () => void
}

type State = 'init' | 'loading' | 'qr' | 'polling' | 'success' | 'error'

export function QPAYModal({ courseId, courseTitle, amount, onSuccess, onClose }: QPAYModalProps) {
  const [state, setState] = useState<State>('init')
  const [qrImage, setQrImage] = useState('')
  const [invoiceId, setInvoiceId] = useState('')
  const [bankUrls, setBankUrls] = useState<{ name: string; link: string }[]>([])
  const [coupon, setCoupon] = useState('')
  const [finalAmount, setFinalAmount] = useState(amount)
  const [timeLeft, setTimeLeft] = useState(1800)
  const [errorMsg, setErrorMsg] = useState('')

  const initPayment = async () => {
    setState('loading')
    try {
      const res = await fetch('/api/payment/qpay/create', {
        method: 'POST',
        body: JSON.stringify({ courseId, couponCode: coupon || undefined }),
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setQrImage(data.qrImage || '')
      setInvoiceId(data.invoiceId)
      setBankUrls(data.urls || [])
      setFinalAmount(data.amount)
      setTimeLeft(1800)
      setState('qr')
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : 'Алдаа гарлаа')
      setState('error')
    }
  }

  useEffect(() => {
    if (state !== 'qr' && state !== 'polling') return
    let stopped = false

    const poll = async () => {
      while (!stopped) {
        await new Promise((r) => setTimeout(r, 3000))
        if (stopped) break
        try {
          const res = await fetch(`/api/payment/qpay/check/${invoiceId}`)
          const data = await res.json()
          if (data.paid) {
            setState('success')
            setTimeout(onSuccess, 2000)
            return
          }
          if (data.status === 'EXPIRED') { setState('error'); setErrorMsg('Төлбөрийн хугацаа дуусгавар болсон'); return }
        } catch {}
      }
    }

    setState('polling')
    poll()
    return () => { stopped = true }
  }, [invoiceId, onSuccess]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (state !== 'qr' && state !== 'polling') return
    const t = setInterval(() => setTimeLeft((p) => (p > 0 ? p - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [state])

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0d1220] border border-white/10 rounded-2xl p-6 w-full max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-syne font-bold text-white">QPay Төлбөр</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl leading-none">✕</button>
        </div>

        {state === 'init' && (
          <>
            <p className="text-sm text-gray-400 mb-1 line-clamp-2">{courseTitle}</p>
            <div className="text-2xl font-bold text-cyan-400 mb-4">₮{finalAmount.toLocaleString()}</div>
            <input
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Купон код (заавал биш)"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white mb-4 outline-none focus:border-purple-500"
            />
            <button onClick={initPayment}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl font-semibold text-sm">
              QR Код үүсгэх →
            </button>
          </>
        )}

        {state === 'loading' && (
          <div className="text-center py-8 text-gray-400">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            QR код бүтээж байна...
          </div>
        )}

        {(state === 'qr' || state === 'polling') && (
          <>
            <div className="bg-white rounded-xl p-4 mb-3 flex items-center justify-center">
              {qrImage ? (
                <img src={`data:image/png;base64,${qrImage}`} alt="QPAY QR" className="w-48 h-48" />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center text-gray-400 text-sm">QR код байхгүй</div>
              )}
            </div>
            <div className="text-center text-xs text-gray-400 mb-2">
              Дуусах хугацаа: <span className="text-amber-400 font-mono">{fmt(timeLeft)}</span>
            </div>
            <div className="text-center text-xs text-gray-400 mb-3">
              Дүн: <span className="text-white font-semibold">₮{finalAmount.toLocaleString()}</span>
            </div>
            {state === 'polling' && (
              <div className="flex items-center justify-center gap-2 text-xs text-cyan-400 mb-3">
                <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
                Төлбөр хүлээж байна...
              </div>
            )}
            {bankUrls.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {bankUrls.slice(0, 4).map((u) => (
                  <a key={u.name} href={u.link}
                    className="text-center py-2 px-3 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300 hover:bg-white/10">
                    {u.name}
                  </a>
                ))}
              </div>
            )}
          </>
        )}

        {state === 'success' && (
          <div className="text-center py-6">
            <div className="text-5xl mb-3">✅</div>
            <p className="text-green-400 font-semibold">Амжилттай төлөлт!</p>
            <p className="text-xs text-gray-400 mt-1">Курс нээлттэй болж байна...</p>
          </div>
        )}

        {state === 'error' && (
          <div className="text-center py-6">
            <div className="text-4xl mb-3">❌</div>
            <p className="text-red-400 text-sm mb-4">{errorMsg || 'Алдаа гарлаа'}</p>
            <button onClick={() => setState('init')}
              className="px-4 py-2 border border-white/10 text-gray-300 rounded-xl text-sm hover:bg-white/5">
              Дахин оролдох
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
