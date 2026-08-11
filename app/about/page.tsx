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
            In 2022, I was on my way to Australia. I stopped off in Thailand — I'd visited back in 2011 and had fond memories of the place. I wasn't expecting much. Just a stopover.
          </p>
          <p>
            I never made it to Australia.
          </p>
          <p>
            Like most foreigners who end up staying in Thailand, I became a teacher. The students were lovely. But teaching wasn't my thing — I knew it pretty quickly.
          </p>
          <p>
            What changed everything was noticing other foreigners around me. Sitting in nice cafes. Going for a morning run while I was mid-lesson. Showing up on the islands I'd visit on weekends. All working from their laptops. No office. No fixed location. Just a good internet connection and a life that looked exactly how I wanted mine to look.
          </p>
          <p>
            That's when I discovered remote work. And I've been obsessed ever since.
          </p>
          <p>
            The idea that you can earn a real income from anywhere in the world — that's not a fantasy anymore. It's just a job board away. That's why I built MangoRemote.
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
