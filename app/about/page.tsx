import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About — MangoRemote',
  description: 'MangoRemote is built by Sidney George, a British expat living in Bangkok.',
}

export default function AboutPage() {
  return (
    <div style={{ maxWidth: 580, margin: '0 auto', padding: '48px 24px' }}>
      <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 800, letterSpacing: '-0.4px', marginBottom: 20 }}>
        About MangoRemote
      </h1>

      <div style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--text)', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <p>
          MangoRemote is a remote job board built specifically for people who want to live in Asia.
        </p>
        <p>
          It was built by <strong>Sidney George</strong>, a British expat who has lived in Bangkok for four years. After spending years manually searching job boards for roles that actually work across GMT+7 and GMT+8 timezones, Sidney built the site he wished existed.
        </p>
        <p>
          Every job on MangoRemote is checked for timezone compatibility and tagged with a 🌏 Asia-friendly label when the role genuinely works for someone based in Southeast Asia. No other job board does this.
        </p>
        <p>
          The name? Bangkok is never far from a fresh mango smoothie.
        </p>
      </div>

      <div style={{ marginTop: 36, display: 'flex', gap: 16 }}>
        <a
          href="https://instagram.com/sidneyygeorge"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost"
        >
          Instagram @sidneyygeorge
        </a>
        <a
          href="https://tiktok.com/@sidneyygeorge"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost"
        >
          TikTok @sidneyygeorge
        </a>
      </div>
    </div>
  )
}
