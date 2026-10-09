import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Welcome to Premium — MangoRemote',
}

export default function WelcomePage() {
  return (
    <div className="welcome-page">
      <div className="welcome-card">
        <div className="welcome-icon">✓</div>
        <h1>You&apos;re in.</h1>
        <p>
          Your Premium access is active on the account linked to your payment. Sign in to see
          every premium job on MangoRemote.
        </p>
        <p className="welcome-sub">
          New to MangoRemote? We&apos;ve emailed you a link to set your password. Check your
          spam folder, or <a href="mailto:hello@mangoremote.com">contact us</a> if you can&apos;t find it.
        </p>
        <Link href="/auth/login" className="btn-primary welcome-btn">
          Sign in now
        </Link>
      </div>
    </div>
  )
}
