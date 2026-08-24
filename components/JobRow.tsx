import Link from 'next/link'
import type { Job } from '@/lib/types'
import SaveButton from './SaveButton'

interface Props {
  job: Job
  locked?: boolean
  saved?: boolean
  isLoggedIn?: boolean
}

function isNew(dateStr: string): boolean {
  return Date.now() - new Date(dateStr).getTime() < 48 * 60 * 60 * 1000
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

const CATEGORY_COLOURS: Record<string, string> = {
  'Engineering':      '#3B82F6',
  'Design':           '#8B5CF6',
  'Marketing':        '#EC4899',
  'Sales':            '#10B981',
  'Support':          '#F59E0B',
  'Customer Support': '#F59E0B',
  'Product':          '#6366F1',
  'Finance':          '#14B8A6',
  'HR & Recruiting':  '#F97316',
  'HR':               '#F97316',
  'Operations':       '#64748B',
  'Healthcare':       '#EF4444',
  'Data':             '#0EA5E9',
  'Legal':            '#A855F7',
  'Management':       '#0D9488',
  'Writing':          '#D97706',
}

function getExperienceLevel(title: string): string | null {
  const t = title.toLowerCase()
  if (/\b(vp|vice president|cto|cpo|cfo|coo|chief)\b/.test(t)) return 'Executive'
  if (/\b(director|head of)\b/.test(t)) return 'Director'
  if (/\b(manager|lead|principal|staff)\b/.test(t)) return 'Manager'
  if (/\b(senior|sr\.?|sr )\b/.test(t)) return 'Senior'
  if (/\b(junior|jr\.?|entry|graduate|intern|trainee|no experience)\b/.test(t)) return 'Entry'
  if (/\b(mid|intermediate|associate)\b/.test(t)) return 'Mid'
  return null
}

function categoryColour(name: string): string {
  return CATEGORY_COLOURS[name] || '#F26419'
}

const AVATAR_COLOURS = [
  '#3B82F6','#8B5CF6','#EC4899','#10B981',
  '#F59E0B','#6366F1','#14B8A6','#EF4444',
  '#F97316','#64748B','#0EA5E9','#A855F7',
]

const COUNTRY_FLAGS: Record<string, string> = {
  'Japan': '🇯🇵', 'Vietnam': '🇻🇳', 'Thailand': '🇹🇭', 'Indonesia': '🇮🇩',
  'Philippines': '🇵🇭', 'Malaysia': '🇲🇾', 'Singapore': '🇸🇬', 'South Korea': '🇰🇷',
  'Taiwan': '🇹🇼', 'Hong Kong': '🇭🇰', 'China': '🇨🇳', 'Cambodia': '🇰🇭',
  'Myanmar': '🇲🇲', 'Laos': '🇱🇦', 'Sri Lanka': '🇱🇰', 'Nepal': '🇳🇵',
  'Bangladesh': '🇧🇩', 'India': '🇮🇳',
}

function regionLabel(r: string): { icon: string; label: string } {
  const l = r.toLowerCase()
  if (l.includes('worldwide') || l.includes('anywhere') || l.includes('global')) return { icon: '🌍', label: 'Work from Anywhere' }
  if (l === 'apac' || l === 'asia pacific') return { icon: '🌏', label: 'APAC' }
  if (COUNTRY_FLAGS[r]) return { icon: COUNTRY_FLAGS[r], label: r }
  return { icon: '📍', label: r }
}

export default function JobRow({ job, locked = false, saved = false, isLoggedIn = false }: Props) {
  const salary = formatSalary(job)
  const companyName = job.company?.name || 'Unknown'
  const categoryName = job.category?.name || ''
  const rawRegions = (job.region_tags || []).filter(Boolean)
  const jobIsNew = isNew(job.published_at || job.created_at)
  const experienceLevel = getExperienceLevel(job.title)

  const inner = (
    <>
      {job.company?.logo_url ? (
        <img src={job.company.logo_url} alt={companyName} className="company-avatar-img" />
      ) : (
        <div className="company-avatar" style={{
          background: AVATAR_COLOURS[(companyName.charCodeAt(0) || 0) % AVATAR_COLOURS.length],
          color: '#fff',
          borderColor: 'transparent',
        }}>
          {companyName.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()}
        </div>
      )}

      <div className="job-card-body">
        <div className="job-card-top">
          <span className="job-title">{job.title}</span>
          {jobIsNew && !locked && <span className="new-badge">New</span>}
        </div>
        <div className="job-card-meta">
          <span className="job-company">{companyName}</span>
          {salary && <span className="salary-inline">{salary}</span>}
        </div>
        <div className="job-card-bottom">
          {rawRegions.map(r => {
            const { icon, label } = regionLabel(r)
            return <span key={r} className="tag">{icon} {label}</span>
          })}
          {rawRegions.length === 0 && <span className="tag">🌍 Work from Anywhere</span>}
          {experienceLevel && <span className="tag tag-level">{experienceLevel}</span>}
        </div>
      </div>

      <div className="job-card-right">
        {categoryName && (
          <span className="category-badge" style={{ background: categoryColour(categoryName) }}>{categoryName}</span>
        )}
        {job.is_featured && <span className="featured-label">★ Featured</span>}
        <span className="days-ago">{daysAgo(job.published_at || job.created_at)}</span>
        {locked && <span className="locked-icon">🔒</span>}
        {isLoggedIn && !locked && <SaveButton jobId={job.id} initialSaved={saved} />}
      </div>
    </>
  )

  if (locked) {
    return (
      <div className="job-card locked" aria-hidden="true">
        <div className="company-avatar locked-avatar" />
        <div className="job-card-body">
          <div className="job-card-top">
            <span className="job-title locked-blank">Premium job</span>
          </div>
          <div className="job-card-meta">
            <span className="job-company locked-blank">Hidden company</span>
          </div>
          <div className="job-card-bottom">
            {rawRegions.map(r => {
              const { icon, label } = regionLabel(r)
              return <span key={r} className="tag">{icon} {label}</span>
            })}
            {rawRegions.length === 0 && <span className="tag">🌍 Work from Anywhere</span>}
            {categoryName && <span className="tag">{categoryName}</span>}
          </div>
        </div>
        <div className="job-card-right">
          <span className="locked-icon">🔒</span>
        </div>
      </div>
    )
  }

  return (
    <Link href={`/jobs/${job.slug}`} className={`job-card${job.is_featured ? ' featured' : ''}`}>
      {inner}
    </Link>
  )
}
