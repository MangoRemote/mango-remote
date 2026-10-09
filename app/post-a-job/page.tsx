import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import PostJobForm from '@/components/PostJobForm'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Post a Remote Job for Asia - MangoRemote',
  description: 'Post a remote job for professionals living in Asia. $99 one-time payment, live for 30 days.',
}

export default async function PostAJobPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <main className="emp">
      <header className="emp-banner">
        <div className="emp-banner-inner">
          <h1>Post a remote job</h1>
          <p>Reach professionals living in Asia. One listing for a one-time $99 payment, live on MangoRemote for 30 days.</p>
        </div>
      </header>

      <div className="emp-offer">
        <div className="emp-price-box">
          <div className="emp-price">$99</div>
          <div className="emp-price-note">One-time payment per listing</div>
          <ul className="emp-included">
            <li>Listed on MangoRemote for 30 days</li>
            <li>Visible to free and Premium members</li>
            <li>Applicants apply on your own application page</li>
          </ul>
          {user ? (
            <a href="#post-form" className="emp-cta">Post this job</a>
          ) : (
            <Link href="/auth/login?next=/post-a-job" className="emp-cta">Sign in to post a job</Link>
          )}
          <p className="emp-small">No account? <Link href="/auth/signup?next=/post-a-job">Create one</Link> first.</p>
        </div>

        <section className="emp-steps">
          <h2>How it works</h2>
          <ol>
            <li><strong>Add the role.</strong> Enter the job details and the link candidates should apply through.</li>
            <li><strong>Pay securely.</strong> Payment is taken by Stripe. We never see your card details.</li>
            <li><strong>We review it.</strong> Every listing is checked before it goes live.</li>
            <li><strong>It goes live.</strong> The listing appears on MangoRemote for 30 days.</li>
          </ol>
        </section>
      </div>

      <section className="emp-faq">
        <h2>Questions</h2>
        <dl>
          <dt>What happens if my job isn&apos;t approved?</dt>
          <dd>We check each listing before it goes live. If it isn&apos;t approved, we&apos;ll contact you at the email on your account and explain why.</dd>
          <dt>Can I change the listing after it&apos;s live?</dt>
          <dd>Yes. Email <a href="mailto:hello@mangoremote.com">hello@mangoremote.com</a> with the changes.</dd>
          <dt>How do I renew?</dt>
          <dd>Listings last 30 days. To keep a role up after that, email us before it expires.</dd>
          <dt>Will I get a receipt?</dt>
          <dd>Your payment receipt comes from Stripe, to the email address you paid with.</dd>
          <dt>Can I get a refund?</dt>
          <dd>Email <a href="mailto:hello@mangoremote.com">hello@mangoremote.com</a> with your question and we&apos;ll reply.</dd>
        </dl>
      </section>

      {user ? (
        <section id="post-form" className="emp-form">
          <h2>Job details</h2>
          <PostJobForm />
        </section>
      ) : null}

      <footer className="emp-contact">
        Questions before you pay? Email <a href="mailto:hello@mangoremote.com">hello@mangoremote.com</a>.
      </footer>
    </main>
  )
}
