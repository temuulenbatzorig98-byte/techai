interface BankUrl {
  name: string
  link: string
}

async function getBankUrls(id: string): Promise<BankUrl[]> {
  try {
    const res = await fetch(`${process.env.R2_PUBLIC_URL}/qr/drama/${id}.json`, {
      next: { revalidate: 0 },
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function PayPage({ params }: { params: { id: string } }) {
  const urls = await getBankUrls(params.id)
  const qrSrc = `${process.env.R2_PUBLIC_URL}/qr/drama/${params.id}.png`

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-900">
      <div className="w-full max-w-sm text-center">
        <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
          QR кодоор төлөх
        </h2>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={qrSrc} alt="QPay QR код" style={{ maxWidth: 280, margin: '0 auto' }} />

        {urls.length > 0 && (
          <>
            <h2 className="text-lg font-semibold mt-6 mb-3 text-gray-900 dark:text-white">
              Эсвэл банкны апп-аасаа тулд нэвтрэн төлөх
            </h2>
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
          </>
        )}
      </div>
    </main>
  )
}
