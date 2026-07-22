'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { Category, Company } from '@/lib/types'

interface Props {
  categories: Category[]
  companies: Company[]
  initialJob?: Record<string, unknown>
}

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function AdminJobForm({ categories, companies, initialJob }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: (initialJob?.title as string) || '',
    slug: (initialJob?.slug as string) || '',
    company_id: (initialJob?.company_id as string) || '',
    description: (initialJob?.description as string) || '',
    salary_min: initialJob?.salary_min ? String(initialJob.salary_min) : '',
    salary_max: initialJob?.salary_max ? String(initialJob.salary_max) : '',
    salary_currency: (initialJob?.salary_currency as string) || 'USD',
    apply_url: (initialJob?.apply_url as string) || '',
    category_id: (initialJob?.category_id as string) || '',
    employment_type: (initialJob?.employment_type as string) || 'full-time',
    region_tags: ((initialJob?.region_tags as string[]) || []).join(', '),
    is_premium: (initialJob?.is_premium as boolean) || false,
    is_featured: (initialJob?.is_featured as boolean) || false,
    asia_friendly: (initialJob?.asia_friendly as boolean) || false,
    status: (initialJob?.status as string) || 'draft',
  })

  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()

    const payload = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      company_id: form.company_id,
      description: form.description,
      salary_min: form.salary_min ? Number(form.salary_min) : null,
      salary_max: form.salary_max ? Number(form.salary_max) : null,
      salary_currency: form.salary_currency,
      apply_url: form.apply_url,
      category_id: form.category_id,
      employment_type: form.employment_type,
      region_tags: form.region_tags.split(',').map(s => s.trim()).filter(Boolean),
      is_premium: form.is_premium,
      is_featured: form.is_featured,
      asia_friendly: form.asia_friendly,
      status: form.status,
      published_at: form.status === 'live' ? new Date().toISOString() : null,
      expires_at: form.status === 'live' ? new Date(Date.now() + 30 * 86400000).toISOString() : null,
    }

    if (initialJob?.id) {
      const { error } = await supabase.from('jobs').update(payload).eq('id', initialJob.id as string)
      if (error) { setError(error.message); setLoading(false); return }
    } else {
      const { error } = await supabase.from('jobs').insert(payload)
      if (error) { setError(error.message); setLoading(false); return }
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 640 }}>
      <div className="form-row">
        <div className="form-group">
          <label>Job title *</label>
          <input className="form-input" value={form.title} onChange={e => { set('title', e.target.value); set('slug', slugify(e.target.value)) }} required />
        </div>
        <div className="form-group">
          <label>Slug</label>
          <input className="form-input" value={form.slug} onChange={e => set('slug', e.target.value)} />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Company *</label>
          <select className="form-input filter-select" value={form.company_id} onChange={e => set('company_id', e.target.value)} required>
            <option value="">Select company...</option>
            {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Category *</label>
          <select className="form-input filter-select" value={form.category_id} onChange={e => set('category_id', e.target.value)} required>
            <option value="">Select category...</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Description *</label>
        <textarea className="form-input" value={form.description} onChange={e => set('description', e.target.value)} required rows={6} />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Salary min</label>
          <input className="form-input" type="number" value={form.salary_min} onChange={e => set('salary_min', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Salary max</label>
          <input className="form-input" type="number" value={form.salary_max} onChange={e => set('salary_max', e.target.value)} />
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
          <label>Employment type</label>
          <select className="form-input filter-select" value={form.employment_type} onChange={e => set('employment_type', e.target.value)}>
            <option value="full-time">Full-time</option>
            <option value="contract">Contract</option>
            <option value="part-time">Part-time</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Region tags (comma-separated)</label>
        <input className="form-input" value={form.region_tags} onChange={e => set('region_tags', e.target.value)} placeholder="Remote USA, Remote Europe" />
      </div>

      <div className="form-group">
        <label>Apply URL *</label>
        <input className="form-input" type="url" value={form.apply_url} onChange={e => set('apply_url', e.target.value)} required />
      </div>

      <div className="form-group">
        <label>Status</label>
        <select className="form-input filter-select" value={form.status} onChange={e => set('status', e.target.value)}>
          <option value="draft">Draft</option>
          <option value="pending">Pending</option>
          <option value="live">Live</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: 20 }}>
        <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13.5, cursor: 'pointer' }}>
          <input type="checkbox" checked={form.is_premium} onChange={e => set('is_premium', e.target.checked)} />
          Premium
        </label>
        <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13.5, cursor: 'pointer' }}>
          <input type="checkbox" checked={form.is_featured} onChange={e => set('is_featured', e.target.checked)} />
          Featured
        </label>
        <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13.5, cursor: 'pointer' }}>
          <input type="checkbox" checked={form.asia_friendly} onChange={e => set('asia_friendly', e.target.checked)} />
          🌏 Asia-friendly
        </label>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div style={{ display: 'flex', gap: 10, paddingTop: 8 }}>
        <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Saving...' : initialJob ? 'Update job' : 'Add job'}</button>
        <a href="/admin" className="btn-ghost">Cancel</a>
      </div>
    </form>
  )
}
