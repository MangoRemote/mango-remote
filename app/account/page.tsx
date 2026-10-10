import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { User } from '@supabase/supabase-js'
import type { Job } from '@/lib/types'

export const metadata: Metadata = {
  title: 'My Account — MangoRemote',
}


export default async function AccountPage({ searchParams }: { searchParams: Promise<{ upgraded?: string }> }) {
  let user: User | { email: string; created_at: string; id: string } | null = null
  let sub: { plan: string; status: string; current_period_end: string } | null = null
  let savedJobs: Job[] = []

  const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) redirect('/auth/login')
    user = authUser
    const [{ data: subData }, { data: savedData }] = await Promise.all([
      supabase.from('subscriptions').select('plan, status, current_period_end').eq('user_id', authUser.id).single(),
      supabase.from('saved_jobs').select('job_id, jobs(*, company:companies(*), category:categories(*))').eq('user_id', authUser.id).order('created_at', { ascending: false }),
    ])
    sub = subData
    const cutoff = Date.now() - 35 * 24 * 60 * 60 * 1000
    savedJobs = ((savedData || []).map((r: { jobs: unknown }) => r.jobs).filter(Boolean) as Job[])
      .filter(j => new Date(j.published_at || 0).getTime() >= cutoff)

  const isPremium = sub?.plan === 'premium' && sub?.status === 'active'
  const params = await searchParams
  const justUpgraded = params.upgraded === '1'

  return (
    <div className="account-page">
      {justUpgraded && (
        <div className="account-success-banner">
          Welcome to Premium! You now have full access to every job on MangoRemote.
        </div>
      )}
      <div className="account-header">
        <h1>My Account</h1>
        <p>{user!.email}</p>
      </div>

      <div className="account-grid">
        <div className="account-card">
          <div className="account-card-label">Current plan</div>
          {isPremium ? (
            <>
              <div className="account-plan-badge account-plan-premium">Premium</div>
              <p className="account-plan-desc">You have full access to every job on MangoRemote.</p>
              {sub?.current_period_end && (
                <p className="account-plan-renews">
                  Renews {new Date(sub.current_period_end).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              )}
              <form action="/api/billing-portal" method="post">
                <button type="submit" className="account-cancel-link">
                  Manage or cancel subscription
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="account-plan-badge account-plan-free">Free</div>
              <p className="account-plan-desc">You&apos;re on the free plan. Upgrade to unlock all jobs.</p>
              <Link href="/premium" className="btn-primary account-upgrade-btn">
                Upgrade to Premium
              </Link>
            </>
          )}
        </div>

        <div className="account-card">
          <div className="account-card-label">Account details</div>
          <div className="account-detail-row">
            <span className="account-detail-key">Email</span>
            <span className="account-detail-val">{user!.email}</span>
          </div>
          <div className="account-detail-row">
            <span className="account-detail-key">Member since</span>
            <span className="account-detail-val">
              {new Date(user!.created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      {savedJobs.length > 0 && (
        <div className="account-saved">
          <h2 className="account-saved-title">Saved Jobs</h2>
          <div className="account-saved-list">
            {savedJobs.map(job => (
              <Link key={job.id} href={`/jobs/${job.slug}`} className="account-saved-row">
                <div>
                  <div className="account-saved-job-title">{job.title}</div>
                  <div className="account-saved-company">{job.company?.name}</div>
                </div>
                <span className="account-saved-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {!isPremium && (
        <div className="account-upsell">
          <div className="account-upsell-inner">
            <strong>You&apos;re missing half the job board.</strong>
            <p>Premium members see every job on the board, including premium-only listings.</p>
            <Link href="/premium" className="btn-primary">See Premium plans →</Link>
          </div>
        </div>
      )}
    </div>
  )
}
