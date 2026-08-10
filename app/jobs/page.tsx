import { createClient } from '@/lib/supabase/server'
import JobRow from '@/components/JobRow'
import PremiumGate from '@/components/PremiumGate'
import JobFilters from '@/components/JobFilters'
import type { Job, Category } from '@/lib/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Remote Jobs — MangoRemote',
  description: 'Browse remote jobs compatible with living in Asia. Asia-friendly timezone tags on every listing.',
}

interface Props {
  searchParams: Promise<{ q?: string; category?: string; type?: string; region?: string; asia?: string; level?: string; posted?: string }>
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
    .order('is_featured', { ascending: false })
    .order('published_at', { ascending: false })

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
    query = query.contains('region_tags', ['APAC'])
  }
  if (params.level) {
    const levelMap: Record<string, string[]> = {
      entry:   ['%junior%', '%entry%', '%graduate%', '%intern%', '%trainee%'],
      mid:     ['%mid%', '%intermediate%', '%associate%'],
      senior:  ['%senior%', '%sr.%', '%sr %', '%principal%', '%staff %', '%expert%'],
      manager: ['%manager%', '%lead%', '%head of%', '%director%', '%vp %', '%vice president%', '%cto%', '%cpo%'],
    }
    const patterns = levelMap[params.level]
    if (patterns) {
      query = query.or(patterns.map(p => `title.ilike.${p}`).join(','))
    }
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
  const splitAt = Math.ceil(allJobs.length / 2)
  const freeJobs = allJobs.slice(0, splitAt)
  const premiumJobs = allJobs.slice(splitAt)

  return (
    <>
      <div className="hero">
        <h1>Remote jobs that let you<br /><em>live in Asia.</em></h1>
        <p className="hero-sub">
          For remote professionals who've chosen Asia. Hand-picked roles from employers who mean it.
        </p>
        <form action="/jobs" method="get" className="hero-search">
          <input
            type="search"
            name="q"
            placeholder="Search roles, companies..."
            defaultValue={params.q || ''}
            autoComplete="off"
          />
          <button type="submit">Search</button>
        </form>
      </div>

    <main>
      <div className="job-count-bar">
        <span>{allJobs.length} remote jobs</span>
        {params.q && <span>Results for &quot;{params.q}&quot;</span>}
      </div>

      <JobFilters
        categories={(categories || []) as Category[]}
        currentParams={params as { q?: string; category?: string; type?: string; asia?: string; level?: string; posted?: string }}
      />

      <div>
        {freeJobs.map(job => (
          <JobRow key={job.id} job={job} saved={savedIds.has(job.id)} isLoggedIn={!!user} />
        ))}

        {premiumJobs.length > 0 && !isPremium && (
          <>
            <PremiumGate count={premiumJobs.length} />
            {premiumJobs.map(job => (
              <JobRow key={job.id} job={job} locked />
            ))}
          </>
        )}

        {premiumJobs.length > 0 && isPremium && premiumJobs.map(job => (
          <JobRow key={job.id} job={job} saved={savedIds.has(job.id)} isLoggedIn={!!user} />
        ))}

        {allJobs.length === 0 && (
          <div style={{ padding: '48px 24px', color: 'var(--muted)', fontSize: 14 }}>
            No jobs found. Try adjusting your filters.
          </div>
        )}
      </div>
    </main>
    </>
  )
}
