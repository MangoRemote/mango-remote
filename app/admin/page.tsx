import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminJobTable from '@/components/AdminJobTable'
import type { Job } from '@/lib/types'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (userData?.role !== 'admin') redirect('/')

  const { data: jobs } = await supabase
    .from('jobs')
    .select('*, company:companies(*), category:categories(*)')
    .order('created_at', { ascending: false })

  const sevenDaysFromNow = new Date(Date.now() + 7 * 86400000).toISOString()
  const expiringSoon = (jobs || []).filter((j: Job) =>
    j.status === 'live' && j.expires_at && j.expires_at < sevenDaysFromNow
  )

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <a href="/admin" className="active">All Jobs</a>
        <a href="/admin/pending">Pending Review</a>
        <a href="/admin/add-job">Add Job</a>
        <a href="/admin/expiring">Expiring Soon</a>
      </div>

      <div className="admin-content">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 800 }}>Job Management</h1>
          <div style={{ display: 'flex', gap: 10 }}>
            {expiringSoon.length > 0 && (
              <span style={{ fontSize: 12.5, color: '#C2410C', background: '#FFF7ED', padding: '4px 10px', fontWeight: 600 }}>
                {expiringSoon.length} expiring within 7 days
              </span>
            )}
            <a href="/admin/add-job" className="btn-primary" style={{ fontSize: 13, padding: '6px 14px' }}>+ Add Job</a>
          </div>
        </div>

        <AdminJobTable jobs={(jobs || []) as Job[]} />
      </div>
    </div>
  )
}
