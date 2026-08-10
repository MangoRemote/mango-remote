import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '24px',
    }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🥭</div>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Page not found</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 32, maxWidth: 360 }}>
        This page doesn&apos;t exist or the job may have been removed.
      </p>
      <Link href="/jobs" style={{
        background: 'var(--accent)',
        color: '#fff',
        padding: '12px 24px',
        borderRadius: 8,
        fontWeight: 600,
        textDecoration: 'none',
        fontSize: 15,
      }}>
        Browse all jobs →
      </Link>
    </div>
  )
}
