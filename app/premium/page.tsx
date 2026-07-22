import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Premium — MangoRemote',
  description: 'Get full access to all remote jobs on MangoRemote. £9.99/month.',
}

export default async function PremiumPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let isPremium = false
  if (user) {
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('plan, status')
      .eq('user_id', user.id)
      .single()
    isPremium = sub?.plan === 'premium' && sub?.status === 'active'
  }

  return (
    <div className="premium-page">
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
        MangoRemote Premium
      </div>
      <h1>Full access to every remote job that lets you live in Asia.</h1>

      <div className="price">£9.99</div>
      <div className="price-sub">per month, cancel any time</div>

      <ul className="perks-list">
        <li>Access to all jobs on MangoRemote — free members see 50%</li>
        <li>Every 🌏 Asia-friendly role tagged with timezone compatibility</li>
        <li>New jobs added every week, curated for GMT+7 and GMT+8 workers</li>
        <li>Early access to newly posted roles before free members</li>
        <li>Support an independent job board built by a Bangkok expat</li>
      </ul>

      {isPremium ? (
        <div style={{ padding: '14px 0', fontSize: 14, color: 'var(--green)', fontWeight: 600 }}>
          ✓ You&apos;re already a Premium member. Enjoy full access.
        </div>
      ) : (
        <form action="/api/checkout/premium" method="post">
          <button type="submit" className="btn-primary" style={{ padding: '12px 32px', fontSize: 15 }}>
            Unlock Premium — £9.99/month
          </button>
        </form>
      )}

      <p style={{ marginTop: 20, fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.6 }}>
        Secure payment via Stripe. Cancel any time from your account settings.
      </p>
    </div>
  )
}
