import Link from 'next/link'

export default function PostJobSuccessPage() {
  return (
    <div style={{ maxWidth: 480, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
      <div style={{ fontSize: 32, marginBottom: 16 }}>✓</div>
      <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800, marginBottom: 10 }}>
        Job submitted for review
      </h1>
      <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 28 }}>
        Your job listing has been submitted and will go live within 24 hours after our review. We&apos;ll email you when it&apos;s published.
      </p>
      <Link href="/jobs" className="btn-primary" style={{ display: 'inline-block', padding: '10px 24px' }}>
        View all jobs
      </Link>
    </div>
  )
}
