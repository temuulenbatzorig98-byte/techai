'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Product {
  id: string
  title: string
  description: string | null
  price: number
  fileName: string
  thumbnailUrl: string | null
  _count: { purchases: number }
}

type State = 'init' | 'loading' | 'qr' | 'polling' | 'success' | 'error'

export function ProductDetailClient({
  product,
  purchased: initialPurchased,
  isLoggedIn,
}: {
  product: Product
  purchased: boolean
  isLoggedIn: boolean
}) {
  const router = useRouter()
  const [purchased, setPurchased] = useState(initialPurchased)
  const [state, setState] = useState<State>('init')
  const [qrImage, setQrImage] = useState('')
  const [invoiceId, setInvoiceId] = useState('')
  const [bankUrls, setBankUrls] = useState<{ name: string; link: string }[]>([])
  const [timeLeft, setTimeLeft] = useState(1800)
  const [errorMsg, setErrorMsg] = useState('')

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const initPayment = async () => {
    if (!isLoggedIn) { router.push('/login?redirect=' + encodeURIComponent(window.location.pathname)); return }
    setState('loading')
    try {
      const res = await fetch('/api/payment/qpay/create', {
        method: 'POST',
        body: JSON.stringify({ productId: product.id }),
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setQrImage(data.qrImage || '')
      setInvoiceId(data.invoiceId)
      setBankUrls(data.urls || [])
      setTimeLeft(1800)
      setState('qr')
      startPolling(data.invoiceId)
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : 'Алдаа гарлаа')
      setState('error')
    }
  }

  const startPolling = (iid: string) => {
    setState('polling')
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/payment/qpay/check/${iid}`)
        const data = await res.json()
        if (data.paid) {
          clearInterval(interval)
          setState('success')
          setPurchased(true)
        } else if (data.status === 'EXPIRED') {
          clearInterval(interval)
          setState('error')
          setErrorMsg('Төлбөрийн хугацаа дуусгавар болсон')
        }
      } catch {}
    }, 3000)

    const timer = setInterval(() => setTimeLeft((p) => {
      if (p <= 1) { clearInterval(timer); return 0 }
      return p - 1
    }), 1000)
  }

  const handleDownload = () => {
    window.location.href = `/api/products/${product.id}/download`
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Left: image */}
        <div className="aspect-video bg-gradient-to-br from-purple-600/10 to-cyan-500/10 rounded-2xl overflow-hidden flex items-center justify-center">
          {product.thumbnailUrl ? (
            <img src={product.thumbnailUrl} alt={product.title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-7xl">📦</span>
          )}
        </div>

        {/* Right: info + action */}
        <div>
          <h1 className="font-syne text-2xl font-bold text-slate-900 dark:text-white mb-3">{product.title}</h1>
          {product.description && (
            <p className="text-slate-500 dark:text-gray-400 mb-6 leading-relaxed">{product.description}</p>
          )}

          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-cyan-400">₮{product.price.toLocaleString()}</span>
            <span className="text-sm text-slate-400 dark:text-gray-500">{product._count.purchases} худалдаа</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400 mb-8">
            <span>📄</span>
            <span>{product.fileName}</span>
          </div>

          {purchased || state === 'success' ? (
            <button onClick={handleDownload}
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2">
              ⬇ Татаж авах
            </button>
          ) : state === 'init' || state === 'error' ? (
            <>
              {state === 'error' && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">{errorMsg}</div>
              )}
              <button onClick={initPayment}
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl font-semibold">
                QPay-р худалдаж авах
              </button>
            </>
          ) : state === 'loading' ? (
            <div className="text-center py-6 text-slate-500 dark:text-gray-400">
              <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              QR код бүтээж байна...
            </div>
          ) : (state === 'qr' || state === 'polling') ? (
            <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-2xl p-5">
              <div className="bg-white rounded-xl p-3 mb-3 flex items-center justify-center">
                {qrImage
                  ? <img src={`data:image/png;base64,${qrImage}`} alt="QR" className="w-44 h-44" />
                  : <div className="w-44 h-44 flex items-center justify-center text-slate-500 dark:text-gray-400 text-sm">QR байхгүй</div>
                }
              </div>
              <div className="text-center text-xs text-slate-500 dark:text-gray-400 mb-1">
                Дуусах: <span className="text-amber-400 font-mono">{fmt(timeLeft)}</span>
              </div>
              <div className="text-center text-sm mb-3">
                Төлөх: <span className="text-cyan-400 font-bold">₮{product.price.toLocaleString()}</span>
              </div>
              {state === 'polling' && (
                <div className="flex items-center justify-center gap-2 text-xs text-cyan-400 mb-3">
                  <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
                  Төлбөр хүлээж байна...
                </div>
              )}
              {bankUrls.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {bankUrls.slice(0, 4).map((u) => (
                    <a key={u.name} href={u.link}
                      className="text-center py-2 px-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-xs text-slate-700 dark:text-gray-300 hover:bg-white/10">
                      {u.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
