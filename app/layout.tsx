import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

const GA_ID = 'G-JPVNWCZHD0'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: 'variable',
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MangoRemote — Remote jobs that let you live in Asia',
  description: 'Find remote jobs compatible with living in Bangkok, Bali, Vietnam and across Asia. Curated remote roles with Asia-friendly timezone tags.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://mangoremote.com'),
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'MangoRemote — Remote jobs that let you live in Asia',
    description: 'Find remote jobs compatible with living in Bangkok, Bali, Vietnam and across Asia.',
    url: 'https://mangoremote.com',
    siteName: 'MangoRemote',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MangoRemote - Remote jobs for living in Asia',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  )
}
