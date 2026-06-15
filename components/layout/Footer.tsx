import Link from 'next/link'

export function Footer() {
  const platformLinks = [
    { href: '/courses', label: 'Курсууд' },
    { href: '/pricing', label: 'Үнэ' },
    { href: '/about', label: 'Бидний тухай' },
  ]

  const accountLinks = [
    { href: '/login', label: 'Нэвтрэх' },
    { href: '/register', label: 'Бүртгүүлэх' },
    { href: '/dashboard', label: 'Хяналтын самбар' },
  ]

  return (
    <footer className="mt-24 relative">
      {/* Top gradient separator */}
      <div className="gradient-separator" />

      <div className="bg-slate-50 dark:bg-[#0a0e1a] pt-14 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">

            {/* Brand */}
            <div className="sm:col-span-2 md:col-span-1">
              <div className="font-syne text-xl font-bold gradient-text mb-3">Negun AI</div>
              <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed max-w-[220px]">
                Монголын AI боловсролын хамгийн дэвшилтэт платформ. Ирээдүйг өнөөдрөөс эхэл.
              </p>
            </div>

            {/* Platform links */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-gray-500 mb-4">
                Платформ
              </p>
              <div className="space-y-2.5">
                {platformLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="block text-sm text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Account links */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-gray-500 mb-4">
                Данс
              </p>
              <div className="space-y-2.5">
                {accountLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="block text-sm text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-gray-500 mb-4">
                Холбоо барих
              </p>
              <div className="space-y-3">
                <a
                  href="mailto:info@negun.store"
                  className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200 group"
                >
                  <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-50 dark:group-hover:bg-purple-500/10 transition-colors duration-200">
                    <svg className="w-3.5 h-3.5 text-slate-500 dark:text-gray-400 group-hover:text-purple-500 dark:group-hover:text-purple-400" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 4h12v9H2V4z" /><path d="M2 4l6 5 6-5" />
                    </svg>
                  </span>
                  info@negun.store
                </a>
                <a
                  href="https://t.me/autolearn_mn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200 group"
                >
                  <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-50 dark:group-hover:bg-cyan-500/10 transition-colors duration-200">
                    <svg className="w-3.5 h-3.5 text-slate-500 dark:text-gray-400 group-hover:text-cyan-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.504-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  </span>
                  @autolearn_mn
                </a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-slate-200 dark:border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-400 dark:text-gray-500">
              © 2025 Negun AI. Бүх эрх хуулиар хамгаалагдсан.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/tos" className="text-xs text-slate-400 dark:text-gray-500 hover:text-slate-700 dark:hover:text-gray-300 transition-colors">
                Үйлчилгээний нөхцөл
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
