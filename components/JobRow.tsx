import Link from 'next/link'
import type { Job } from '@/lib/types'
import SaveButton from './SaveButton'

interface Props {
  job: Job
  locked?: boolean
  saved?: boolean
  isLoggedIn?: boolean
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
  'Engineering':        '#3B82F6',
  'Design':             '#8B5CF6',
  'Marketing':          '#EC4899',
  'Sales':              '#10B981',
  'Customer Support':   '#F59E0B',
  'Product':            '#6366F1',
  'Finance':            '#14B8A6',
  'HR':                 '#F97316',
  'Operations':         '#64748B',
  'Healthcare':         '#EF4444',
  'Data':               '#0EA5E9',
  'Legal':              '#A855F7',
}

function categoryColour(name: string): string {
  return CATEGORY_COLOURS[name] || '#F26419'
}

const AVATAR_COLOURS = [
  '#3B82F6','#8B5CF6','#EC4899','#10B981',
  '#F59E0B','#6366F1','#14B8A6','#EF4444',
  '#F97316','#64748B','#0EA5E9','#A855F7',
]

function CompanyAvatar({ name }: { name: string }) {
  const initials = name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  const colour = AVATAR_COLOURS[name.charCodeAt(0) % AVATAR_COLOURS.length]
  return <div className="company-avatar" style={{ background: colour, color: '#fff', borderColor: 'transparent' }}>{initials}</div>
}

export default function JobRow({ job, locked = false, saved = false, isLoggedIn = false }: Props) {
  const salary = formatSalary(job)
  const companyName = job.company?.name || 'Unknown'
  const categoryName = job.category?.name || ''
  const rawRegions = (job.region_tags || []).filter(Boolean)
  const COUNTRY_FLAGS: Record<string, string> = {
    'Japan': '🇯🇵', 'Vietnam': '🇻🇳', 'Thailand': '🇹🇭', 'Indonesia': '🇮🇩',
    'Philippines': '🇵🇭', 'Malaysia': '🇲🇾', 'Singapore': '🇸🇬', 'South Korea': '🇰🇷',
    'Taiwan': '🇹🇼', 'Hong Kong': '🇭🇰', 'China': '🇨🇳', 'Cambodia': '🇰🇭',
    'Myanmar': '🇲🇲', 'Laos': '🇱🇦', 'Sri Lanka': '🇱🇰', 'Nepal': '🇳🇵',
    'Bangladesh': '🇧🇩', 'India': '🇮🇳',
  }
  const regionLabel = (r: string) => {
    const l = r.toLowerCase()
    if (l.includes('worldwide') || l.includes('anywhere') || l.includes('global')) return { icon: '🌍', label: 'Work from Anywhere' }
    if (l === 'apac' || l.includes('asia')) return { icon: '🌏', label: 'APAC' }
    if (COUNTRY_FLAGS[r]) return { icon: COUNTRY_FLAGS[r], label: r }
    return { icon: '📍', label: r }
  }

  const inner = (
    <>
      {job.company?.logo_url && (
        <img src={job.company.logo_url} alt={companyName} className="company-avatar-img" />
      )}

      <div className="job-card-body">
        <div className="job-card-top">
          <span className="job-title">{job.title}</span>
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
        </div>
      </div>

      <div className="job-card-right">
        {categoryName && (
          <span className="category-badge" style={{ background: categoryColour(categoryName) }}>{categoryName}</span>
        )}
        {job.is_featured && <span className="featured-label">★ Featured</span>}
        {!job.is_featured && <span className="days-ago">{daysAgo(job.created_at)}</span>}
        {job.is_featured && <span className="days-ago">{daysAgo(job.created_at)}</span>}
        {locked && <span style={{ fontSize: 16 }}>🔒</span>}
        {isLoggedIn && !locked && <SaveButton jobId={job.id} initialSaved={saved} />}
      </div>
    </>
  )

  if (locked) {
    return <div className="job-card locked" aria-hidden="true">{inner}</div>
  }

  return (
    <Link href={`/jobs/${job.slug}`} className={`job-card${job.is_featured ? ' featured' : ''}`}>
      {inner}
    </Link>
  )
}
