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

  const { count: jobCount } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'live')
  const jobStat = jobCount ? `${jobCount}+` : '30+'

  return (
    <div className="premium-page-v2">

      {/* Hero with image */}
      <div className="premium-hero-image">
        <img src="/about-hero.jpg" alt="Asia skyline" />
        <div className="premium-hero-overlay">
          <span className="premium-eyebrow">MangoRemote Premium</span>
          <h1>Find your remote job in Asia faster.</h1>
          <p>Premium members access the full job board, get new roles delivered weekly, and apply before free members even see the listing.</p>

          <div className="premium-stats">
            <div className="premium-stat">
              <strong>{jobStat}</strong>
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

      {/* What happens next */}
      <div className="premium-next-section">
        <div className="premium-why-inner">
          <span className="premium-eyebrow" style={{color: 'var(--accent)'}}>What happens next</span>
          <h2>You&apos;re one click away.</h2>
          <div className="premium-benefits">
            <div className="premium-benefit">
              <div className="premium-benefit-num">01</div>
              <strong>Instant access</strong>
              <p>The moment payment goes through, all jobs on the board unlock. No waiting, no review.</p>
            </div>
            <div className="premium-benefit">
              <div className="premium-benefit-num">02</div>
              <strong>Weekly job digest</strong>
              <p>Every week we email you the freshest Asia-compatible roles — straight to your inbox.</p>
            </div>
            <div className="premium-benefit">
              <div className="premium-benefit-num">03</div>
              <strong>Cancel anytime</strong>
              <p>No contracts. Pause or cancel from your account page whenever you like.</p>
            </div>
          </div>
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
