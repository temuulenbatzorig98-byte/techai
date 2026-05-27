import Link from 'next/link'

const FEATURED_COURSES = [
  {
    id: '1',
    titleMn: 'AI Chatbot Бүтээх',
    description: 'Claude API ашиглан хөгжлийн бизнес chatbot бүтээнэ',
    price: 79000,
    originalPrice: 120000,
    category: 'AI Chatbot',
    level: 'BEGINNER',
    totalStudents: 842,
    totalLessons: 24,
    gradient: 'from-purple-600 to-blue-600',
    icon: '🤖',
  },
  {
    id: '2',
    titleMn: 'n8n Workflow Автоматжуулалт',
    description: 'n8n ашиглан бизнесийн процессыг бүрэн автоматжуул',
    price: 99000,
    originalPrice: 150000,
    category: 'Автоматжуулалт',
    level: 'INTERMEDIATE',
    totalStudents: 631,
    totalLessons: 32,
    gradient: 'from-cyan-600 to-teal-600',
    icon: '⚡',
  },
  {
    id: '3',
    titleMn: 'Facebook Marketing AI',
    description: 'AI ашиглан Facebook зар, агуулга автоматжуул',
    price: 69000,
    originalPrice: 100000,
    category: 'Marketing',
    level: 'BEGINNER',
    totalStudents: 1204,
    totalLessons: 18,
    gradient: 'from-pink-600 to-rose-600',
    icon: '📱',
  },
]

export function CourseGrid() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-syne text-3xl lg:text-4xl font-bold text-white mb-4">
            Онцлох <span className="gradient-text">Курсууд</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Монголын ажилчдад зориулсан практик AI мэдлэг
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {FEATURED_COURSES.map((c) => (
            <div key={c.id} className="group bg-[#111827] border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/40 transition card-glow">
              <div className={`h-36 bg-gradient-to-br ${c.gradient} flex items-center justify-center`}>
                <span className="text-5xl animate-float">{c.icon}</span>
              </div>
              <div className="p-5">
                <div className="flex gap-2 mb-3">
                  <span className="text-xs bg-white/5 text-gray-400 border border-white/10 px-2 py-0.5 rounded-full">
                    {c.category}
                  </span>
                  <span className="text-xs bg-white/5 text-gray-400 border border-white/10 px-2 py-0.5 rounded-full">
                    {c.level === 'BEGINNER' ? 'Анхан' : 'Дунд'}
                  </span>
                </div>
                <h3 className="font-syne font-bold text-white text-lg mb-2">{c.titleMn}</h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{c.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <span>👥 {c.totalStudents.toLocaleString()}</span>
                  <span>📚 {c.totalLessons} хичээл</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-cyan-400">₮{c.price.toLocaleString()}</span>
                    <span className="text-sm text-gray-500 line-through">₮{c.originalPrice.toLocaleString()}</span>
                  </div>
                  <Link href="/courses"
                    className="text-sm px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl font-medium hover:opacity-90 transition">
                    Үзэх
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 border border-white/10 text-gray-300 rounded-xl hover:bg-white/5 transition">
            Бүх курсийг үзэх →
          </Link>
        </div>
      </div>
    </section>
  )
}
