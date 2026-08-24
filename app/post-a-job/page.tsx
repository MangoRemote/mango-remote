'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CATEGORIES = [
  'Operations', 'Healthcare', 'Project Management', 'Sales', 'Marketing',
  'Support', 'HR & Recruiting', 'Technical Support', 'Finance', 'Customer Success',
  'Management', 'Engineering', 'Design', 'Legal', 'Other'
]

export default function PostAJobPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    company_name: '', title: '', description: '', salary_min: '',
    salary_max: '', salary_currency: 'USD', location: '', category: '',
    apply_url: '', employment_type: 'full-time', logo_url: '',
  })

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/checkout/post-a-job', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Something went wrong')
      setLoading(false)
      return
    }

    const { url } = await res.json()
    if (url) router.push(url)
  }

  return (
    <div className="post-page">
      <div className="post-job-hero">
        <span className="post-job-eyebrow">Post a Job</span>
        <h1>Hire remote talent that<br /><em>already lives in Asia.</em></h1>
        <p>Reach thousands of remote professionals actively looking for Work from Anywhere and APAC roles.</p>
      </div>

      <div className="post-job-pricing-card">
        <div className="post-job-price-row">
          <div>
            <div className="post-job-price">$99<span>one-off</span></div>
            <div className="premium-plan-note">Listing goes live after review — usually within 24 hours</div>
          </div>
          <div className="post-job-badge">30 days live</div>
        </div>
        <ul className="post-job-features">
          <li><span className="post-job-check">✓</span> Job live for 30 days</li>
          <li><span className="post-job-check">✓</span> Seen by remote professionals targeting Asia specifically</li>
          <li><span className="post-job-check">✓</span> Listed directly — no aggregator middlemen</li>
          <li><span className="post-job-check">✓</span> Shown to both free and premium members</li>
        </ul>
      </div>

      <h2 className="post-job-form-heading">Job details</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="form-row">
          <div className="form-group">
            <label>Company name *</label>
            <input className="form-input" value={form.company_name} onChange={e => set('company_name', e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Company logo URL</label>
            <input className="form-input" type="url" value={form.logo_url} onChange={e => set('logo_url', e.target.value)} placeholder="https://..." />
          </div>
        </div>

        <div className="form-group">
          <label>Job title *</label>
          <input className="form-input" value={form.title} onChange={e => set('title', e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Job description *</label>
          <textarea className="form-input" value={form.description} onChange={e => set('description', e.target.value)} required rows={6} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category *</label>
            <select className="form-input filter-select" value={form.category} onChange={e => set('category', e.target.value)} required>
              <option value="">Select...</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Employment type *</label>
            <select className="form-input filter-select" value={form.employment_type} onChange={e => set('employment_type', e.target.value)}>
              <option value="full-time">Full-time</option>
              <option value="contract">Contract</option>
              <option value="part-time">Part-time</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Salary min</label>
            <input className="form-input" type="number" value={form.salary_min} onChange={e => set('salary_min', e.target.value)} placeholder="60000" />
          </div>
          <div className="form-group">
            <label>Salary max</label>
            <input className="form-input" type="number" value={form.salary_max} onChange={e => set('salary_max', e.target.value)} placeholder="90000" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Currency</label>
            <select className="form-input filter-select" value={form.salary_currency} onChange={e => set('salary_currency', e.target.value)}>
              <option value="USD">USD</option>
              <option value="GBP">GBP</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
          <div className="form-group">
            <label>Location / Region *</label>
            <input className="form-input" value={form.location} onChange={e => set('location', e.target.value)} placeholder="Remote Worldwide" required />
          </div>
        </div>

        <div className="form-group">
          <label>Apply URL *</label>
          <input className="form-input" type="url" value={form.apply_url} onChange={e => set('apply_url', e.target.value)} placeholder="https://..." required />
        </div>

        {error && <p className="form-error">{error}</p>}

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13.5, color: 'var(--muted)' }}>$99 one-off — listing goes live after review</span>
          <button type="submit" className="btn-primary" style={{ padding: '10px 24px', fontSize: 14.5 }} disabled={loading}>
            {loading ? 'Redirecting...' : 'Continue to payment →'}
          </button>
        </div>
      </form>
    </div>
  )
}
