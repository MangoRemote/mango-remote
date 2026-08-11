import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Remotive returns full strings e.g. "Software Development", "Sales"
const REMOTIVE_CATEGORY_MAP: Record<string, string> = {
  'software development': 'Engineering',
  'devops / sysadmin': 'Engineering',
  'devops': 'Engineering',
  'information technology': 'Engineering',
  'design': 'Design',
  'product': 'Product',
  'marketing': 'Marketing',
  'sales': 'Sales',
  'customer service': 'Support',
  'customer support': 'Support',
  'finance / legal': 'Finance',
  'finance': 'Finance',
  'legal': 'Legal',
  'hr': 'HR & Recruiting',
  'human resources': 'HR & Recruiting',
  'data': 'Data',
  'data and analytics': 'Data',
  'writing': 'Writing',
  'management': 'Management',
  'operations': 'Operations',
  'project management': 'Project Management',
  'business development': 'Sales',
  'medical': 'Healthcare',
  'healthcare': 'Healthcare',
  'education': 'Operations',
  'all others': 'Operations',
}

// Working Nomads returns "Development", "Administration", etc.
const WN_CATEGORY_MAP: Record<string, string> = {
  'development': 'Engineering',
  'design': 'Design',
  'marketing': 'Marketing',
  'sales': 'Sales',
  'customer success': 'Support',
  'customer support': 'Support',
  'support': 'Support',
  'management': 'Management',
  'administration': 'Operations',
  'operations': 'Operations',
  'finance': 'Finance',
  'legal': 'Legal',
  'hr': 'HR & Recruiting',
  'human resources': 'HR & Recruiting',
  'data': 'Data',
  'writing': 'Writing',
  'project management': 'Project Management',
  'product': 'Product',
  'education': 'Operations',
  'consulting': 'Operations',
}

const JUNK_TITLE_PATTERNS = [
  /\b(labourer|laborer|barista|driver|porter|cleaner|cashier|chef|cook|waiter|waitress|bartender|security guard|janitor|plumber|electrician|carpenter)\b/i,
  /your job (title|description|here)/i,
  /page not found/i,
  /untitled/i,
  /test job/i,
]

function isSuspiciousTitle(title: string): boolean {
  if (!title || title.length < 3 || title.length > 120) return true
  return JUNK_TITLE_PATTERNS.some(p => p.test(title))
}

function isValidDescription(desc: string | null | undefined): boolean {
  if (!desc) return false
  const stripped = desc.replace(/<[^>]+>/g, '').trim()
  return stripped.length >= 100
}

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function uniqueSlug(base: string) {
  return slugify(base) + '-' + Math.random().toString(36).slice(2, 6)
}

// Specific Asian countries mapped to display name
const ASIAN_COUNTRY_MAP: [RegExp, string][] = [
  [/\bjapan\b/i, 'Japan'],
  [/\bvietnam\b/i, 'Vietnam'],
  [/\bthailand\b/i, 'Thailand'],
  [/\bindonesia\b/i, 'Indonesia'],
  [/\bphilippines\b/i, 'Philippines'],
  [/\bmalaysia\b/i, 'Malaysia'],
  [/\bsingapore\b/i, 'Singapore'],
  [/\bsouth korea\b|\bkorea\b/i, 'South Korea'],
  [/\btaiwan\b/i, 'Taiwan'],
  [/\bhong kong\b/i, 'Hong Kong'],
  [/\bchina\b/i, 'China'],
  [/\bcambodia\b/i, 'Cambodia'],
  [/\bmyanmar\b/i, 'Myanmar'],
  [/\blaos\b/i, 'Laos'],
  [/\bsri lanka\b/i, 'Sri Lanka'],
  [/\bnepal\b/i, 'Nepal'],
  [/\bbangladesh\b/i, 'Bangladesh'],
  [/\bindia\b/i, 'India'],
]

// General Asia/APAC keywords
const APAC_KEYWORDS = ['asia', 'apac', 'southeast asia', 'east asia', 'asia pacific', 'asia-pacific']

// Locations that mean the job is NOT suitable for this site
const EXCLUDE_LOCATION_PATTERNS = [
  /^australia$/i, /^canada$/i, /^usa$/i, /^united states$/i,
  /^new zealand$/i, /^south africa$/i, /^brazil$/i, /^mexico$/i,
  /\busa only\b/i, /\bus only\b/i, /\bunited states only\b/i,
  /\bcanada only\b/i, /\buk only\b/i, /\baustralia only\b/i,
  /\bnew zealand only\b/i, /\bnorth america\b/i, /\beurope\b/i,
  /\bcet\b/i, /\beet\b/i, /\bemea\b/i,
  /\b(texas|oklahoma|florida|california|new york)\b/i,
]

