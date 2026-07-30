import Link from 'next/link'

interface Props {
  count: number
}

export default function PremiumGate({ count }: Props) {
  return (
    <div className="premium-gate">
      <div className="premium-gate-inner">
        <div className="premium-gate-lock">🔒</div>
        <div className="premium-gate-text">
          <strong>Unlock {count} more jobs that match your search</strong>
          <p>Premium members see the full board. Upgrade to access every role.</p>
        </div>
        <Link href="/premium" className="premium-gate-btn">
          Unlock all jobs →
        </Link>
      </div>
    </div>
  )
}
