import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Map source category strings to our category names
const CATEGORY_MAP: Record<string, string> = {
  'software-dev': 'Engineering',
  'programming': 'Engineering',
  'engineering': 'Engineering',
  'devops-sysadmin': 'Engineering',
  'design': 'Design',
  'product': 'Product',
  'marketing': 'Marketing',
  'sales': 'Sales',
  'customer-support': 'Support',
  'customer-service': 'Support',
  'hr': 'HR & Recruiting',
  'recruiting': 'HR & Recruiting',
  'finance': 'Finance',
  'management': 'Management',
  'operations': 'Operations',
  'project-management': 'Project Management',
  'all-others': 'Operations',
  'writing': 'Marketing',
  'business': 'Operations',
  'qa': 'Engineering',
  'data': 'Engineering',
}

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function uniqueSlug(base: string) {
  return slugify(base) + '-' + Math.random().toString(36).slice(2, 6)
}

// Region tags based on job location field
function getRegionTags(location: string): string[] {
  const l = location.toLowerCase()
  if (l.includes('asia') || l.includes('apac')) return ['APAC']
  if (l.includes('worldwide') || l.includes('anywhere') || l.includes('global')) return ['Worldwide']
  if (l.includes('europe')) return ['Europe']
  if (l.includes('usa') || l.includes('us only') || l.includes('united states')) return ['USA only']
  return ['Worldwide']
}

async function getCategoryId(name: string): Promise<string | null> {
  const { data } = await supabase
    .from('categories')
    .select('id')
    .ilike('name', name)
    .single()
  return data?.id ?? null
}

async function getOrCreateCompany(name: string, website?: string, logoUrl?: string): Promise<string | null> {
  const slug = slugify(name)
  const { data: existing } = await supabase
    .from('companies')
    .select('id')
    .eq('slug', slug)
    .single()
  if (existing) return existing.id

  const { data } = await supabase
    .from('companies')
    .insert({ name, slug, website: website || null, logo_url: logoUrl || null, verified: false })
    .select('id')
    .single()
  return data?.id ?? null
}

async function jobExists(applyUrl: string): Promise<boolean> {
  const { data } = await supabase
    .from('jobs')
    .select('id')
    .eq('apply_url', applyUrl)
    .single()
  return !!data
}

// ── Remotive ────────────────────────────────────────────────────────────────
async function fetchRemotive(): Promise<number> {
  const res = await fetch('https://remotive.com/api/remote-jobs?limit=100')
  if (!res.ok) return 0
  const { jobs } = await res.json()
  let count = 0

  for (const job of jobs) {
    if (await jobExists(job.url)) continue

    const categoryName = CATEGORY_MAP[job.category?.toLowerCase().replace(/\s+/g, '-')] || 'Operations'
    const categoryId = await getCategoryId(categoryName)
    const companyId = await getOrCreateCompany(job.company_name, job.company_url, job.company_logo)
    if (!companyId) continue

    const regionTags = getRegionTags(job.candidate_required_location || 'Worldwide')

    await supabase.from('jobs').insert({
      title: job.title,
      slug: uniqueSlug(job.title),
      company_id: companyId,
      description: job.description,
      apply_url: job.url,
      category_id: categoryId,
      employment_type: job.job_type?.includes('contract') ? 'contract' : 'full-time',
      region_tags: regionTags,
      salary_currency: 'USD',
      is_premium: true,
      is_featured: false,
      status: 'live',
      source: 'remotive',
      asia_friendly: true,
      published_at: job.publication_date || new Date().toISOString(),
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    })
    count++
  }
  return count
}

// ── RemoteOK ────────────────────────────────────────────────────────────────
async function fetchRemoteOK(): Promise<number> {
  const res = await fetch('https://remoteok.com/api', {
    headers: { 'User-Agent': 'MangoRemote/1.0 (hello@mangoremote.com)' },
  })
  if (!res.ok) return 0
  const data = await res.json()
  const jobs = data.slice(1) // first item is metadata
  let count = 0

  for (const job of jobs) {
    if (!job.url || !job.company || !job.position) continue
    const applyUrl = `https://remoteok.com${job.url}`
    if (await jobExists(applyUrl)) continue

    // Map tags to category
    const tags: string[] = job.tags || []
    let categoryName = 'Engineering'
    for (const tag of tags) {
      const mapped = CATEGORY_MAP[tag.toLowerCase()]
      if (mapped) { categoryName = mapped; break }
    }
    if (tags.some((t: string) => ['marketing', 'growth', 'seo'].includes(t.toLowerCase()))) categoryName = 'Marketing'
    if (tags.some((t: string) => ['design', 'ui', 'ux'].includes(t.toLowerCase()))) categoryName = 'Design'
    if (tags.some((t: string) => ['sales', 'account'].includes(t.toLowerCase()))) categoryName = 'Sales'
    if (tags.some((t: string) => ['support', 'customer'].includes(t.toLowerCase()))) categoryName = 'Support'

    const categoryId = await getCategoryId(categoryName)
    const companyId = await getOrCreateCompany(
      job.company,
      undefined,
      job.company_logo || null
    )
    if (!companyId) continue

    const location = [job.location, ...(job.tags || [])].join(' ')
    const regionTags = getRegionTags(location)

    await supabase.from('jobs').insert({
      title: job.position,
      slug: uniqueSlug(job.position),
      company_id: companyId,
      description: job.description || '',
      apply_url: applyUrl,
      category_id: categoryId,
      employment_type: 'full-time',
      region_tags: regionTags,
      salary_min: job.salary_min ? Number(job.salary_min) : null,
      salary_max: job.salary_max ? Number(job.salary_max) : null,
      salary_currency: 'USD',
      is_premium: true,
      is_featured: false,
      status: 'live',
      source: 'remoteok',
      asia_friendly: true,
      published_at: job.date || new Date().toISOString(),
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    })
    count++
  }
  return count
}

export async function GET(request: Request) {
  // Protect the cron endpoint
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const [remotive, remoteok] = await Promise.all([
      fetchRemotive(),
      fetchRemoteOK(),
    ])
    return NextResponse.json({ ok: true, added: { remotive, remoteok, total: remotive + remoteok } })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
