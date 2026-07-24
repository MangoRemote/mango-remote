import { createClient } from '@/lib/supabase/server'
import JobCard from '@/components/JobRow'
import PremiumGate from '@/components/PremiumGate'
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
          Bangkok, Bali, Vietnam — hand-picked roles compatible with GMT+7 &amp; GMT+8.
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
        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-num">{total}</span>
            <span className="hero-stat-label">Live jobs</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-num">GMT+7/8</span>
            <span className="hero-stat-label">Asia-friendly</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-num">Daily</span>
            <span className="hero-stat-label">Updated</span>
          </div>
        </div>
      </div>

      <div className="page-layout">
        <aside className="sidebar">
          <div className="sidebar-section">
            <span className="sidebar-label">Search</span>
            <form action="/jobs" method="get">
              <input
                type="search"
                name="q"
                className="sidebar-search"
                placeholder="Title, keyword..."
              />
            </form>
          </div>

          <div className="sidebar-section">
            <span className="sidebar-label">Category</span>
            <div className="sidebar-options">
              {CATEGORIES.map(cat => (
                <Link
                  key={cat}
                  href={cat === 'All Jobs' ? '/jobs' : `/jobs?category=${encodeURIComponent(cat)}`}
                  className="sidebar-option"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <span className="sidebar-label">Region</span>
            <div className="sidebar-options">
              <Link href="/jobs" className="sidebar-option">All Regions</Link>
              <Link href="/jobs?region=asia" className="sidebar-option">🌏 Asia-friendly</Link>
              <Link href="/jobs?region=worldwide" className="sidebar-option">Worldwide</Link>
            </div>
          </div>

          <div className="sidebar-section">
            <span className="sidebar-label">Type</span>
            <div className="sidebar-options">
              <Link href="/jobs" className="sidebar-option">All Types</Link>
              <Link href="/jobs?type=full-time" className="sidebar-option">Full-time</Link>
              <Link href="/jobs?type=contract" className="sidebar-option">Contract</Link>
              <Link href="/jobs?type=part-time" className="sidebar-option">Part-time</Link>
            </div>
          </div>
        </aside>

        <main className="main-content">
          <div className="jobs-header">
            <span className="jobs-count"><strong>{total}</strong> remote jobs</span>
            <select className="jobs-sort">
              <option>Most recent</option>
              <option>Featured first</option>
            </select>
          </div>

          {freeJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}

          {premiumJobs.length > 0 && !isPremium && (
            <>
              <PremiumGate count={premiumJobs.length} />
              {premiumJobs.map(job => (
                <JobCard key={job.id} job={job} locked />
              ))}
            </>
          )}

          {premiumJobs.length > 0 && isPremium && premiumJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}

          <div className="email-capture">
            <h3>New Asia-friendly jobs, weekly.</h3>
            <p>Get the latest remote roles that work across GMT+7 and GMT+8 delivered to your inbox.</p>
            <form className="email-form" action="/api/subscribe" method="post">
              <input type="email" name="email" placeholder="your@email.com" required />
              <button type="submit">Subscribe free</button>
            </form>
          </div>
        </main>
      </div>
    </>
  )
}
