import { createClient } from '@/lib/supabase/server'
import JobCard from '@/components/JobRow'
import PremiumGate from '@/components/PremiumGate'
import EmailCapture from '@/components/EmailCapture'
import Link from 'next/link'
import type { Job } from '@/lib/types'

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
  const splitAt = Math.ceil(allJobs.length / 2)
  const freeJobs = allJobs.slice(0, splitAt)
  const premiumJobs = allJobs.slice(splitAt)
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
        <form action="/jobs" method="get" className="hero-filters">
          <select name="category" className="hero-filter-select" onChange="this.form.submit()">
            <option value="">All Categories</option>
            <option value="engineering">Engineering</option>
            <option value="design">Design</option>
            <option value="marketing">Marketing</option>
            <option value="sales">Sales</option>
            <option value="support">Support</option>
            <option value="product">Product</option>
            <option value="finance">Finance</option>
            <option value="hr-recruiting">HR & Recruiting</option>
            <option value="operations">Operations</option>
          </select>
          <select name="level" className="hero-filter-select" onChange="this.form.submit()">
            <option value="">Experience Level</option>
            <option value="entry">Entry Level</option>
            <option value="mid">Mid Level</option>
            <option value="senior">Senior</option>
            <option value="manager">Manager / Lead</option>
          </select>
          <select name="posted" className="hero-filter-select" onChange="this.form.submit()">
            <option value="">Any Time</option>
            <option value="1">Last 24 hours</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
          </select>
          <select name="type" className="hero-filter-select" onChange="this.form.submit()">
            <option value="">Job Type</option>
            <option value="full-time">Full-time</option>
            <option value="contract">Contract</option>
            <option value="part-time">Part-time</option>
          </select>
        </form>
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
