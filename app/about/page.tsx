import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About — MangoRemote',
  description: 'MangoRemote is built by Sidney George, a British expat living in Asia.',
}

export default function AboutPage() {
  return (
    <main className="about-page">
      <div className="about-hero">
        <span className="about-eyebrow">Our story</span>
        <h1>I stopped off in Thailand. Never left.</h1>
        <p>
          MangoRemote exists because I spent years looking for something like this and it didn't exist.
        </p>
      </div>

      <div className="about-body">
        <div className="about-text" style={{ maxWidth: 640 }}>
          <p>
            In 2022 I was on my way to Australia. I stopped off in Thailand — I'd been in 2011 and had fond memories. It was supposed to be a quick visit.
          </p>
          <p>
            I binned off Australia.
          </p>
          <p>
            What do most foreigners do when they end up staying in Thailand? They teach. So I became a teacher. The students were great. But it wasn't for me — I knew pretty fast.
          </p>
          <p>
            What I kept noticing was other foreigners living a completely different life. Sitting in nice cafes while I was at work. Going for a morning run. Showing up on islands I'd visit at the weekend. All of them on their laptops, earning money, going wherever they wanted. That's when remote work clicked for me.
          </p>
          <p>
            Since then I've been properly obsessed. The idea that you can earn real money from anywhere in the world — I still find it mental that more people aren't doing it.
          </p>
          <p>
            After a load of remote jobs, online businesses, failures and wins, I built the <strong>Remote Capital Club</strong> — one of the biggest remote work communities on Skool — and <strong>Remote Job Today</strong>, which has helped over 100 people land remote work so far.
          </p>
          <p>
            But there was always something missing. A job board that actually filters for Asia. Not just "remote" — because we all know that usually means remote from their office in London. I mean jobs where you can genuinely be sitting in Bangkok, Chiang Mai, Bali, Ho Chi Minh City, and it's fine.
          </p>
          <p>
            That's MangoRemote. And the name? I will die on this hill — mangoes are the greatest fruit on earth, they're everywhere in Asia, and Asia is the best continent in the world. Simple.
          </p>
          <p>
            Proud to say this is the first dedicated remote job board for people who actually want to live in Asia.
          </p>
          <p className="about-sign">
            — Sidney George, Founder
          </p>

          <div style={{ marginTop: 12, fontSize: 14, color: 'var(--text-muted)' }}>
            Questions? <a href="mailto:hello@mangoremote.com">hello@mangoremote.com</a>
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
