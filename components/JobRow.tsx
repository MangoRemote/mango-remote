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
  return (
    <div className="company-logo">
      {initials}
    </div>
  )
}

export default function JobRow({ job, locked = false }: Props) {
  const salary = formatSalary(job)
  const companyName = job.company?.name || 'Unknown'
  const categoryName = job.category?.name || ''
  const location = job.region_tags?.[0] || ''

  if (locked) {
    return (
      <div className="job-row locked" aria-hidden="true">
        <CompanyInitials name={companyName} />
        <span className="job-title">{job.title}</span>
        <span className="job-meta">{companyName} · {location}</span>
        <div className="job-tags">
          {categoryName && <span className="tag">{categoryName}</span>}
          {job.asia_friendly && <span className="tag tag-asia">🌏 Asia-friendly</span>}
        </div>
        {salary && <span className="salary">{salary}</span>}
        <span className="days-ago">{daysAgo(job.created_at)}</span>
        <span className="apply-link lock-icon">🔒</span>
      </div>
    )
  }

  return (
    <Link href={`/jobs/${job.slug}`} style={{ display: 'contents' }}>
      <div className="job-row">
        {job.company?.logo_url ? (
          <img src={job.company.logo_url} alt={companyName} className="company-logo" />
        ) : (
          <CompanyInitials name={companyName} />
        )}
        <span className="job-title">{job.title}</span>
        <span className="job-meta">{companyName} · {location}</span>
        <div className="job-tags">
          {categoryName && <span className="tag">{categoryName}</span>}
          {job.asia_friendly && <span className="tag tag-asia">🌏 Asia-friendly</span>}
        </div>
        {salary && <span className="salary">{salary}</span>}
        <span className="days-ago">{daysAgo(job.created_at)}</span>
        <a
          href={job.apply_url}
          target="_blank"
          rel="noopener noreferrer"
          className="apply-link"
          onClick={e => e.stopPropagation()}
        >
          Apply →
        </a>
      </div>
    </Link>
  )
}
