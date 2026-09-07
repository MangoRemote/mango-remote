import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — MangoRemote',
}

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <div className="legal-header">
        <h1>Privacy Policy</h1>
        <p>Last updated: July 2026</p>
      </div>
      <div className="legal-body">
        <h2>1. What We Collect</h2>
        <p>We collect your email address when you create an account or subscribe to job alerts. Payment details are handled securely by Stripe and never stored on our servers.</p>

        <h2>2. How We Use Your Data</h2>
        <p>We use your email to manage your account, send weekly job digests (Premium members), and notify you of subscription changes. We do not sell your data to third parties.</p>

        <h2>3. Third-Party Services</h2>
        <p>We use Stripe for payment processing and Supabase for secure data storage. Both comply with industry-standard security practices.</p>

        <h2>4. Cookies</h2>
        <p>We use essential cookies to keep you logged in. We do not use tracking or advertising cookies.</p>

        <h2>5. Your Rights</h2>
        <p>You have the right to access, correct, or delete your personal data at any time. Email us at <a href="mailto:hello@mangoremote.com">hello@mangoremote.com</a> to make a request.</p>

        <h2>6. Data Retention</h2>
        <p>We retain your data for as long as your account is active. Upon deletion, your data is removed within 30 days.</p>

        <h2>7. Contact</h2>
        <p>For privacy-related queries, contact <a href="mailto:hello@mangoremote.com">hello@mangoremote.com</a>.</p>
      </div>
    </main>
  )
}
