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
          <span className="post-job-eyebrow" style={{ color: 'var(--accent)' }}>Why post here</span>
          <h2>Generic job boards waste your time.<br />This one doesn&apos;t.</h2>
          <div className="post-job-why-grid">
            <div className="post-job-why-item">
              <div className="post-job-why-num">01</div>
              <strong>Zero timezone-mismatch applicants</strong>
              <p>On a generic board, most applicants can&apos;t actually work your hours. Here, every single visitor came looking for Work from Anywhere or APAC roles specifically — that&apos;s the entire premise of the site.</p>
            </div>
            <div className="post-job-why-item">
              <div className="post-job-why-num">02</div>
              <strong>A growing, engaged audience</strong>
              <p>{jobCount || 0}+ live roles and climbing daily. Candidates check back often because the board stays fresh — meaning your listing keeps getting real eyes, not a one-day spike that dies.</p>
            </div>
            <div className="post-job-why-item">
              <div className="post-job-why-num">03</div>
              <strong>They apply straight to you</strong>
              <p>No aggregator middlemen, no lost leads, no extra clicks. One tap sends the candidate directly to your careers page, ready to apply.</p>
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
