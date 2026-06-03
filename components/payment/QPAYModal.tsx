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

interface CouponResult {
  valid: boolean
  discountedAmount: number
  discountAmount: number
  discountLabel: string
  originalAmount: number
}

export function QPAYModal({ courseId, courseTitle, amount, onSuccess, onClose }: QPAYModalProps) {
  const [state, setState] = useState<State>('init')
  const [qrImage, setQrImage] = useState('')
  const [invoiceId, setInvoiceId] = useState('')
  const [bankUrls, setBankUrls] = useState<{ name: string; link: string }[]>([])
  const [couponCode, setCouponCode] = useState('')
  const [couponResult, setCouponResult] = useState<CouponResult | null>(null)
  const [couponError, setCouponError] = useState('')
  const [couponChecking, setCouponChecking] = useState(false)
  const [finalAmount, setFinalAmount] = useState(amount)
  const [timeLeft, setTimeLeft] = useState(1800)
  const [errorMsg, setErrorMsg] = useState('')

  const effectiveAmount = couponResult ? couponResult.discountedAmount : amount

  const checkCoupon = async () => {
    if (!couponCode.trim()) return
    setCouponChecking(true)
    setCouponError('')
    setCouponResult(null)
    try {
      const res = await fetch('/api/payment/coupon/validate', {
        method: 'POST',
        body: JSON.stringify({ code: couponCode, courseId }),
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (!res.ok) {
        setCouponError(data.error || 'Купон хүчингүй')
      } else {
        setCouponResult(data)
      }
    } catch {
      setCouponError('Шалгахад алдаа гарлаа')
    } finally {
      setCouponChecking(false)
    }
  }

  const removeCoupon = () => {
    setCouponCode('')
    setCouponResult(null)
    setCouponError('')
  }

  const initPayment = async () => {
    setState('loading')
    try {
      const res = await fetch('/api/payment/qpay/create', {
        method: 'POST',
        body: JSON.stringify({ courseId, couponCode: couponResult ? couponCode : undefined }),
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
          if (data.status === 'EXPIRED') {
            setState('error')
            setErrorMsg('Төлбөрийн хугацаа дуусгавар болсон')
            return
          }
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
      <div className="bg-white dark:bg-[#0d1220] border border-slate-200 dark:border-white/10 rounded-2xl p-6 w-full max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-syne font-bold text-slate-900 dark:text-white">QPay Төлбөр</h3>
          <button onClick={onClose} className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white text-xl leading-none">✕</button>
        </div>

        {state === 'init' && (
          <>
            <p className="text-sm text-slate-500 dark:text-gray-400 mb-3 line-clamp-2">{courseTitle}</p>

            {/* Price display */}
            <div className="mb-4">
              {couponResult ? (
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-cyan-400">₮{couponResult.discountedAmount.toLocaleString()}</span>
                  <span className="text-sm text-slate-400 dark:text-gray-500 line-through">₮{amount.toLocaleString()}</span>
                  <span className="text-xs bg-green-600/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">{couponResult.discountLabel}</span>
                </div>
              ) : (
                <span className="text-2xl font-bold text-cyan-400">₮{amount.toLocaleString()}</span>
              )}
            </div>

            {/* Coupon input */}
            {!couponResult ? (
              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    value={couponCode}
                    onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError('') }}
                    onKeyDown={(e) => e.key === 'Enter' && checkCoupon()}
                    placeholder="Купон код (заавал биш)"
                    className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white outline-none focus:border-purple-500"
                  />
                  <button
                    onClick={checkCoupon}
                    disabled={!couponCode.trim() || couponChecking}
                    className="px-3 py-2 text-sm bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-600/30 transition disabled:opacity-40"
                  >
                    {couponChecking ? '...' : 'Шалгах'}
                  </button>
                </div>
                {couponError && (
                  <p className="text-xs text-red-400 mt-1.5">{couponError}</p>
                )}
              </div>
            ) : (
              <div className="mb-4 flex items-center justify-between bg-green-600/10 border border-green-500/20 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="text-green-400 text-sm">✓</span>
                  <code className="text-sm font-bold text-green-400">{couponCode}</code>
                  <span className="text-xs text-slate-500 dark:text-gray-400">купон идэвхжсэн</span>
                </div>
                <button onClick={removeCoupon} className="text-xs text-slate-400 dark:text-gray-500 hover:text-red-400 transition">✕</button>
              </div>
            )}

            <button
              onClick={initPayment}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl font-semibold text-sm"
            >
              QR Код үүсгэх — ₮{effectiveAmount.toLocaleString()}
            </button>
          </>
        )}

        {state === 'loading' && (
          <div className="text-center py-8 text-slate-500 dark:text-gray-400">
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
                <div className="w-48 h-48 flex items-center justify-center text-slate-500 dark:text-gray-400 text-sm">QR код байхгүй</div>
              )}
            </div>
            <div className="text-center text-xs text-slate-500 dark:text-gray-400 mb-2">
              Дуусах хугацаа: <span className="text-amber-400 font-mono">{fmt(timeLeft)}</span>
            </div>
            <div className="text-center text-sm mb-3">
              Төлөх дүн: <span className="text-cyan-400 font-bold">₮{finalAmount.toLocaleString()}</span>
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
                    className="text-center py-2 px-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-xs text-slate-700 dark:text-gray-300 hover:bg-white/10">
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
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">Курс нээлттэй болж байна...</p>
          </div>
        )}

        {state === 'error' && (
          <div className="text-center py-6">
            <div className="text-4xl mb-3">❌</div>
            <p className="text-red-400 text-sm mb-4">{errorMsg || 'Алдаа гарлаа'}</p>
            <button onClick={() => setState('init')}
              className="px-4 py-2 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-300 rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-white/5">
              Дахин оролдох
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
