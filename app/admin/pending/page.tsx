import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminJobTable from '@/components/AdminJobTable'
import type { Job } from '@/lib/types'

export default async function PendingJobsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')
  const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (userData?.role !== 'admin') redirect('/')

  const { data: jobs } = await supabase
    .from('jobs')
    .select('*, company:companies(*), category:categories(*)')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <a href="/admin">All Jobs</a>
        <a href="/admin/pending" className="active">Pending Review</a>
        <a href="/admin/add-job">Add Job</a>
        <a href="/admin/expiring">Expiring Soon</a>
      </div>
      <div className="admin-content">
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 800, marginBottom: 24 }}>
          Pending Review ({jobs?.length || 0})
        </h1>
        {jobs?.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>No jobs pending review.</p>
        ) : (
          <AdminJobTable jobs={(jobs || []) as Job[]} />
        )}
      </div>
    </div>
  )
}
