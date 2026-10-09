import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import PostJobForm from '@/components/PostJobForm'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Post a Remote Job for Asia - MangoRemote',
  description: 'List your remote job for professionals living in Asia. One listing, $99, live for 30 days.',
}

export default async function PostAJobPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { count: jobCount } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'live')

  return (
    <main className="post-page">
      <section className="post-job-hero">
        <p className="post-job-eyebrow">For employers</p>
        <h1>Hire remote talent based in Asia</h1>
        <p className="post-job-lede">
          MangoRemote lists remote roles for professionals living in Thailand, Vietnam, Japan, Indonesia, the Philippines and across Asia.
          One listing, one payment, live for 30 days.
        </p>
        <div className="post-job-stats">
          <div className="post-job-stat">
            <strong>{jobCount || 0}</strong>
            <span>Live roles today</span>
          </div>
          <div className="post-job-stat-divider" />
          <div className="post-job-stat">
            <strong>30 days</strong>
            <span>Listing duration</span>
          </div>
          <div className="post-job-stat-divider" />
          <div className="post-job-stat">
            <strong>$99</strong>
            <span>One-time payment</span>
          </div>
        </div>
      </section>

      <section className="post-job-pricing-card">
        <div className="post-job-price-row">
          <div>
            <div className="post-job-price">$99<span> one-time</span></div>
            <p className="premium-plan-note">Your listing is reviewed before it goes live.</p>
          </div>
          <div className="post-job-badge">30 days</div>
        </div>
        <ul className="post-job-features">
          <li><span className="post-job-check">✓</span> Listed for 30 days</li>
          <li><span className="post-job-check">✓</span> Shown to free and Premium members</li>
          <li><span className="post-job-check">✓</span> Applicants apply on your own application page</li>
        </ul>
      </section>

      <section className="post-job-steps">
        <h2>How it works</h2>
        <ol>
          <li><strong>Add the role.</strong> Fill in the details below. It takes a few minutes.</li>
          <li><strong>Pay securely.</strong> Payment is taken by Stripe. We never see your card details.</li>
          <li><strong>Go live.</strong> We review the listing and publish it on MangoRemote.</li>
        </ol>
      </section>

      <section className="post-job-faq">
        <h2>Common questions</h2>
        <details>
          <summary>How long does my listing stay up?</summary>
          <p>For 30 days from the day it goes live. To renew, email hello@mangoremote.com before it expires.</p>
        </details>
        <details>
          <summary>How do candidates apply?</summary>
          <p>They click through to the application link you give us. Applications go to you directly, not through MangoRemote.</p>
        </details>
        <details>
          <summary>Can I change my listing after it's live?</summary>
          <p>Yes. Email hello@mangoremote.com with the changes and we'll update it.</p>
        </details>
        <details>
          <summary>Will I get a receipt?</summary>
          <p>Yes. Your payment receipt is sent by Stripe to the email address you used to pay.</p>
        </details>
        <details>
          <summary>What if my listing isn't approved?</summary>
          <p>We'll contact you at the email on your account with the reason. For refund questions, email hello@mangoremote.com.</p>
        </details>
      </section>

      {user ? (
        <section className="post-job-form-section">
          <h2 className="post-job-form-heading">Job details</h2>
          <PostJobForm />
        </section>
      ) : (
        <section className="post-job-signin-prompt">
          <h2>Sign in to post a job</h2>
          <p>An account lets you track your listing and see when it goes live.</p>
          <div className="post-job-signin-actions">
            <Link href="/auth/login?next=/post-a-job" className="btn-primary">Sign in</Link>
            <Link href="/auth/signup?next=/post-a-job" className="btn-ghost">Create an account</Link>
          </div>
        </section>
      )}
    </main>
  )
}
