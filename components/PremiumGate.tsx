import Link from 'next/link'

interface Props {
  count: number
}

export default function PremiumGate({ count }: Props) {
  return (
    <div className="premium-gate">
      <div className="premium-gate-line" />
      <div className="premium-gate-text">
        — {count} more roles for Premium members —<br />
        <Link href="/premium" className="btn-primary" style={{ marginTop: 8, display: 'inline-block', fontSize: 12.5 }}>
          Unlock for £9.99/month
        </Link>
      </div>
      <div className="premium-gate-line" />
    </div>
  )
}
