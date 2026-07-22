import { createClient } from '@/lib/supabase/server'
import JobRow from '@/components/JobRow'
import { notFound } from 'next/navigation'
import type { Job } from '@/lib/types'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: job } = await supabase
    .from('jobs')
    .select('title, description, company:companies(name)')
    .eq('slug', slug)
    .single()

  if (!job) return { title: 'Job not found' }
  const company = Array.isArray(job.company) ? job.company[0] : job.company
  return {
    title: `${job.title} at ${company?.name} — MangoRemote`,
    description: job.description?.slice(0, 155),
  }
}

export default async function JobPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: job } = await supabase
    .from('jobs')
    .select('*, company:companies(*), category:categories(*)')
    .eq('slug', slug)
    .eq('status', 'live')
    .single()

  if (!job) notFound()

  const j = job as Job
  const company = Array.isArray(j.company) ? j.company[0] : j.company
  const category = Array.isArray(j.category) ? j.category[0] : j.category

  const { data: related } = await supabase
    .from('jobs')
    .select('*, company:companies(*), category:categories(*)')
    .eq('category_id', j.category_id)
    .eq('status', 'live')
    .neq('id', j.id)
    .limit(4)

  function formatSalary() {
    if (!j.salary_min && !j.salary_max) return null
    const cur = j.salary_currency || 'USD'
    const sym = cur === 'USD' ? '$' : cur === 'EUR' ? '€' : cur === 'GBP' ? '£' : cur
    const fmt = (n: number) => n >= 1000 ? `${Math.round(n / 1000)}k` : String(n)
    if (j.salary_min && j.salary_max) return `${sym}${fmt(j.salary_min)}–${sym}${fmt(j.salary_max)}`
    if (j.salary_min) return `${sym}${fmt(j.salary_min)}+`
    return null
  }

  const salary = formatSalary()

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          {company?.logo_url ? (
            <img src={company.logo_url} alt={company.name} style={{ width: 48, height: 48, borderRadius: 8, border: '1px solid var(--border)', objectFit: 'contain' }} />
          ) : (
            <div style={{ width: 48, height: 48, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--tag-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16 }}>
              {company?.name?.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{company?.name}</div>
            {company?.website && (
              <a href={company.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12.5, color: 'var(--muted)' }}>
                {company.website.replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>
        </div>

        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 800, letterSpacing: '-0.4px', marginBottom: 12, lineHeight: 1.2 }}>
          {j.title}
        </h1>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {category && <span className="tag">{category.name}</span>}
          <span className="tag" style={{ textTransform: 'capitalize' }}>{j.employment_type}</span>
          {j.region_tags?.map(r => <span key={r} className="tag">{r}</span>)}
          {j.asia_friendly && <span className="tag tag-asia">🌏 Asia-friendly</span>}
          {salary && <span className="tag" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11.5 }}>{salary}</span>}
        </div>

        <a
          href={j.apply_url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
          style={{ display: 'inline-block', fontSize: 14 }}
        >
          Apply for this role →
        </a>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 28, marginBottom: 48 }}>
        <div style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--text)', whiteSpace: 'pre-wrap' }}>
          {j.description}
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 28, marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
        <a
          href={j.apply_url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
          style={{ display: 'inline-block', fontSize: 14 }}
        >
          Apply for this role →
        </a>
      </div>

      {related && related.length > 0 && (
        <div style={{ marginTop: 48 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
            More {category?.name} roles
          </div>
          {related.map(r => <JobRow key={r.id} job={r as Job} />)}
        </div>
      )}
    </main>
  )
}
