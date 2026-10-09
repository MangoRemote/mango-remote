import Link from 'next/link'

export const metadata = { title: 'Listing received - MangoRemote' }

export default function PostJobSuccessPage() {
  return (
    <main style={{ maxWidth: 520, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
      <div style={{ fontSize: 28, marginBottom: 12, color: 'var(--accent)' }}>✓</div>
      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 12 }}>Payment received</h1>
      <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 12 }}>
        Your listing is now in our review queue. We check every listing before it goes live, then publish it on MangoRemote for 30 days.
      </p>
      <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 28 }}>
        Questions? Email <a href="mailto:hello@mangoremote.com">hello@mangoremote.com</a>.
      </p>
      <Link href="/jobs" className="btn-primary" style={{ display: 'inline-block', padding: '10px 24px' }}>
        View all jobs
      </Link>
    </main>
  )
}