function getRegionTags(location: string): string[] | null {
  const l = (location || '').trim()
  if (!l) return ['Worldwide']
  const ll = l.toLowerCase()

  // Worldwide / no restriction
  if (!l || ll.includes('worldwide') || ll.includes('anywhere') || ll.includes('global') ||
      ll.includes('international') || ll === 'remote') return ['Worldwide']

  // Specific Asian country
  for (const [pattern, name] of ASIAN_COUNTRY_MAP) {
    if (pattern.test(l)) return [name]
  }

  // General APAC/Asia region
  if (APAC_KEYWORDS.some(k => ll.includes(k))) return ['APAC']

  // Anything Europe or non-Asia specific — exclude
  if (EXCLUDE_LOCATION_PATTERNS.some(p => p.test(l))) return null

  // Default — assume worldwide
  return ['Worldwide']
}

async function getCategoryId(name: string): Promise<string | null> {
  const { data } = await getSupabase().from('categories').select('id').ilike('name', name).single()
  return data?.id ?? null
}

async function getOrCreateCompany(name: string, website?: string, logoUrl?: string): Promise<string | null> {
  const { data: existing } = await getSupabase().from('companies').select('id').eq('name', name).single()
  if (existing) return existing.id
  const slug = slugify(name)
  const { data } = await getSupabase()
    .from('companies')
    .insert({ name, slug, website: website || null, logo_url: logoUrl || null, verified: false })
    .select('id')
    .single()
  return data?.id ?? null
}

async function jobExists(applyUrl: string, title?: string, companyName?: string): Promise<boolean> {
  const { data: byUrl } = await getSupabase().from('jobs').select('id').eq('apply_url', applyUrl).maybeSingle()
  if (byUrl) return true
  if (title && companyName) {
    const { data: byTitle } = await getSupabase()
      .from('jobs')
      .select('id, company:companies(name)')
      .ilike('title', title)
      .limit(1)
    const match = byTitle?.[0]
    const co = match?.company as unknown as { name: string } | null
    if (co?.name === companyName) return true
  }
  return false
}

