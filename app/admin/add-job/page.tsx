import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminJobForm from '@/components/AdminJobForm'
import type { Category, Company } from '@/lib/types'

export default async function AddJobPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')
  const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (userData?.role !== 'admin') redirect('/')

  const [{ data: categories }, { data: companies }] = await Promise.all([
    supabase.from('categories').select('*').order('name'),
    supabase.from('companies').select('*').order('name'),
  ])

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <a href="/admin">All Jobs</a>
        <a href="/admin/pending">Pending Review</a>
        <a href="/admin/add-job" className="active">Add Job</a>
        <a href="/admin/expiring">Expiring Soon</a>
      </div>
      <div className="admin-content">
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 800, marginBottom: 24 }}>Add Job</h1>
        <AdminJobForm
          categories={(categories || []) as Category[]}
          companies={(companies || []) as Company[]}
        />
      </div>
    </div>
  )
}
