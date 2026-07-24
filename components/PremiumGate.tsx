import Link from 'next/link'

interface Props {
  count: number
}

export default function PremiumGate({ count }: Props) {
  return (
    <div className="premium-gate">
      <div className="premium-gate-inner">
        <span style={{ fontSize: 28 }}>🌏</span>
        <h3>{count} more jobs for Premium members</h3>
        <p>Unlock every role, apply early, and get weekly Asia-friendly job alerts straight to your inbox.</p>
        <Link href="/premium" className="btn-primary" style={{ fontSize: 13.5, padding: '10px 24px' }}>
          Go Premium — £9.99/month
        </Link>
      </div>
    </div>
  )
}
