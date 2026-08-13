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
  // Physical / on-site jobs
  /\b(labourer|laborer|barista|driver|porter|cleaner|cashier|chef|cook|waiter|waitress|bartender|security guard|janitor|plumber|electrician|carpenter|assembler|warehouse|delivery|forklift|machinist|welder|painter|hvac|mechanic)\b/i,
  // Garbage placeholder titles
  /your job (title|description|here)/i,
  /page not found/i,
  /untitled/i,
  /test job/i,
  /^jobs?$/i,
  /^(hiring|apply|careers|vacancies|openings|positions)$/i,
  /^how (to )?apply/i,
  /job title/i,
  /come join/i,
  /check back soon/i,
  /spontan/i,           // "spontaneous application" in French
  /candidature/i,
  /open vacanc/i,
  /join our team/i,
  /join the family/i,
  /hiring process/i,
  /\btest\b/i,
  // US/non-Asia location restrictions in title
  /\b(texas|oklahoma|florida|california|new york|chicago|boston|seattle|atlanta)\b/i,
  /\bgerman\b.*\b(de)\b|\b(de)\b.*\bgerman\b/i,
  /\bDACH\b/,
  /\(Remote\s*-\s*(US|USA|UK|Canada|Australia|Germany|France|Spain|Italy)\)/i,
  // Clearly non-remote
  /\bin-territory\b/i,
  /\bon-?site\b/i,
]

// Company names whose jobs are always junk
const JUNK_COMPANIES = [
  /whiterose janitorial/i,
  /captain pq chemical/i,
  /corrtech energy/i,
  /quintessence films/i,
  /beltrami county/i,
  /precision safe sidewalks/i,
  /belfast.*chamber/i,
  /giant leap consulting/i,
  /twittaer/i,
  /manunor/i,
  /four seasons/i,
  /philadelphia school/i,
  /haus\.com/i,
  /neulogy/i,
  /tees components/i,
  /yacht club games/i,
  /germain h/i,
  /compact home lifts/i,
  /fedex/i,
  /jayco/i,
  /nebraska public power/i,
]

function isSuspiciousTitle(title: string, companyName?: string): boolean {
  if (!title || title.length < 5 || title.length > 120) return true
  if (JUNK_TITLE_PATTERNS.some(p => p.test(title))) return true
  if (companyName && JUNK_COMPANIES.some(p => p.test(companyName))) return true
  // All-caps titles (usually scraper artifacts)
  if (title === title.toUpperCase() && title.length > 5) return true
  return false
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

const AGGREGATOR_DOMAINS = ['weworkremotely.com', 'remoteok.com', 'remotive.com', 'linkedin.com/jobs']

async function resolvesFinalUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(4000) })
    return res.url
  } catch {
    return null
  }
}

function isAggregatorUrl(url: string): boolean {
  return AGGREGATOR_DOMAINS.some(d => url.includes(d))
}

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

// Load all existing data in 3 parallel queries instead of per-job lookups
async function loadExistingData() {
  const [jobsRes, companiesRes, categoriesRes] = await Promise.all([
    getSupabase().from('jobs').select('apply_url, title, company_id'),
    getSupabase().from('companies').select('id, name'),
    getSupabase().from('categories').select('id, name'),
  ])
  const existingUrls = new Set((jobsRes.data || []).map((j: { apply_url: string }) => j.apply_url))
  const existingTitles = new Map(
    (jobsRes.data || []).map((j: { title: string; company_id: string }) => [j.title.toLowerCase(), j.company_id])
  )
  const companyMap = new Map((companiesRes.data || []).map((c: { name: string; id: string }) => [c.name.toLowerCase(), c.id]))
  const categoryMap = new Map((categoriesRes.data || []).map((c: { name: string; id: string }) => [c.name.toLowerCase(), c.id]))
  return { existingUrls, existingTitles, companyMap, categoryMap }
}

type ExistingData = Awaited<ReturnType<typeof loadExistingData>>

function jobExistsInCache(cache: ExistingData, applyUrl: string, title?: string, companyName?: string): boolean {
  if (cache.existingUrls.has(applyUrl)) return true
  if (title && companyName) {
    const companyId = cache.existingTitles.get(title.toLowerCase())
    if (companyId && cache.companyMap.get(companyName.toLowerCase()) === companyId) return true
  }
  return false
}

function getCategoryIdFromCache(cache: ExistingData, name: string): string | null {
  return cache.categoryMap.get(name.toLowerCase()) ?? cache.categoryMap.get('operations') ?? null
}

async function getOrCreateCompany(cache: ExistingData, name: string, website?: string, logoUrl?: string): Promise<string | null> {
  const existing = cache.companyMap.get(name.toLowerCase())
  if (existing) return existing
  const slug = slugify(name)
  const { data } = await getSupabase()
    .from('companies')
    .insert({ name, slug, website: website || null, logo_url: logoUrl || null, verified: false })
    .select('id')
    .single()
  if (data?.id) cache.companyMap.set(name.toLowerCase(), data.id)
  return data?.id ?? null
}

