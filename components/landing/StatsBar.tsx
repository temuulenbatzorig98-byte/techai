export function StatsBar() {
  const stats = [
    { value: '2,500+', label: 'Оюутан', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    )},
    { value: '12', label: 'Курс', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    )},
    { value: '4.9★', label: 'Дундаж үнэлгээ', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    )},
    { value: '95%', label: 'Сэтгэл ханамж', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
  ]

  return (
    <section className="py-10 relative">
      <div className="gradient-separator absolute top-0 left-0 right-0" />
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0">
          {stats.map(({ value, label, icon }, index) => (
            <div key={label} className="relative text-center group">
              {/* Vertical divider between items on desktop */}
              {index > 0 && (
                <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 h-10 w-px bg-slate-200 dark:bg-white/10" />
              )}
              <div className="flex justify-center mb-2">
                <div className="text-purple-500 dark:text-purple-400 opacity-70 group-hover:opacity-100 transition-opacity duration-200">
                  {icon}
                </div>
              </div>
              <div className="font-syne text-3xl lg:text-4xl font-bold gradient-text leading-tight">{value}</div>
              <div className="text-sm text-slate-500 dark:text-gray-400 mt-1 font-medium">{label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="gradient-separator absolute bottom-0 left-0 right-0" />
    </section>
  )
}
