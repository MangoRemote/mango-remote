import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import PostJobForm from '@/components/PostJobForm'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Post a Job — MangoRemote',
  description: 'Hire remote talent that already lives in Asia. $99 for a 30-day listing.',
}

export default async function PostAJobPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="post-page">
      <div className="post-job-hero">
        <span className="post-job-eyebrow">Post a Job</span>
        <h1>Hire remote talent that<br /><em>already lives in Asia.</em></h1>
        <p>Reach thousands of remote professionals actively looking for Work from Anywhere and APAC roles.</p>
      </div>

      <div className="post-job-pricing-card">
        <div className="post-job-price-row">
          <div>
            <div className="post-job-price">$99<span>one-off</span></div>
            <div className="premium-plan-note">Listing goes live after review — usually within 24 hours</div>
          </div>
          <div className="post-job-badge">30 days live</div>
        </div>
        <ul className="post-job-features">
          <li><span className="post-job-check">✓</span> Job live for 30 days</li>
          <li><span className="post-job-check">✓</span> Seen by remote professionals targeting Asia specifically</li>
          <li><span className="post-job-check">✓</span> Listed directly — no aggregator middlemen</li>
          <li><span className="post-job-check">✓</span> Shown to both free and premium members</li>
        </ul>
      </div>

      {user ? (
        <>
          <h2 className="post-job-form-heading">Job details</h2>
          <PostJobForm />
        </>
      ) : (
        <div className="post-job-signin-prompt">
          <h2>Sign in to post a job</h2>
          <p>You&apos;ll need an account so you can manage your listing and see when it goes live.</p>
          <div className="post-job-signin-actions">
            <Link href="/auth/login?next=/post-a-job" className="btn-primary">Sign in</Link>
            <Link href="/auth/signup?next=/post-a-job" className="btn-ghost">Create an account</Link>
          </div>
        </div>
      )}
    </div>
  )
}
