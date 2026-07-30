import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { User } from '@supabase/supabase-js'

export const metadata: Metadata = {
  title: 'My Account — MangoRemote',
}

// PREVIEW_MODE: set to true to preview without auth
const PREVIEW_MODE = false
const PREVIEW_USER = { email: 'sarah@example.com', created_at: '2026-01-15T00:00:00Z', id: 'preview' }
const PREVIEW_SUB = { plan: 'premium', status: 'active', current_period_end: '2026-08-29T00:00:00Z' }

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ upgraded?: string }> }) {
  let user: User | { email: string; created_at: string; id: string } | null = null
  let sub: { plan: string; status: string; current_period_end: string } | null = null

  if (PREVIEW_MODE) {
    user = PREVIEW_USER
    sub = PREVIEW_SUB
  } else {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) redirect('/auth/login')
    user = authUser
    const { data } = await supabase
      .from('subscriptions')
      .select('plan, status, current_period_end')
      .eq('user_id', authUser.id)
      .single()
    sub = data
  }

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
              <a href="mailto:hello@mangoremote.com?subject=Cancel subscription" className="account-cancel-link">
                Cancel subscription
              </a>
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

      {!isPremium && (
        <div className="account-upsell">
          <div className="account-upsell-inner">
            <strong>You&apos;re missing half the job board.</strong>
            <p>Premium members see all available roles and get new jobs delivered to their inbox every week.</p>
            <Link href="/premium" className="btn-primary">See Premium plans →</Link>
          </div>
        </div>
      )}
    </div>
  )
}
