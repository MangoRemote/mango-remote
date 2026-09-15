import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About — MangoRemote',
  description: 'MangoRemote is the first remote job board built specifically for people who want to live in Asia.',
}

export default function AboutPage() {
  return (
    <main className="about-page-clean">
      <div className="about-hero">
        <img src="/about-hero.jpg" alt="Remote work in Asia" />
      </div>

      <div className="about-header">
        <h1>Remote jobs built for <em>Asia</em>.</h1>
        <p>
          MangoRemote is the first job board dedicated to remote work that actually works for people living in Asia.
        </p>
      </div>

      <div className="about-content">
        <section className="about-block">
          <h2>The problem we're solving</h2>
          <p>
            Millions of remote workers live across Asia. Yet most job boards list "remote" roles that aren't actually Asia-friendly. Companies post "remote" positions but expect responses during UK office hours, or the role is tied to a timezone that makes working from Asia logistically impossible.
          </p>
          <p>
            Remote work should mean freedom. The ability to earn a global income while living in the place you love, on your own terms.
          </p>
        </section>

        <section className="about-block">
          <h2>Our approach</h2>
          <p>
            MangoRemote curates remote jobs specifically for people living across Asia. Every listing is vetted for timezone compatibility, location flexibility, and genuine remote-first culture. No surprises. No "remote from our London office" jobs.
          </p>
          <p>
            We focus on quality over quantity. Every job comes from employers who understand what true remote work means.
          </p>
        </section>

        <section className="about-block">
          <h2>Why the name?</h2>
          <p>
            Simple: if you land a genuinely Asia-friendly remote role, you should be able to work from wherever you want across Asia — a cafe in one city, a beach the next week — and never be more than 5 minutes from a mango smoothie. That's the freedom remote work should deliver.
          </p>
          <p>
            This is the Asia-dedicated remote job board.
          </p>
        </section>
      </div>

      <div className="about-cta">
        <Link href="/jobs" className="btn-primary" style={{ fontSize: 15, padding: '12px 28px' }}>
          Browse remote jobs →
        </Link>
        <Link href="/post-a-job" className="btn-ghost" style={{ fontSize: 15, padding: '12px 28px' }}>
          Post a job
        </Link>
      </div>

      <div className="about-footer">
        If you spot any issues or have questions, email <a href="mailto:hello@mangoremote.com">hello@mangoremote.com</a>
      </div>
    </main>
  )
}
