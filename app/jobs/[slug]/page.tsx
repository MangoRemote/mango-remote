import { createClient } from '@/lib/supabase/server'
import JobRow from '@/components/JobRow'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import type { Job } from '@/lib/types'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

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

  if (j.is_premium) {
    const { data: { user } } = await supabase.auth.getUser()
    let isPremium = false
    if (user) {
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('plan, status')
        .eq('user_id', user.id)
        .single()
      isPremium = sub?.plan === 'premium' && sub?.status === 'active'

      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()
      if (userData?.role === 'admin') isPremium = true
    }
    if (!isPremium) redirect(`/premium?from=${slug}`)
  }

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
  const regions = (j.region_tags || []).filter(r => r && r !== 'Remote Worldwide' && r !== 'Remote Asia')

  return (
    <main className="job-detail-page">

      {/* Breadcrumb */}
      <div className="job-detail-breadcrumb">
        <Link href="/">Remote Jobs</Link>
        <span>›</span>
        {category && <Link href={`/jobs?category=${category.slug}`}>{category.name}</Link>}
        {category && <span>›</span>}
        <span>{j.title}</span>
      </div>

      {/* Header card */}
      <div className="job-detail-header">
        <div className="job-detail-company-row">
          {company?.logo_url ? (
            <img src={company.logo_url} alt={company.name} className="job-detail-logo" />
          ) : (
            <div className="job-detail-logo-placeholder">
              {company?.name?.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <div className="job-detail-company-name">{company?.name}</div>
            {company?.website && (
              <a href={company.website} target="_blank" rel="noopener noreferrer" className="job-detail-company-url">
                {company.website.replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>
        </div>

        <h1 className="job-detail-title">{j.title}</h1>

        {/* Quick facts */}
        <div className="job-detail-facts">
          {category && (
            <div className="job-detail-fact">
              <span className="job-detail-fact-label">Category</span>
              <span className="job-detail-fact-value">{category.name}</span>
            </div>
          )}
          <div className="job-detail-fact">
            <span className="job-detail-fact-label">Type</span>
            <span className="job-detail-fact-value" style={{ textTransform: 'capitalize' }}>{j.employment_type}</span>
          </div>
          {regions.length > 0 && (
            <div className="job-detail-fact">
              <span className="job-detail-fact-label">Location</span>
              <span className="job-detail-fact-value">{regions.join(', ')}</span>
            </div>
          )}
          {salary && (
            <div className="job-detail-fact">
              <span className="job-detail-fact-label">Salary</span>
              <span className="job-detail-fact-value salary-inline">{salary}</span>
            </div>
          )}
        </div>

        {/* Apply CTA */}
        <a
          href={j.apply_url}
          target="_blank"
          rel="noopener noreferrer"
          className="job-detail-apply-btn"
        >
          Apply for this role →
        </a>
        <p className="job-detail-apply-note">You'll be taken to {company?.name?.trim()}'s careers page</p>
      </div>

      {/* Description */}
      <div className="job-detail-body">
        <h2 className="job-detail-section-title">About the role</h2>
        <div className="job-detail-description" dangerouslySetInnerHTML={{ __html: j.description || '' }} />
      </div>

      {/* Apply CTA bottom */}
      <div className="job-detail-apply-bottom">
        <a
          href={j.apply_url}
          target="_blank"
          rel="noopener noreferrer"
          className="job-detail-apply-btn"
        >
          Apply for this role →
        </a>
        <p className="job-detail-apply-note">You'll be taken to {company?.name?.trim()}'s careers page</p>
      </div>

      {/* Related jobs */}
      {related && related.length > 0 && (
        <div className="job-detail-related">
          <div className="job-detail-related-heading">More {category?.name} roles</div>
          {related.map(r => <JobRow key={r.id} job={r as Job} />)}
        </div>
      )}
    </main>
  )
}
