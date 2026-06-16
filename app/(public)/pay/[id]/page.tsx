interface BankUrl {
  name: string
  link: string
  description?: string
  logo?: string
}

async function getPaymentUrls(id: string): Promise<BankUrl[]> {
  try {
    const r2Url = `${process.env.R2_PUBLIC_URL}/qr/drama/${id}.json`
    const res = await fetch(r2Url, { next: { revalidate: 0 } })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function PayPage({ params }: { params: { id: string } }) {
  const urls = await getPaymentUrls(params.id)

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-900">
      <div className="w-full max-w-sm">
        <h1 className="text-xl font-semibold text-center mb-2 text-gray-900 dark:text-white">
          Банкны аппаар төлөх
        </h1>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-6">
          Доорх банкны аппыг сонгоно уу
        </p>

        {urls.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            Холбоос олдсонгүй. QR кодоор төлнө үү.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {urls.map((u) => (
              <a
                key={u.link}
                href={u.link}
                className="block w-full text-center py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium text-base hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {u.name}
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
