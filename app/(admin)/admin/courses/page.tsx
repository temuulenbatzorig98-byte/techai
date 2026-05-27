export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    include: { _count: { select: { enrollments: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-syne text-2xl font-bold text-white">Курс удирдлага</h1>
        <Link href="/admin/courses/new"
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl text-sm font-semibold">
          + Шинэ курс
        </Link>
      </div>

      <div className="space-y-3">
        {courses.map((c) => (
          <div key={c.id} className="bg-[#111827] border border-white/10 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {c.thumbnailUrl && (
                <img src={c.thumbnailUrl} alt={c.titleMn} className="w-16 h-10 object-cover rounded-lg" />
              )}
              <div>
                <p className="text-white font-medium">{c.titleMn || c.title}</p>
                <div className="flex gap-3 mt-1">
                  <span className="text-xs text-gray-400">₮{c.price.toLocaleString()}</span>
                  <span className="text-xs text-gray-400">{c._count.enrollments} оюутан</span>
                  <span className={`text-xs ${c.isPublished ? 'text-green-400' : 'text-amber-400'}`}>
                    {c.isPublished ? '● Нийтлэгдсэн' : '● Нийтлэгдээгүй'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/courses/${c.id}`}
                className="text-xs px-3 py-1.5 border border-white/10 text-gray-300 rounded-lg hover:bg-white/5">
                Засах
              </Link>
            </div>
          </div>
        ))}
        {courses.length === 0 && (
          <div className="text-center py-16 text-gray-500">Курс байхгүй байна</div>
        )}
      </div>
    </div>
  )
}
