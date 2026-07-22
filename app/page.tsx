import { createClient } from '@/lib/supabase/server'
import JobRow from '@/components/JobRow'
import PremiumGate from '@/components/PremiumGate'
import Link from 'next/link'
import type { Job } from '@/lib/types'

export const revalidate = 60

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

  return (
    <main>
      <div className="hero">
        <h1>Remote jobs that let you live in Asia.</h1>
        <p className="hero-sub">
          Work from Bangkok, Bali, Vietnam — somewhere you&apos;re never far from a fresh mango smoothie.
        </p>
        <form action="/jobs" method="get" style={{ display: 'flex', gap: 8 }}>
          <input
            type="search"
            name="q"
            className="search-input"
            placeholder="Search roles, companies..."
            style={{ width: 300 }}
          />
          <button type="submit" className="btn-primary">Search</button>
        </form>
      </div>

      <div className="job-count-bar">
        <span>{count || allJobs.length} remote jobs live now</span>
        <Link href="/jobs" style={{ fontSize: 13, color: 'var(--muted)' }}>View all →</Link>
      </div>

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
      </div>

      <div className="email-capture">
        <h3>New Asia-friendly jobs, weekly.</h3>
        <p>Get the latest remote roles that work across GMT+7 and GMT+8 delivered to your inbox.</p>
        <form className="email-form" action="/api/subscribe" method="post">
          <input type="email" name="email" placeholder="your@email.com" required />
          <button type="submit" className="btn-primary">Subscribe</button>
        </form>
      </div>
    </main>
  )
}
