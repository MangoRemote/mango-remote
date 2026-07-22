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
  searchParams: Promise<{ q?: string; category?: string; type?: string; region?: string; asia?: string }>
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
    .order('is_featured', { ascending: false })
    .order('published_at', { ascending: false })

  if (params.q) {
    query = query.or(`title.ilike.%${params.q}%,description.ilike.%${params.q}%`)
  }
  if (params.category) {
    const { data: cat } = await supabase.from('categories').select('id').eq('slug', params.category).single()
    if (cat) query = query.eq('category_id', cat.id)
  }
  if (params.type) {
    query = query.eq('employment_type', params.type)
  }
  if (params.asia === '1') {
    query = query.eq('asia_friendly', true)
  }

  const { data: jobs } = await query
  const { data: categories } = await supabase.from('categories').select('*').order('name')

  const allJobs = (jobs || []) as Job[]
  const splitAt = Math.ceil(allJobs.length / 2)
  const freeJobs = allJobs.slice(0, splitAt)
  const premiumJobs = allJobs.slice(splitAt)

  return (
    <main>
      <div className="job-count-bar">
        <span>{allJobs.length} remote jobs</span>
        {params.q && <span>Results for &quot;{params.q}&quot;</span>}
      </div>

      <JobFilters
        categories={(categories || []) as Category[]}
        currentParams={params}
      />

      <div>
        {freeJobs.map(job => (
          <JobRow key={job.id} job={job} />
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
          <JobRow key={job.id} job={job} />
        ))}

        {allJobs.length === 0 && (
          <div style={{ padding: '48px 24px', color: 'var(--muted)', fontSize: 14 }}>
            No jobs found. Try adjusting your filters.
          </div>
        )}
      </div>
    </main>
  )
}
