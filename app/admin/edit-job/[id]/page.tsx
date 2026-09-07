import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminJobForm from '@/components/AdminJobForm'
import type { Category, Company } from '@/lib/types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditJobPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')
  const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (userData?.role !== 'admin') redirect('/')

  const [{ data: job }, { data: categories }, { data: companies }] = await Promise.all([
    supabase.from('jobs').select('*').eq('id', id).single(),
    supabase.from('categories').select('*').order('name'),
    supabase.from('companies').select('*').order('name'),
  ])

  if (!job) redirect('/admin')

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <a href="/admin">All Jobs</a>
        <a href="/admin/pending">Pending Review</a>
        <a href="/admin/add-job">Add Job</a>
        <a href="/admin/expiring">Expiring Soon</a>
      </div>
      <div className="admin-content">
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 800, marginBottom: 24 }}>Edit Job</h1>
        <AdminJobForm
          categories={(categories || []) as Category[]}
          companies={(companies || []) as Company[]}
          initialJob={job}
        />
      </div>
    </div>
  )
}
