import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Premium — MangoRemote',
  description: 'Unlock every remote job on MangoRemote. Full access from $6.99/month.',
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
    <div className="premium-page-v2">

      {/* Dark hero */}
      <div className="premium-hero">
        <span className="premium-eyebrow">MangoRemote Premium</span>
        <h1>Find your remote job in Asia faster.</h1>
        <p>Premium members access the full job board, get new roles delivered weekly, and apply before free members even see the listing.</p>

        <div className="premium-stats">
          <div className="premium-stat">
            <strong>50+</strong>
            <span>Curated jobs</span>
          </div>
          <div className="premium-stat-divider" />
          <div className="premium-stat">
            <strong>Weekly</strong>
            <span>New listings</span>
          </div>
          <div className="premium-stat-divider" />
          <div className="premium-stat">
            <strong>Asia-first</strong>
            <span>Every single role</span>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="premium-pricing-wrap">
        {isPremium ? (
          <div className="premium-already">
            ✓ You&apos;re already a Premium member. <Link href="/account">View your account →</Link>
          </div>
        ) : (
          <div className="premium-plans">
            <div className="premium-plan">
              <div className="premium-plan-name">Monthly</div>
              <div className="premium-plan-price">$12.99<span>/mo</span></div>
              <div className="premium-plan-note">Billed monthly · Full flexibility</div>
              <CheckoutButton plan="monthly" />
              <div className="premium-plan-cancel">Cancel anytime</div>
            </div>

            <div className="premium-plan premium-plan-popular">
              <div className="premium-plan-badge">★ Most popular</div>
              <div className="premium-plan-name">Quarterly</div>
              <div className="premium-plan-price">$9.99<span>/mo</span></div>
              <div className="premium-plan-note">$29.99 billed every 3 months · <strong style={{color:'#16a34a'}}>Save 23%</strong></div>
              <CheckoutButton plan="quarterly" />
              <div className="premium-plan-cancel">Cancel anytime</div>
            </div>

            <div className="premium-plan">
              <div className="premium-plan-name">Annual</div>
              <div className="premium-plan-price">$6.99<span>/mo</span></div>
              <div className="premium-plan-note">$83.88 billed yearly · <strong style={{color:'#16a34a'}}>Save 46%</strong></div>
              <CheckoutButton plan="annual" />
              <div className="premium-plan-cancel">Cancel anytime</div>
            </div>
          </div>
        )}
        <p className="premium-stripe-note">🔒 Secure payment via Stripe. Cancel or pause anytime.</p>
      </div>

      {/* Why section */}
      <div className="premium-why">
        <div className="premium-why-inner">
          <span className="premium-eyebrow" style={{color: 'var(--accent)'}}>Why go Premium?</span>
          <h2>Stop scrolling. Start applying.</h2>
          <p>Free job boards are full of noise — scraped listings, outdated posts, and roles that don&apos;t work from Asia. MangoRemote Premium is different.</p>
          <div className="premium-benefits">
            <div className="premium-benefit">
              <div className="premium-benefit-num">01</div>
              <strong>See jobs others miss</strong>
              <p>Premium members access the full board. Free members only see half the listings.</p>
            </div>
            <div className="premium-benefit">
              <div className="premium-benefit-num">02</div>
              <strong>Apply first, get hired faster</strong>
              <p>Early access puts you in the first wave of applicants — before the competition arrives.</p>
            </div>
            <div className="premium-benefit">
              <div className="premium-benefit-num">03</div>
              <strong>Jobs delivered to you</strong>
              <p>A weekly digest of new Asia-compatible roles, straight to your inbox. No searching required.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Review */}
      <div className="premium-review-section">
        <div className="premium-review-label">Success story</div>
        <div className="premium-featured-review">
          <div className="premium-review-stars">★★★★★</div>
          <p>&quot;Send us your reviews and we&apos;ll feature them here.&quot;</p>
          <span>— Your name here · Job title</span>
        </div>
      </div>

    </div>
  )
}

function CheckoutButton({ plan }: { plan: string }) {
  return (
    <form action={`/api/checkout/premium?plan=${plan}`} method="post">
      <button type="submit" className="premium-plan-btn">Get started</button>
    </form>
  )
}
