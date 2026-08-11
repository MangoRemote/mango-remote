import { createClient } from '@/lib/supabase/server'
import JobRow from '@/components/JobRow'
import PremiumGate from '@/components/PremiumGate'
import JobFilters from '@/components/JobFilters'
import type { Job, Category } from '@/lib/types'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Remote Jobs — MangoRemote',
  description: 'Browse remote jobs compatible with living in Asia. Every role vetted for timezone compatibility. Filter by country, category, and experience level.',
}

interface Props {
  searchParams: Promise<{
    q?: string
    category?: string
    type?: string
    region?: string
    asia?: string
    country?: string
    level?: string
    posted?: string
    sort?: string
  }>
}

export default async function JobsPage({ searchParams }: Props) {
  const params = await searchParams
  const supabase = await createClient()

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

  let query = supabase
    .from('jobs')
    .select('*, company:companies(*), category:categories(*)')
    .eq('status', 'live')
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)

  // Sort
  if (params.sort === 'featured') {
    query = query.order('is_featured', { ascending: false }).order('published_at', { ascending: false })
  } else {
    query = query.order('published_at', { ascending: false })
  }

  if (params.q) {
    query = query.or(`title.ilike.%${params.q}%,description.ilike.%${params.q}%`)
  }
  if (params.category) {
    const { data: cat } = await supabase.from('categories').select('id')
      .or(`slug.eq.${params.category},slug.ilike.${params.category.toLowerCase()}`)
      .single()
    if (cat) query = query.eq('category_id', cat.id)
  }
  if (params.type) {
    query = query.eq('employment_type', params.type)
  }
  if (params.asia === '1') {
    query = query.or('region_tags.cs.{"APAC"},region_tags.cs.{"Japan"},region_tags.cs.{"Vietnam"},region_tags.cs.{"Thailand"},region_tags.cs.{"Indonesia"},region_tags.cs.{"Philippines"},region_tags.cs.{"Malaysia"},region_tags.cs.{"Singapore"},region_tags.cs.{"South Korea"},region_tags.cs.{"Taiwan"},region_tags.cs.{"Hong Kong"},region_tags.cs.{"China"},region_tags.cs.{"India"},region_tags.cs.{"Cambodia"},region_tags.cs.{"Myanmar"},region_tags.cs.{"Sri Lanka"}')
  }
  if (params.country) {
    query = query.contains('region_tags', [params.country])
  }
  if (params.level) {
    const levelMap: Record<string, string[]> = {
      entry:   ['%junior%', '%entry%', '%graduate%', '%intern%', '%trainee%'],
      mid:     ['%mid%', '%intermediate%', '%associate%'],
      senior:  ['%senior%', '%sr.%', '%sr %', '%principal%', '%staff %', '%expert%'],
      manager: ['%manager%', '%lead%', '%head of%', '%director%', '%vp %', '%vice president%', '%cto%', '%cpo%'],
    }
    const patterns = levelMap[params.level]
    if (patterns) query = query.or(patterns.map(p => `title.ilike.${p}`).join(','))
  }
  if (params.posted) {
    const days = parseInt(params.posted)
    if (!isNaN(days)) {
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
      query = query.gte('published_at', since)
    }
  }

  const [{ data: jobs }, { data: categories }, { data: savedData }] = await Promise.all([
    query,
    supabase.from('categories').select('*').order('name'),
    user ? supabase.from('saved_jobs').select('job_id').eq('user_id', user.id) : Promise.resolve({ data: [] }),
  ])

  const savedIds = new Set((savedData || []).map((r: { job_id: string }) => r.job_id))
  const allJobs = (jobs || []) as Job[]
  const FREE_LIMIT = 5
  const freeJobs = allJobs.slice(0, FREE_LIMIT)
  const premiumJobs = allJobs.slice(FREE_LIMIT)

  const hasFilters = !!(params.q || params.category || params.type || params.asia || params.country || params.level || params.posted)

  const activeFilterCount = [params.q, params.category, params.type, params.asia || params.country, params.level, params.posted].filter(Boolean).length

  return (
    <main className="jobs-page">
      <div className="jobs-page-header">
        <div className="jobs-page-header-top">
          <h1 className="jobs-page-title">
            Remote Jobs
            <span className="jobs-page-count">{allJobs.length} {allJobs.length === 1 ? 'job' : 'jobs'}</span>
          </h1>
          <div className="jobs-page-sort">
            <SortSelect current={params.sort} currentParams={params} />
          </div>
        </div>

        {hasFilters && (
          <div className="active-filters-bar">
            {params.q && <span className="active-filter-chip">"{params.q}"</span>}
            {params.category && <span className="active-filter-chip">{params.category}</span>}
            {params.country && <span className="active-filter-chip">{params.country}</span>}
            {params.asia === '1' && <span className="active-filter-chip">Asia / APAC</span>}
            {params.level && <span className="active-filter-chip">{params.level}</span>}
            {params.type && <span className="active-filter-chip">{params.type}</span>}
            {params.posted && <span className="active-filter-chip">Last {params.posted === '1' ? '24h' : params.posted + 'd'}</span>}
            <Link href="/jobs" className="clear-filters-link">
              Clear {activeFilterCount > 1 ? 'all' : ''} filters ×
            </Link>
          </div>
        )}
      </div>

      <JobFilters
        categories={(categories || []) as Category[]}
        currentParams={params as { q?: string; category?: string; type?: string; asia?: string; country?: string; level?: string; posted?: string }}
      />

      <div className="jobs-list">
        {freeJobs.map(job => (
          <JobRow key={job.id} job={job} saved={savedIds.has(job.id)} isLoggedIn={!!user} />
        ))}

        {premiumJobs.length > 0 && !isPremium && (
          <>
            <PremiumGate count={premiumJobs.length} hasSearch={hasFilters} />
            {premiumJobs.map(job => (
              <JobRow key={job.id} job={job} locked />
            ))}
          </>
        )}

        {premiumJobs.length > 0 && isPremium && premiumJobs.map(job => (
          <JobRow key={job.id} job={job} saved={savedIds.has(job.id)} isLoggedIn={!!user} />
        ))}

        {allJobs.length === 0 && (
          <div className="jobs-empty">
            <div className="jobs-empty-icon">🔍</div>
            <h3>No jobs found</h3>
            <p>Try broadening your search or <Link href="/jobs">clear all filters</Link>.</p>
          </div>
        )}
      </div>
    </main>
  )
}

function SortSelect({ current, currentParams }: { current?: string; currentParams: Record<string, string | undefined> }) {
  const base = new URLSearchParams()
  Object.entries(currentParams).forEach(([k, v]) => { if (v && k !== 'sort') base.set(k, v) })

  const recentUrl = `/jobs?${base.toString()}`
  const featuredUrl = `/jobs?${base.toString()}${base.toString() ? '&' : ''}sort=featured`

  return (
    <div className="sort-links">
      <Link href={recentUrl} className={`sort-link ${!current || current === 'recent' ? 'sort-link-active' : ''}`}>
        Most recent
      </Link>
      <Link href={featuredUrl} className={`sort-link ${current === 'featured' ? 'sort-link-active' : ''}`}>
        Featured first
      </Link>
    </div>
  )
}