async function fetchWorkingNomads(cache: ExistingData): Promise<number> {
  const [resWorldwide, resApac, resAsia] = await Promise.all([
    fetch('https://www.workingnomads.com/api/exposed_jobs/?limit=500&location=worldwide'),
    fetch('https://www.workingnomads.com/api/exposed_jobs/?limit=500&location=apac'),
    fetch('https://www.workingnomads.com/api/exposed_jobs/?limit=500&location=asia'),
  ])

  const worldwide: { url: string }[] = resWorldwide.ok ? await resWorldwide.json() : []
  const apac: { url: string }[] = resApac.ok ? await resApac.json() : []
  const asia: { url: string }[] = resAsia.ok ? await resAsia.json() : []

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

  // Pre-filter: resolve all WN redirect URLs in parallel to catch aggregator destinations
  const withResolvedUrls = await Promise.all(
    tagged.map(async ({ job, regionTags }) => {
      const finalUrl = await resolvesFinalUrl(job.url)
      return { job, regionTags, finalUrl }
    })
  )

  let count = 0

  for (const { job, regionTags, finalUrl } of withResolvedUrls) {
    if (!job.url || !job.company_name || !job.title) continue
    if (!finalUrl || isAggregatorUrl(finalUrl)) continue
    if (isSuspiciousTitle(job.title, job.company_name)) continue
    if (!isValidDescription(job.description)) continue
    if (jobExistsInCache(cache, finalUrl, job.title, job.company_name)) continue

    const categoryName = WN_CATEGORY_MAP[(job.category_name || '').toLowerCase().trim()] || 'Operations'
    const categoryId = getCategoryIdFromCache(cache, categoryName)
    const companyId = await getOrCreateCompany(cache, job.company_name, job.company_url || undefined, job.company_logo || undefined)
    if (!companyId) continue

    const { error } = await getSupabase().from('jobs').insert({
      title: job.title,
      slug: uniqueSlug(job.title),
      company_id: companyId,
      description: job.description || '',
      apply_url: finalUrl,
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
    if (!error) {
      cache.existingUrls.add(finalUrl)
      count++
    }
  }
  return count
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const cache = await loadExistingData()
    const workingnomads = await fetchWorkingNomads(cache)
    return NextResponse.json({ ok: true, added: { workingnomads, total: workingnomads } })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

// WWR removed — links go to WWR site not employer career pages
async function fetchWeWorkRemotely_disabled(cache: ExistingData): Promise<number> {
  const res = await fetch('https://weworkremotely.com/remote-jobs.rss', {
    headers: { 'User-Agent': 'MangoRemote/1.0 (hello@mangoremote.com)' },
  })
  if (!res.ok) return 0

  const xml = await res.text()
  const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || []
  let count = 0

  for (const item of items) {
    const title = (item.match(/<title>(.*?)<\/title>/) || [])[1]?.replace(/^[^:]+:\s*/, '').trim()
    const link = (item.match(/<guid>(.*?)<\/guid>/) || [])[1]?.trim()
    const region = (item.match(/<region>(.*?)<\/region>/) || [])[1] || ''
    const country = (item.match(/<country>(.*?)<\/country>/) || [])[1] || ''
    const category = (item.match(/<category>(.*?)<\/category>/) || [])[1] || ''
    const description = (item.match(/<description>([\s\S]*?)<\/description>/) || [])[1] || ''
    const company = (item.match(/<company_name>(.*?)<\/company_name>/) || // some feeds have this
      item.match(/Headquarters:\s*<\/strong>\s*(.*?)<br/) || [])[1]?.trim() ||
      (title?.split(':')[0] || 'Unknown')

    if (!title || !link) continue
    if (!region.includes('Anywhere')) continue  // only truly worldwide jobs
    // Skip if explicitly US/Canada/UK only
    if (/\b(United States|Canada)\b/.test(country) && !/worldwide|anywhere/i.test(country)) continue
    if (isSuspiciousTitle(title)) continue

    const cleanDesc = description.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').trim()
    if (!isValidDescription(cleanDesc)) continue
    if (jobExistsInCache(cache, link, title, company)) continue

    const categoryId = getCategoryIdFromCache(cache, WN_CATEGORY_MAP[category.toLowerCase()] || 'Operations')
    const companyId = await getOrCreateCompany(cache, company)
    if (!companyId) continue

    await getSupabase().from('jobs').insert({
      title,
      slug: uniqueSlug(title),
      company_id: companyId,
      description: cleanDesc,
      apply_url: link,
      category_id: categoryId,
      employment_type: 'full-time',
      region_tags: ['Worldwide'],
      salary_currency: 'USD',
      is_premium: true,
      is_featured: false,
      status: 'live',
      source: 'weworkremotely',
      asia_friendly: true,
      published_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    })
    count++
  }
  return count
}
