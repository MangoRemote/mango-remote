import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminJobTable from '@/components/AdminJobTable'
import type { Job } from '@/lib/types'

export default async function ExpiringJobsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')
  const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (userData?.role !== 'admin') redirect('/')

  const sevenDaysFromNow = new Date(Date.now() + 7 * 86400000).toISOString()

  const { data: jobs } = await supabase
    .from('jobs')
    .select('*, company:companies(*), category:categories(*)')
    .eq('status', 'live')
    .lte('expires_at', sevenDaysFromNow)
    .order('expires_at', { ascending: true })

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <a href="/admin">All Jobs</a>
        <a href="/admin/pending">Pending Review</a>
        <a href="/admin/add-job">Add Job</a>
        <a href="/admin/expiring" className="active">Expiring Soon</a>
      </div>
      <div className="admin-content">
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 800, marginBottom: 24 }}>
          Expiring within 7 days ({jobs?.length || 0})
        </h1>
        {jobs?.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>No jobs expiring soon.</p>
        ) : (
          <AdminJobTable jobs={(jobs || []) as Job[]} />
        )}
      </div>
    </div>
  )
}
