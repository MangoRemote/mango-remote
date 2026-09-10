import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: job } = await supabase
    .from('jobs')
    .select('*, company:companies(*), category:categories(*)')
    .eq('slug', slug)
    .single()

  if (!job) {
    return { title: 'Job not found' }
  }

  const description = job.description?.substring(0, 160) || 'Remote job opportunity'

  return {
    title: `${job.title} at ${job.company?.name} — MangoRemote`,
    description,
    openGraph: {
      title: `${job.title} — MangoRemote`,
      description,
      type: 'website',
    },
  }
}

export default async function JobDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: job } = await supabase
    .from('jobs')
    .select('*, company:companies(*), category:categories(*)')
    .eq('slug', slug)
    .single()

  if (!job) {
    return (
      <main style={{ padding: '40px 28px', textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
        <h1>Job not found</h1>
        <p>This job may have expired or been removed.</p>
        <Link href="/jobs">← Back to all jobs</Link>
      </main>
    )
  }

  const isExpired = job.expires_at && new Date(job.expires_at) < new Date()

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 28px' }}>
      {isExpired && <div style={{ background: '#fef3c7', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', color: '#92400e' }}>⚠️ This job has expired.</div>}
      
      <Link href="/jobs" style={{ color: '#F26419', fontSize: '13px' }}>← Back</Link>
      <h1 style={{ fontSize: '44px', fontWeight: '800', margin: '16px 0 8px' }}>{job.title}</h1>
      <p style={{ fontSize: '15px', color: '#3D4451', marginBottom: '24px' }}>{job.company?.name} {job.category?.name && `• ${job.category.name}`}</p>

      <div style={{ background: '#F9FAFB', padding: '24px', borderRadius: '10px', marginBottom: '32px', border: '1px solid #E8EAED' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>About this role</h2>
        <div style={{ fontSize: '15px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{job.description}</div>
      </div>

      <a href={job.apply_url} target="_blank" rel="noopener noreferrer" style={{ background: '#F26419', color: '#fff', padding: '12px 28px', borderRadius: '6px', fontSize: '15px', fontWeight: '600', textDecoration: 'none', display: 'inline-block', marginBottom: '32px' }}>
        Apply now →
      </a>

      <div style={{ padding: '24px', background: '#F9FAFB', borderRadius: '10px', border: '1px solid #E8EAED' }}>
        <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#6B7280', marginBottom: '12px', textTransform: 'uppercase' }}>Job details</h3>
        <ul style={{ fontSize: '13px', color: '#3D4451', lineHeight: '1.8' }}>
          {job.company?.name && <li><strong>Company:</strong> {job.company.name}</li>}
          {job.employment_type && <li><strong>Type:</strong> {job.employment_type}</li>}
          {job.category?.name && <li><strong>Category:</strong> {job.category.name}</li>}
          <li><strong>Posted:</strong> {new Date(job.published_at).toLocaleDateString()}</li>
          {job.expires_at && <li><strong>Expires:</strong> {new Date(job.expires_at).toLocaleDateString()}</li>}
        </ul>
      </div>
    </main>
  )
}
