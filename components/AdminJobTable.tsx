'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { Job } from '@/lib/types'

interface Props { jobs: Job[] }

export default function AdminJobTable({ jobs: initialJobs }: Props) {
  const [jobs, setJobs] = useState(initialJobs)
  const router = useRouter()

  const update = async (id: string, patch: Partial<Job>) => {
    const supabase = createClient()
    await supabase.from('jobs').update(patch).eq('id', id)
    setJobs(prev => prev.map(j => j.id === id ? { ...j, ...patch } : j))
  }

  const deleteJob = async (id: string) => {
    if (!confirm('Delete this job?')) return
    const supabase = createClient()
    await supabase.from('jobs').delete().eq('id', id)
    setJobs(prev => prev.filter(j => j.id !== id))
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Company</th>
            <th>Status</th>
            <th>Premium</th>
            <th>Featured</th>
            <th>Asia</th>
            <th>Expires</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map(job => {
            const company = Array.isArray(job.company) ? job.company[0] : job.company
            const expires = job.expires_at ? new Date(job.expires_at).toLocaleDateString('en-GB') : '—'
            const expiringSoon = job.expires_at && new Date(job.expires_at).getTime() < Date.now() + 7 * 86400000 && job.status === 'live'
            return (
              <tr key={job.id}>
                <td>
                  <a href={`/admin/edit-job/${job.id}`} style={{ fontWeight: 500, fontSize: 13 }}>{job.title}</a>
                </td>
                <td style={{ color: 'var(--muted)' }}>{company?.name}</td>
                <td>
                  <select
                    className="filter-select"
                    value={job.status}
                    onChange={e => update(job.id, { status: e.target.value as Job['status'] })}
                    style={{ fontSize: 12, padding: '3px 20px 3px 8px' }}
                  >
                    <option value="draft">Draft</option>
                    <option value="pending">Pending</option>
                    <option value="live">Live</option>
                    <option value="expired">Expired</option>
                  </select>
                </td>
                <td>
                  <input type="checkbox" checked={job.is_premium} onChange={e => update(job.id, { is_premium: e.target.checked })} />
                </td>
                <td>
                  <input type="checkbox" checked={job.is_featured} onChange={e => update(job.id, { is_featured: e.target.checked })} />
                </td>
                <td>
                  <input type="checkbox" checked={job.asia_friendly} onChange={e => update(job.id, { asia_friendly: e.target.checked })} />
                </td>
                <td style={{ color: expiringSoon ? '#C2410C' : 'var(--muted)', fontSize: 12.5 }}>{expires}</td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <a href={`/admin/edit-job/${job.id}`} style={{ fontSize: 12.5, color: 'var(--muted)' }}>Edit</a>
                    <button onClick={() => deleteJob(job.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12.5, color: '#dc2626' }}>Delete</button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
