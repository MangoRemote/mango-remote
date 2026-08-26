import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About — MangoRemote',
  description: 'MangoRemote is the first remote job board built specifically for people who want to live in Asia.',
}

export default function AboutPage() {
  return (
    <main className="about-page">
      <div className="about-hero-image">
        <img src="/about-hero.jpg" alt="Asia skyline" />
        <div className="about-hero-overlay">
          <span className="about-eyebrow">Our story</span>
          <h1>I stopped off in Thailand. Never left.</h1>
          <p>
            MangoRemote exists because I spent years looking for something like this and it didn't exist.
          </p>
        </div>
      </div>

      <div className="about-body">
        <div className="about-text" style={{ maxWidth: 640 }}>
          <p>
            In 2022, on my way to Australia, I stopped off in Asia, which was supposed to be a quick visit. All these years later and I never left.
          </p>
          <p>
            After initially taking up work as a teacher, I kept seeing other foreigners living a completely different life. Sitting in nice cafes in the morning, going for a run midday, maybe even spending time at an island, whereas I'm still slogging it in a suit, just this time in 35 degrees (which I don't recommend). I'd picked up my life in London and started it in Asia, great for the most part, but it still wasn't the full vision of how I thought my life would go.
          </p>
          <p>
            Since then, I've been obsessed. The idea that you can earn money from anywhere in the world from a computer.
          </p>
          <p>
            After many failures and wins, figuring myself out, I built Remote Capital Club — one of the biggest remote work communities on Skool — then Remote Job Today, a dedicated remote site for entry-level to mid-level.
          </p>
          <p>
            But there was always something missing. A job board that actually filters for Asia. Not just "remote" — because we all know that usually means remote from their office in London. I mean jobs where you can genuinely be sitting in Bangkok, Chiang Mai, Bali, Ho Chi Minh City, and it's fine.
          </p>
          <p>
            Welcome to MangoRemote. Why mango? The point of this is so you get a job and you're never more than 5 minutes from a mango smoothie, whether that's on the beach, in your Asian city overlooking the skyline, or working away at a local cafe.
          </p>
          <p>
            This is the first Asia-dedicated remote job board.
          </p>

          <div style={{ marginTop: 12, fontSize: 14, color: 'var(--text-muted)' }}>
            If you spot any issues or have questions, email <a href="mailto:hello@mangoremote.com">hello@mangoremote.com</a>
          </div>
        </div>
      </div>

      <div className="about-cta">
        <Link href="/jobs" className="btn-primary" style={{ fontSize: 15, padding: '12px 28px' }}>Browse remote jobs →</Link>
        <Link href="/post-a-job" className="btn-ghost" style={{ fontSize: 15, padding: '12px 28px' }}>Post a job</Link>
      </div>
    </main>
  )
}
