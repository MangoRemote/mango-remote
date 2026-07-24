import Link from 'next/link'
import type { Job } from '@/lib/types'

interface Props {
  job: Job
  locked?: boolean
}

function daysAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return '1d ago'
  return `${days}d ago`
}

function formatSalary(job: Job): string {
  if (!job.salary_min && !job.salary_max) return ''
  const currency = job.salary_currency || 'USD'
  const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency
  const fmt = (n: number) => n >= 1000 ? `${Math.round(n / 1000)}k` : String(n)
  if (job.salary_min && job.salary_max) return `${symbol}${fmt(job.salary_min)}–${symbol}${fmt(job.salary_max)}`
  if (job.salary_min) return `${symbol}${fmt(job.salary_min)}+`
  return ''
}

function CompanyInitials({ name }: { name: string }) {
  const initials = name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  return <div className="company-logo">{initials}</div>
}

export default function JobRow({ job, locked = false }: Props) {
  const salary = formatSalary(job)
  const companyName = job.company?.name || 'Unknown'
  const categoryName = job.category?.name || ''
  const location = job.region_tags?.[0] || ''

  const inner = (
    <>
      {job.company?.logo_url ? (
        <img src={job.company.logo_url} alt={companyName} className="company-logo" />
      ) : (
        <CompanyInitials name={companyName} />
      )}

      <div className="job-card-body">
        <div className="job-card-top">
          <span className="job-title">{job.title}</span>
          {job.is_featured && <span className="featured-badge">Featured</span>}
        </div>
        <div className="job-card-bottom">
          <span className="job-company">{companyName}</span>
          {location && <span className="tag">{location}</span>}
          {categoryName && <span className="tag tag-category">{categoryName}</span>}
          {job.asia_friendly && <span className="tag tag-asia">🌏 Asia-friendly</span>}
          {job.job_type && <span className="tag">{job.job_type}</span>}
        </div>
      </div>

      <div className="job-card-right">
        {salary && <span className="salary">{salary}</span>}
        <span className="days-ago">{daysAgo(job.created_at)}</span>
        {!locked && <span className="apply-btn">Apply →</span>}
        {locked && <span style={{ fontSize: 16 }}>🔒</span>}
      </div>
    </>
  )

  if (locked) {
    return <div className="job-card locked" aria-hidden="true">{inner}</div>
  }

  return (
    <Link href={`/jobs/${job.slug}`} className="job-card">
      {inner}
    </Link>
  )
}
