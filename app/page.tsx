export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import JobCard from '@/components/JobRow'
import PremiumGate from '@/components/PremiumGate'
import EmailCapture from '@/components/EmailCapture'
import HeroFilters from '@/components/HeroFilters'
import Link from 'next/link'
import type { Job } from '@/lib/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MangoRemote — Remote Jobs That Let You Live in Asia',
  description: 'Find remote jobs compatible with living in Thailand, Japan, Vietnam, and across Asia. Every role vetted for timezone flexibility.',
}

export const revalidate = 60

const CATEGORIES = [
  'All Jobs', 'Engineering', 'Design', 'Marketing', 'Sales',
  'Customer Support', 'Product', 'Finance', 'HR', 'Operations',
]

export default async function HomePage() {
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

  const { data: jobs, count } = await supabase
    .from('jobs')
    .select('*, company:companies(*), category:categories(*)', { count: 'exact' })
    .eq('status', 'live')
    .order('is_featured', { ascending: false })
    .order('published_at', { ascending: false })

  const allJobs = (jobs || []) as Job[]
  const freeJobs = allJobs.filter(j => !j.is_premium)
  const premiumJobs = allJobs.filter(j => j.is_premium)
  const total = count || allJobs.length

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
            autoComplete="off"
          />
          <button type="submit">Search</button>
        </form>
        <HeroFilters />
      </div>


      <main className="main-content">
        <div className="jobs-header">
          <h2 className="jobs-heading">Remote Jobs <span className="jobs-count">{total} jobs</span></h2>
          <select className="jobs-sort">
            <option>Most recent</option>
            <option>Featured first</option>
          </select>
        </div>

        {freeJobs.map(job => (
          <JobCard key={job.id} job={job} />
        ))}

        {premiumJobs.length > 0 && !isPremium && (
          <PremiumGate count={premiumJobs.length} />
        )}

        {premiumJobs.length > 0 && isPremium && premiumJobs.map(job => (
          <JobCard key={job.id} job={job} />
        ))}

        <EmailCapture />
      </main>
    </>
  )
}
