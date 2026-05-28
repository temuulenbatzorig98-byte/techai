'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function UnenrollButton({ courseId }: { courseId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleUnenroll = async () => {
    if (!confirm('Энэ курсаас гарах уу? Дахин бүртгүүлэхийн тулд дахин төлбөр төлөх шаардлагатай.')) return
    setLoading(true)
    await fetch(`/api/courses/${courseId}/enroll`, { method: 'DELETE' })
    setLoading(false)
    router.refresh()
  }

  return (
    <button
      onClick={handleUnenroll}
      disabled={loading}
      className="mt-2 w-full py-2 text-xs text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/10 transition disabled:opacity-50"
    >
      {loading ? '...' : 'Курсаас гарах'}
    </button>
  )
}
