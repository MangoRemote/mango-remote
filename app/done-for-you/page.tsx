import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Done For You — MangoRemote',
  description: 'Let us handle your remote job search. We find the roles, you live in Asia.',
}

export default function DoneForYouPage() {
  return (
    <div className="premium-page" style={{ maxWidth: 620 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
        Done For You
      </div>
      <h1>We find your remote job. You focus on the move.</h1>
      <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 28 }}>
        Already thinking about moving to Bangkok, Bali, or Chiang Mai but stuck on landing a remote job first? We do the heavy lifting — searching, filtering, and shortlisting roles that match your skills and Asia timezone.
      </p>

      <div className="price">£197</div>
      <div className="price-sub">per month</div>

      <ul className="perks-list" style={{ marginTop: 20 }}>
        <li>We search MangoRemote and the wider web for roles that fit you</li>
        <li>Personalised shortlist of 10–15 curated jobs delivered weekly</li>
        <li>Every role checked for Asia-timezone compatibility</li>
        <li>CV and application review included</li>
        <li>Direct WhatsApp access to the MangoRemote team</li>
        <li>Cancel any time — no lock-in</li>
      </ul>

      <form action="/api/checkout/dfy" method="post" style={{ marginTop: 32 }}>
        <button type="submit" className="btn-primary" style={{ padding: '12px 32px', fontSize: 15 }}>
          Get Started — £197/month
        </button>
      </form>

      <p style={{ marginTop: 20, fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.6 }}>
        Secure payment via Stripe. We&apos;ll be in touch within 24 hours of your first payment.
      </p>

      <div style={{ marginTop: 48, borderTop: '1px solid var(--border)', paddingTop: 32 }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 700, marginBottom: 16, letterSpacing: '-0.2px' }}>
          How it works
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {[
            ['1. Tell us about yourself', 'Fill in a short form about your skills, experience level, and which Asian city you\'re planning to move to.'],
            ['2. We search for you', 'Every week we scan 50+ job sources and filter for roles that are genuinely remote-worldwide or Asia-compatible.'],
            ['3. You get a shortlist', 'A curated list of 10–15 roles lands in your inbox each Monday, ready to apply.'],
            ['4. We help you apply', 'Optional CV review and cover letter feedback on any role you want to go for.'],
          ].map(([title, desc]) => (
            <div key={title}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{title}</div>
              <div style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
