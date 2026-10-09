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
      <header className="emp-band">
        <h1>Post a remote job</h1>
        <p>Reach remote professionals looking for roles they can do from Asia and around the world.</p>
      </header>

      <div className="emp-wrap">
        <section className="emp-price-card">
          <div className="emp-price">$99</div>
          <div className="emp-period">One-time payment for a listing live 30 days</div>
          <ul className="emp-included">
            <li>Listed on MangoRemote for 30 days</li>
            <li>Visible to MangoRemote job seekers</li>
            <li>Candidates apply through your own application link</li>
            <li>Reviewed before it is published</li>
          </ul>
          {user ? (
            <a href="#post-form" className="emp-cta">Post your job — $99</a>
          ) : (
            <Link href="/auth/login?next=/post-a-job" className="emp-cta">Sign in to post your job — $99</Link>
          )}
          {!user && <p className="emp-signin">New here? <Link href="/auth/signup?next=/post-a-job">Create an account</Link></p>}
        </section>

        <section className="emp-section">
          <h2>How it works</h2>
          <ol className="emp-steps">
            <li><strong>1. Submit your job</strong>Enter the details and your application link.</li>
            <li><strong>2. Pay securely</strong>Payment is taken by Stripe. We never see your card details.</li>
            <li><strong>3. We review it</strong>Every listing is checked before it goes live.</li>
            <li><strong>4. It is published</strong>Your job is live on MangoRemote for 30 days.</li>
          </ol>
        </section>

        <section className="emp-section">
          <h2>Questions</h2>
          <dl>
            <dt>How long is my listing live?</dt>
            <dd>For 30 days from the day it is published.</dd>
            <dt>How do candidates apply?</dt>
            <dd>They use the application link you provide. Applications go to you, not through MangoRemote.</dd>
            <dt>What happens after I pay?</dt>
            <dd>You see a confirmation that your listing is in review. We check it, then publish it.</dd>
            <dt>Can I edit my listing?</dt>
            <dd>Yes. Email <a href="mailto:hello@mangoremote.com">hello@mangoremote.com</a> with the changes.</dd>
            <dt>What if my listing isn&apos;t approved?</dt>
            <dd>We contact you at the email on your account and explain why.</dd>
            <dt>Do I get a receipt?</dt>
            <dd>Your payment receipt comes from Stripe, sent to the email you paid with.</dd>
          </dl>
        </section>

        {user ? (
          <section id="post-form" className="emp-form">
            <h2>Job details</h2>
            <PostJobForm />
          </section>
        ) : null}

        <footer className="emp-foot">
          Questions before you pay? Email <a href="mailto:hello@mangoremote.com">hello@mangoremote.com</a>.
        </footer>
      </div>
    </main>
  )
}
