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

  const handleSuccess = () => {
    setShowModal(false)
    router.push('/my-courses')
    router.refresh()
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl font-semibold hover:opacity-90 transition"
      >
        Курст бүртгүүлэх — ₮{amount.toLocaleString()}
      </button>
      <p className="text-xs text-gray-500 text-center mt-2">QPay, банкны апп-аар төлнө</p>

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
