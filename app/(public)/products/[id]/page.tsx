import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ProductDetailClient } from './ProductDetailClient'

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id, isPublished: true },
    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      fileName: true,
      thumbnailUrl: true,
      _count: { select: { purchases: true } },
    },
  })
  if (!product) notFound()

  const token = cookies().get('auth_token')?.value
  const session = token ? await verifyToken(token) : null

  let purchased = false
  if (session) {
    if (session.role === 'ADMIN') {
      purchased = true
    } else {
      const purchase = await prisma.productPurchase.findUnique({
        where: { userId_productId: { userId: session.userId, productId: params.id } },
      })
      purchased = !!purchase
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen hero-bg pt-24 pb-16">
        <div className="section-container">
          <ProductDetailClient product={product} purchased={purchased} isLoggedIn={!!session} />
        </div>
      </main>
      <Footer />
    </>
  )
}
