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
  const { count: jobCount } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'live')

  return (
    <div className="post-page">
      <div className="post-job-hero">
        <span className="post-job-eyebrow">Post a Job</span>
        <h1>Stop sifting through candidates<br />in the <em>wrong timezone.</em></h1>
        <p>Every visitor here is actively looking for Work from Anywhere or APAC roles. No wasted applications, no timezone mismatches — just people who can actually do the job.</p>
        <div className="post-job-stats">
          <div className="post-job-stat">
            <strong>{jobCount || 0}+</strong>
            <span>Live roles right now</span>
          </div>
          <div className="post-job-stat-divider" />
          <div className="post-job-stat">
            <strong>30 days</strong>
            <span>Your listing stays live</span>
          </div>
          <div className="post-job-stat-divider" />
          <div className="post-job-stat">
            <strong>24 hrs</strong>
            <span>Typical review time</span>
          </div>
        </div>
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

      <div className="post-job-context">
        <div className="post-job-context-inner">
          <h2>Who's on here</h2>
          <p>
            {jobCount || 0}+ roles live right now from companies actually hiring for Asia timezones. Remote workers here aren't browsing LinkedIn for fun—they're specifically looking for roles that fit their timezone and location. No wasted applications.
          </p>
          <p>
            Your job stays visible for 30 days. People bookmark it, come back. It doesn't get buried in 24 hours like other boards. And they apply directly to you—no middleman, no lost emails.
          </p>
        </div>
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
