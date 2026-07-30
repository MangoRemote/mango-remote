import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — MangoRemote',
}

export default function TermsPage() {
  return (
    <main className="legal-page">
      <div className="legal-header">
        <h1>Terms of Service</h1>
        <p>Last updated: July 2026</p>
      </div>
      <div className="legal-body">
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing MangoRemote, you agree to be bound by these terms. If you do not agree, please do not use the site.</p>

        <h2>2. Service Description</h2>
        <p>MangoRemote is a remote job board curated for professionals living or wishing to live in Asia. We provide both free and premium subscription tiers.</p>

        <h2>3. Subscriptions & Payments</h2>
        <p>Premium subscriptions are billed monthly, quarterly, or annually via Stripe. You may cancel at any time from your account settings. Refunds are handled on a case-by-case basis.</p>

        <h2>4. User Accounts</h2>
        <p>You are responsible for maintaining the confidentiality of your account credentials. MangoRemote reserves the right to terminate accounts that violate these terms.</p>

        <h2>5. Intellectual Property</h2>
        <p>All content on MangoRemote, including job listings, copy, and design, is the property of MangoRemote unless otherwise stated.</p>

        <h2>6. Limitation of Liability</h2>
        <p>MangoRemote is not responsible for the accuracy of job listings or outcomes of applications made through the platform. We act as a job board only.</p>

        <h2>7. Changes to Terms</h2>
        <p>We reserve the right to update these terms at any time. Continued use of the site constitutes acceptance of any changes.</p>

        <h2>8. Contact</h2>
        <p>For any questions regarding these terms, contact us at <a href="mailto:hello@mangoremote.com">hello@mangoremote.com</a>.</p>
      </div>
    </main>
  )
}
