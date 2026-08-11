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
            In 2022, I was on my way to Australia. I stopped off in Thailand — I'd visited back in 2011 and still had fond memories of the place. I wasn't expecting much. Just a stopover.
          </p>
          <p>
            I never made it to Australia.
          </p>
          <p>
            Like most foreigners who end up staying in Thailand, I became a teacher. The students were lovely. But it wasn't my passion — I knew that pretty quickly.
          </p>
          <p>
            What changed everything was noticing other foreigners around me. Sitting in nice cafes. Going for a morning run while I was mid-lesson. Showing up on the islands I'd visit on weekends. All of them working from their laptops. No office. No fixed schedule. Just a life that looked exactly how I wanted mine to look.
          </p>
          <p>
            That's when I discovered remote work. And I've been obsessed ever since.
          </p>
          <p>
            After working numerous remote jobs, building online businesses, plenty of failures and a few wins — I founded the <strong>Remote Capital Club</strong>, one of the largest remote work communities on Skool, and <strong>Remote Job Today</strong>, which has helped over 100 people land remote work and counting.
          </p>
          <p>
            But there was always something missing. A dedicated job board with roles that actually let you work from Asia. Not "remote from our London HQ." Actually anywhere. That's what MangoRemote is.
          </p>
          <p>
            The idea is simple: work somewhere you're never too far from a mango smoothie. I will die on this hill — mangoes are the greatest fruit on earth, and they just feel like Asia. The best continent in the world.
          </p>
          <p>
            I'm proud to say MangoRemote is the first and leading remote job board for people who want to live in Asia.
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
