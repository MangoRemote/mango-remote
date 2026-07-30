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
          We&apos;ve sent you an email to set up your password. Once done, sign in and
          you&apos;ll have full access to every job on MangoRemote.
        </p>
        <p className="welcome-sub">
          Can&apos;t see the email? Check your spam folder or{' '}
          <a href="mailto:hello@mangoremote.com">contact us</a>.
        </p>
        <Link href="/auth/login" className="btn-primary welcome-btn">
          Sign in now
        </Link>
      </div>
    </div>
  )
}
