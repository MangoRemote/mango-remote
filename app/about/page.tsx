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
        <h1>Built by someone who made the move.</h1>
        <p>
          MangoRemote exists because finding remote jobs that actually work from Asia is harder than it should be.
        </p>
      </div>

      <div className="about-body">
        <div className="about-text">
          <p>
            I'm <strong>Sidney George</strong> — a British expat who packed up and moved to Asia a few years ago. Best decision I ever made.
          </p>
          <p>
            But finding remote work that fits life here? That was a grind. Most job boards don't tell you whether a company actually supports async work, whether they care what timezone you're in, or whether "remote" really means "remote from our HQ only."
          </p>
          <p>
            So I built MangoRemote. Every job is hand-picked. Every listing is checked to make sure it genuinely works for someone based in Southeast or East Asia — whether that's Bangkok, Bali, Chiang Mai, Ho Chi Minh City, or anywhere else you've chosen to be.
          </p>
          <p>
            This isn't a scraped job board. It's curated. And it's built by someone living the same life you're trying to live.
          </p>
          <p className="about-sign">
            — Sidney George, Founder
          </p>
        </div>

        <div className="about-facts">
          <div className="about-fact">
            <span className="about-fact-emoji">🥭</span>
            <div>
              <strong>Why "Mango"?</strong>
              <p>Bangkok is never far from a fresh mango smoothie. It felt right.</p>
            </div>
          </div>
          <div className="about-fact">
            <span className="about-fact-emoji">🌏</span>
            <div>
              <strong>Asia-first, always</strong>
              <p>Every role is vetted for timezone compatibility. No surprises.</p>
            </div>
          </div>
          <div className="about-fact">
            <span className="about-fact-emoji">✉️</span>
            <div>
              <strong>Get in touch</strong>
              <p>Want to list a job or just say hi? <a href="mailto:hello@mangoremote.com">hello@mangoremote.com</a></p>
            </div>
          </div>
        </div>
      </div>

      <div className="about-cta">
        <Link href="/" className="btn-primary" style={{ fontSize: 15, padding: '12px 28px' }}>Browse remote jobs →</Link>
        <Link href="/post-a-job" className="btn-ghost" style={{ fontSize: 15, padding: '12px 28px' }}>Post a job</Link>
      </div>
    </main>
  )
}
