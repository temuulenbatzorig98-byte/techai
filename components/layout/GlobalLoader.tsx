'use client'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

export function GlobalLoader() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const prevPath = useRef(pathname)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Detect navigation: show on link click, hide when pathname changes
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest('a')
      if (!link || !link.href || link.target || e.ctrlKey || e.metaKey || e.shiftKey) return
      try {
        const url = new URL(link.href)
        if (url.origin !== window.location.origin) return
        if (url.pathname === window.location.pathname) return
        setVisible(true)
      } catch {}
    }

    // Also capture button submits inside forms
    const handleSubmit = () => setVisible(true)

    document.addEventListener('click', handleClick, true)
    return () => {
      document.removeEventListener('click', handleClick, true)
    }
  }, [])

  // Hide when navigation finishes (pathname changed)
  useEffect(() => {
    if (prevPath.current !== pathname) {
      prevPath.current = pathname
      if (hideTimer.current) clearTimeout(hideTimer.current)
      // Small delay so the overlay doesn't flicker out instantly
      hideTimer.current = setTimeout(() => setVisible(false), 300)
    }
  }, [pathname])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', backgroundColor: 'rgba(10,14,28,0.65)' }}>
      {/* Spinner */}
      <div className="relative w-14 h-14 mb-5">
        <div className="absolute inset-0 rounded-full border-2 border-white/10" />
        <div className="absolute inset-0 rounded-full border-2 border-t-purple-500 border-r-cyan-500 border-b-transparent border-l-transparent animate-spin" />
        <div className="absolute inset-2 rounded-full border-2 border-t-transparent border-r-transparent border-b-purple-400 border-l-cyan-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
      </div>
      <p className="text-white text-base font-medium tracking-wide">Уншиж байна</p>
      <p className="text-gray-400 text-sm mt-1">Түр хүлээнэ үү...</p>
    </div>
  )
}

// Hook for manual control (API calls, form submissions)
import { createContext, useContext, useCallback, ReactNode } from 'react'

const Ctx = createContext<{ show: () => void; hide: () => void }>({ show: () => {}, hide: () => {} })

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false)
  const show = useCallback(() => setActive(true), [])
  const hide = useCallback(() => setActive(false), [])

  return (
    <Ctx.Provider value={{ show, hide }}>
      {children}
      {active && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', backgroundColor: 'rgba(10,14,28,0.65)' }}>
          <div className="relative w-14 h-14 mb-5">
            <div className="absolute inset-0 rounded-full border-2 border-white/10" />
            <div className="absolute inset-0 rounded-full border-2 border-t-purple-500 border-r-cyan-500 border-b-transparent border-l-transparent animate-spin" />
            <div className="absolute inset-2 rounded-full border-2 border-t-transparent border-r-transparent border-b-purple-400 border-l-cyan-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
          </div>
          <p className="text-white text-base font-medium tracking-wide">Уншиж байна</p>
          <p className="text-gray-400 text-sm mt-1">Түр хүлээнэ үү...</p>
        </div>
      )}
    </Ctx.Provider>
  )
}

export function useLoading() {
  return useContext(Ctx)
}
