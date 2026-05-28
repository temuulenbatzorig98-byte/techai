import type { Metadata } from 'next'
import { Inter, Syne } from 'next/font/google'
import './globals.css'
import { GlobalLoader } from '@/components/layout/GlobalLoader'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const syne = Syne({ subsets: ['latin'], variable: '--font-syne' })

export const metadata: Metadata = {
  title: 'Negun AI - Монголын AI Боловсролын Платформ',
  description:
    'AI автоматжуулалт, chatbot бүтээх, n8n workflow, Facebook marketing автоматжуулах курсуудыг судал. Монголын хамгийн дэвшилтэт онлайн сургалтын платформ.',
  keywords: 'AI, автоматжуулалт, chatbot, n8n, онлайн сургалт, Монгол',
  openGraph: {
    title: 'Negun AI',
    description: 'Монголын AI боловсролын платформ',
    url: 'https://negun.store',
    siteName: 'Negun AI',
    locale: 'mn_MN',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn" className={`${inter.variable} ${syne.variable}`}>
      <body className={inter.className}>
        <GlobalLoader />
        {children}
      </body>
    </html>
  )
}
