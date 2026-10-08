import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

const GA_ID = 'G-JPVNWCZHD0'

export const metadata: Metadata = {
  title: 'Remote Jobs in Asia - Timezone Friendly Work from Thailand, Vietnam, Japan',
  description: 'Find remote jobs compatible with living in Asia. Vetted roles for timezone flexibility in Thailand, Vietnam, Japan, Indonesia, Philippines & more. Browse 160+ remote opportunities.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://mangoremote.com'),
  icons: {
    icon: '/favicon.svg',
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
    <html lang="en">
      <head>
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "MangoRemote",
              "url": "https://mangoremote.com",
              "description": "Remote job board for professionals living in Asia",
              "sameAs": ["https://linkedin.com/company/mangoremote"]
            })
          }}
        />
      </head>
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