async function fetchRemotive(): Promise<number> {
  const res = await fetch('https://remotive.com/api/remote-jobs?limit=200')
  if (!res.ok) return 0
  const { jobs } = await res.json()
  let count = 0

  for (const job of jobs) {
    if (isSuspiciousTitle(job.title)) continue
    if (!isValidDescription(job.description)) continue
    if (await jobExists(job.url, job.title, job.company_name)) continue

    const regionTags = getRegionTags(job.candidate_required_location || '')
    if (!regionTags) continue

    const categoryName = REMOTIVE_CATEGORY_MAP[(job.category || '').toLowerCase().trim()] || 'Operations'
    const categoryId = await getCategoryId(categoryName)
    const companyId = await getOrCreateCompany(job.company_name, job.company_url, job.company_logo)
    if (!companyId) continue

    await getSupabase().from('jobs').insert({
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

async function fetchWorkingNomads(): Promise<number> {
  // Fetch APAC/Asia and Worldwide ("work from anywhere") endpoints separately
  // so we can tag jobs correctly based on which list they came from.
  const [resWorldwide, resApac, resAsia] = await Promise.all([
    fetch('https://www.workingnomads.com/api/exposed_jobs/?limit=500&location=worldwide'),
    fetch('https://www.workingnomads.com/api/exposed_jobs/?limit=500&location=apac'),
    fetch('https://www.workingnomads.com/api/exposed_jobs/?limit=500&location=asia'),
  ])

  const worldwide: { url: string }[] = resWorldwide.ok ? await resWorldwide.json() : []
  const apac: { url: string }[] = resApac.ok ? await resApac.json() : []
  const asia: { url: string }[] = resAsia.ok ? await resAsia.json() : []

  // Tag each job by its source endpoint, dedup by URL
  const seen = new Set<string>()
  type TaggedJob = { job: Record<string, string>; regionTags: string[] }
  const tagged: TaggedJob[] = []

  const apacUrls = new Set([...apac, ...asia].map((j) => j.url))

  for (const j of [...apac, ...asia, ...worldwide]) {
    const job = j as Record<string, string>
    if (!job.url || seen.has(job.url)) continue
    seen.add(job.url)
    tagged.push({ job, regionTags: apacUrls.has(job.url) ? ['APAC'] : ['Worldwide'] })
  }

  let count = 0

  for (const { job, regionTags } of tagged) {
    if (!job.url || !job.company_name || !job.title) continue
    if (isSuspiciousTitle(job.title)) continue
    if (!isValidDescription(job.description)) continue
    if (await jobExists(job.url, job.title, job.company_name)) continue

    const categoryName = WN_CATEGORY_MAP[(job.category_name || '').toLowerCase().trim()] || 'Operations'
    const categoryId = await getCategoryId(categoryName)
    const companyId = await getOrCreateCompany(job.company_name, job.company_url || undefined, job.company_logo || undefined)
    if (!companyId) continue

    await getSupabase().from('jobs').insert({
      title: job.title,
      slug: uniqueSlug(job.title),
      company_id: companyId,
      description: job.description || '',
      apply_url: job.url,
      category_id: categoryId,
      employment_type: 'full-time',
      region_tags: regionTags,
      salary_currency: 'USD',
      is_premium: true,
      is_featured: false,
      status: 'live',
      source: 'workingnomads',
      asia_friendly: true,
      published_at: job.pub_date || new Date().toISOString(),
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    })
    count++
  }
  return count
}

const REMOTEOK_CATEGORY_MAP: Record<string, string> = {
  'dev': 'Engineering', 'backend': 'Engineering', 'frontend': 'Engineering',
  'fullstack': 'Engineering', 'mobile': 'Engineering', 'ios': 'Engineering',
  'android': 'Engineering', 'devops': 'Engineering', 'infra': 'Engineering',
  'cloud': 'Engineering', 'python': 'Engineering', 'javascript': 'Engineering',
  'typescript': 'Engineering', 'react': 'Engineering', 'node': 'Engineering',
  'design': 'Design', 'ux': 'Design', 'ui': 'Design',
  'marketing': 'Marketing', 'growth': 'Marketing', 'seo': 'Marketing',
  'sales': 'Sales', 'bizdev': 'Sales',
  'support': 'Support', 'customerservice': 'Support',
  'finance': 'Finance', 'accounting': 'Finance',
  'hr': 'HR & Recruiting', 'recruiting': 'HR & Recruiting',
  'data': 'Data', 'analytics': 'Data', 'ml': 'Engineering', 'ai': 'Engineering',
  'product': 'Product', 'management': 'Management', 'exec': 'Management',
  'writing': 'Writing', 'content': 'Writing', 'legal': 'Legal',
  'ops': 'Operations', 'operations': 'Operations',
}

function remoteokCategory(tags: string[]): string {
  for (const tag of (tags || [])) {
    const mapped = REMOTEOK_CATEGORY_MAP[tag.toLowerCase().trim()]
    if (mapped) return mapped
  }
  return 'Operations'
}

async function fetchRemoteok(): Promise<number> {
  const res = await fetch('https://remoteok.com/api', {
    headers: { 'User-Agent': 'MangoRemote/1.0 (hello@mangoremote.com)' },
  })
  if (!res.ok) return 0

  const raw = await res.json()
  const jobs = raw.filter((j: { id?: string }) => j.id)
  let count = 0

  for (const job of jobs) {
    if (!job.url || !job.company || !job.position) continue
    if (isSuspiciousTitle(job.position)) continue
    if (!isValidDescription(job.description)) continue
    if (await jobExists(job.url, job.position, job.company)) continue

    const categoryId = await getCategoryId(remoteokCategory(job.tags || []))
    const logoUrl = job.company_logo || job.logo || null
    const companyId = await getOrCreateCompany(job.company, undefined, logoUrl)
    if (!companyId) continue

    await getSupabase().from('jobs').insert({
      title: job.position,
      slug: uniqueSlug(job.position),
      company_id: companyId,
      description: job.description || '',
      apply_url: job.url,
      category_id: categoryId,
      employment_type: 'full-time',
      region_tags: ['Worldwide'],
      salary_min: job.salary_min || null,
      salary_max: job.salary_max || null,
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
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const [workingnomads, remoteok] = await Promise.all([
      fetchWorkingNomads(),
      fetchRemoteok(),
    ])
    const total = workingnomads + remoteok
    return NextResponse.json({ ok: true, added: { workingnomads, remoteok, total } })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
