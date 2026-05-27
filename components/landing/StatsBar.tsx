export function StatsBar() {
  const stats = [
    { value: '2,500+', label: 'Оюутан' },
    { value: '12', label: 'Курс' },
    { value: '4.9★', label: 'Дундаж үнэлгээ' },
    { value: '95%', label: 'Сэтгэл ханамж' },
  ]

  return (
    <section className="py-8 border-y border-white/10 bg-white/2">
      <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ value, label }) => (
          <div key={label} className="text-center">
            <div className="font-syne text-3xl font-bold gradient-text">{value}</div>
            <div className="text-sm text-gray-400 mt-1">{label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
