import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0a0e1a] py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="font-syne text-xl font-bold gradient-text mb-3">Negun AI</div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Монголын AI боловсролын хамгийн дэвшилтэт платформ. Ирээдүйг өнөөдрөөс эхэл.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-white mb-4">Платформ</p>
            <div className="space-y-2">
              {[{ href: '/courses', label: 'Курсууд' }, { href: '/pricing', label: 'Үнэ' }, { href: '/about', label: 'Бидний тухай' }].map(({ href, label }) => (
                <Link key={href} href={href} className="block text-sm text-gray-400 hover:text-white transition">{label}</Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-white mb-4">Данс</p>
            <div className="space-y-2">
              {[{ href: '/login', label: 'Нэвтрэх' }, { href: '/register', label: 'Бүртгүүлэх' }, { href: '/dashboard', label: 'Хяналтын самбар' }].map(({ href, label }) => (
                <Link key={href} href={href} className="block text-sm text-gray-400 hover:text-white transition">{label}</Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-white mb-4">Холбоо барих</p>
            <div className="space-y-2 text-sm text-gray-400">
              <p>📧 info@negun.store</p>
              <p>📱 Telegram: @autolearn_mn</p>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 text-center text-xs text-gray-500">
          © 2025 Negun AI. Бүх эрх хуулиар хамгаалагдсан.
        </div>
      </div>
    </footer>
  )
}
