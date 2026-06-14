import type { Metadata } from 'next'
import { Inter, Syne } from 'next/font/google'
import './globals.css'
import { GlobalLoader, LoadingProvider } from '@/components/layout/GlobalLoader'
import { ThemeProvider } from '@/components/layout/ThemeProvider'

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
  other: {
    'facebook-domain-verification': 'eq2i9ahtgzsyldhi29ipc9ue2x8t2v',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn" className={`${inter.variable} ${syne.variable}`} suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <LoadingProvider>
            <GlobalLoader />
            {children}
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
