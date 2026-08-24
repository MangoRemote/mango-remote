import type { Metadata } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

const syne = Syne({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MangoRemote — Remote jobs that let you live in Asia',
  description: 'Find remote jobs compatible with living in Bangkok, Bali, Vietnam and across Asia. Curated remote roles with Asia-friendly timezone tags.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://mangoremote.com'),
  openGraph: {
    title: 'MangoRemote — Remote jobs that let you live in Asia',
    description: 'Find remote jobs compatible with living in Bangkok, Bali, Vietnam and across Asia.',
    url: 'https://mangoremote.com',
    siteName: 'MangoRemote',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  )
}
