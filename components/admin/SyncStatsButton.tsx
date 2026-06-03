'use client'
import { useState } from 'react'

export function SyncStatsButton() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const handleSync = async () => {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/admin/sync-stats', { method: 'POST' })
      const data = await res.json()
      setResult(`${data.synced} курсын статистик шинэчлэгдлээ`)
    } catch {
      setResult('Алдаа гарлаа')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleSync}
        disabled={loading}
        className="px-4 py-2 text-sm bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-xl hover:bg-purple-600/30 transition disabled:opacity-50"
      >
        {loading ? 'Sync хийж байна...' : '🔄 Статистик sync'}
      </button>
      {result && <span className="text-xs text-slate-500 dark:text-gray-400">{result}</span>}
    </div>
  )
}
