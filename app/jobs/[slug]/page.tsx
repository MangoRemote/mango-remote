import { createClient } from '@/lib/supabase/server'
import { hasPremiumAccess } from '@/lib/access'
import Link from 'next/link'
import Script from 'next/script'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string }>
}

const EMPLOYMENT_TYPES: Record<string, string> = {
  'full-time': 'FULL_TIME', 'part-time': 'PART_TIME', 'contract': 'CONTRACTOR',
  'freelance': 'CONTRACTOR', 'temporary': 'TEMPORARY', 'internship': 'INTERN',
}

function employmentTypeFor(raw: string | null): string {
  return EMPLOYMENT_TYPES[(raw || '').toLowerCase()] || 'FULL_TIME'
}

const COUNTRY_NAMES = ['Japan', 'Vietnam', 'Thailand', 'Indonesia', 'Philippines', 'Malaysia', 'Singapore', 'South Korea', 'Taiwan', 'Hong Kong', 'China', 'Cambodia', 'Myanmar', 'Sri Lanka', 'India', 'Australia', 'Canada', 'United States', 'United Kingdom', 'Ireland', 'Poland', 'Mexico']

function countriesFor(tags: string[] | null) {
  const found = (tags || []).filter(t => COUNTRY_NAMES.includes(t))
  return found.length ? found.map(name => ({ '@type': 'Country', name })) : undefined
}

const LIFETIME_MS = 35 * 24 * 60 * 60 * 1000

async function loadJob(slug: string) {
  const supabase = await createClient()
  const { data: job } = await supabase
    .from('jobs')
    .select('*, company:companies(*), category:categories(*)')
    .eq('slug', slug)
    .single()

  if (!job) return null
  if (new Date(job.published_at).getTime() < Date.now() - LIFETIME_MS) return null
  return job
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const job = await loadJob(slug)

  if (!job) {
    return { title: 'Job not found' }
  }

  const description = job.is_premium
    ? 'Premium remote job on MangoRemote'
    : job.description?.substring(0, 160) || 'Remote job opportunity'

  return {
    title: `${job.title} at ${job.company?.name} — MangoRemote`,
    description,
    alternates: { canonical: `https://mangoremote.com/jobs/${job.slug}` },
    openGraph: {
      title: `${job.title} — MangoRemote`,
      description,
      type: 'website',
    },
  }
}

export default async function JobDetailPage({ params }: Props) {
  const { slug } = await params
  const job = await loadJob(slug)

  if (!job) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const hasAccess = await hasPremiumAccess(supabase, user?.id)
  const locked = job.is_premium && !hasAccess

  const daysOld = Math.floor((Date.now() - new Date(job.published_at).getTime()) / 86400000)
  const isExpired = job.expires_at && new Date(job.expires_at) < new Date()
  const isOldPosting = daysOld > 30

  const jobPostingSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": locked ? job.title : job.description?.substring(0, 500) || job.title,
    "url": `https://mangoremote.com/jobs/${job.slug}`,
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.company?.name || "Unknown Company"
    },
    "jobLocationType": "TELECOMMUTE",
    "applicantLocationRequirements": countriesFor(job.region_tags),
    "employmentType": employmentTypeFor(job.employment_type),
    "datePosted": job.published_at,
    "validThrough": job.expires_at || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  }

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 28px' }}>
      <Script
        id="job-posting-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }}
      />
      {isOldPosting && <div style={{ background: '#FEE2E2', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', color: '#7F1D1D', fontWeight: '500' }}>⚠️ This job posting is expired and will be removed soon. It may no longer be active.</div>}
      {isExpired && <div style={{ background: '#FEE2E2', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', color: '#7F1D1D', fontWeight: '500' }}>⚠️ This job has expired.</div>}

      <Link href="/jobs" style={{ color: '#F26419', fontSize: '13px' }}>← Back</Link>
      <h1 style={{ fontSize: 'clamp(28px, 6vw, 44px)', fontWeight: '800', margin: '16px 0 8px' }}>{job.title}</h1>
      <p style={{ fontSize: '15px', color: '#3D4451', marginBottom: '24px' }}>{job.company?.name} {job.category?.name && `• ${job.category.name}`}</p>

      {locked ? (
        <div style={{ background: '#F9FAFB', padding: '24px', borderRadius: '10px', marginBottom: '32px', border: '1px solid #E8EAED' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>Premium job</h2>
          <p style={{ fontSize: '15px', lineHeight: '1.6', marginBottom: '16px' }}>
            The full description and application link are available to Premium members.
          </p>
          <Link href="/premium" style={{ background: '#F26419', color: '#fff', padding: '12px 28px', borderRadius: '6px', fontSize: '15px', fontWeight: '600', textDecoration: 'none', display: 'inline-block' }}>
            See Premium plans →
          </Link>
        </div>
      ) : (
        <>
          <div style={{ background: '#F9FAFB', padding: '24px', borderRadius: '10px', marginBottom: '32px', border: '1px solid #E8EAED' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>About this role</h2>
            <div style={{ fontSize: '15px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{job.description}</div>
          </div>

          <a href={job.apply_url} target="_blank" rel="noopener noreferrer" style={{ background: '#F26419', color: '#fff', padding: '12px 28px', borderRadius: '6px', fontSize: '15px', fontWeight: '600', textDecoration: 'none', display: 'inline-block', marginBottom: '32px' }}>
            Apply now →
          </a>
          <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '-20px', marginBottom: '32px' }}>You apply on the employer's website. MangoRemote does not employ or guarantee this role.</p>
        </>
      )}

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
      <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '16px' }}>
        Something wrong with this listing? <a href={`mailto:hello@mangoremote.com?subject=${encodeURIComponent('Report job: ' + job.title + ' (' + job.slug + ')')}`} style={{ color: '#F26419' }}>Report it</a>.
      </p>
    </main>
  )
}
