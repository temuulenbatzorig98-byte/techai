'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { QPAYModal } from './QPAYModal'

interface Props {
  courseId: string
  courseTitle: string
  amount: number
}

export function QPAYEnrollButton({ courseId, courseTitle, amount }: Props) {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSuccess = () => {
    setShowModal(false)
    router.push('/my-courses')
    router.refresh()
  }

  const handleFreeEnroll = async () => {
    setLoading(true)
    const res = await fetch(`/api/courses/${courseId}/enroll`, { method: 'POST' })
    setLoading(false)
    if (res.ok) {
      router.push('/my-courses')
      router.refresh()
    }
  }

  if (amount === 0) {
    return (
      <button
        onClick={handleFreeEnroll}
        disabled={loading}
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
      >
        {loading ? 'Бүртгэж байна...' : 'Үнэгүй бүртгүүлэх'}
      </button>
    )
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl font-semibold hover:opacity-90 transition"
      >
        Курст бүртгүүлэх — ₮{amount.toLocaleString()}
      </button>
      <p className="text-xs text-slate-400 dark:text-gray-500 text-center mt-2">QPay, банкны апп-аар төлнө</p>

      {showModal && (
        <QPAYModal
          courseId={courseId}
          courseTitle={courseTitle}
          amount={amount}
          onSuccess={handleSuccess}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
