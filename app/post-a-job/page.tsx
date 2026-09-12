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

      <div className="post-job-why">
        <div className="post-job-why-inner">
          <span className="post-job-eyebrow" style={{ color: 'var(--accent)' }}>Why it works</span>
          <h2>You're not competing with 10,000 jobs for timezones that don't fit.</h2>
          <div className="post-job-why-grid">
            <div className="post-job-why-item">
              <div className="post-job-why-num">→</div>
              <strong>No timezone bullshit</strong>
              <p>Most job boards are flooded with "remote" roles that aren't actually timezone-friendly. Everyone here is specifically looking for Asia work. You get applicants who actually fit.</p>
            </div>
            <div className="post-job-why-item">
              <div className="post-job-why-num">→</div>
              <strong>People come back</strong>
              <p>{jobCount || 0}+ roles live, fresh postings daily. Job seekers bookmark it. Your listing stays visible for 30 days, not buried in 24 hours.</p>
            </div>
            <div className="post-job-why-item">
              <div className="post-job-why-num">→</div>
              <strong>Direct pipeline</strong>
              <p>They apply to you, not some third-party platform. No middleman, no lost emails. You own the conversation from hello.</p>
            </div>
          </div>
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
