import Link from 'next/link'

interface Props {
  count: number
  hasSearch?: boolean
}

export default function PremiumGate({ count, hasSearch }: Props) {
  return (
    <div className="premium-gate">
      <div className="premium-gate-inner">
        <div className="premium-gate-lock">🔒</div>
        <div className="premium-gate-text">
          <strong>
            {count} more {count === 1 ? 'job' : 'jobs'}{hasSearch ? ' matching your search' : ''} — Premium only
          </strong>
          <p>Free members see 5 jobs. Upgrade to unlock the full board and apply first.</p>
        </div>
        <Link href="/premium" className="premium-gate-btn">
          Unlock all jobs →
        </Link>
      </div>
    </div>
  )
}
