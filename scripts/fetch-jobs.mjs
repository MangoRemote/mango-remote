// Run: node scripts/fetch-jobs.mjs
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wdzxmpgqcoycrhdzxrzr.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkenhtcGdxY295Y3JoZHp4cnpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDcwNDMyNCwiZXhwIjoyMTAwMjgwMzI0fQ.RJRPD9kuQiOEgtZC_K-aODbaQ740HVoz-q-VuN6LU8g'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const REMOTIVE_CATEGORY_MAP = {
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

const WN_CATEGORY_MAP = {
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

const ASIAN_COUNTRY_MAP = [
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

const APAC_KEYWORDS = ['asia', 'apac', 'southeast asia', 'east asia', 'asia pacific', 'asia-pacific']

const EXCLUDE_LOCATION_PATTERNS = [
  /^australia$/i, /^canada$/i, /^usa$/i, /^united states$/i,
  /^new zealand$/i, /^south africa$/i, /^brazil$/i, /^mexico$/i,
  /\busa only\b/i, /\bus only\b/i, /\bunited states only\b/i,
  /\bcanada only\b/i, /\buk only\b/i, /\baustralia only\b/i,
  /\bnew zealand only\b/i, /\bnorth america\b/i, /\beurope\b/i,
  /\bcet\b/i, /\beet\b/i, /\bemea\b/i,
  /\b(texas|oklahoma|florida|california|new york)\b/i,
]

function getRegionTags(location) {
  const l = (location || '').trim()
  if (!l) return ['Worldwide']
  const ll = l.toLowerCase()

  if (ll.includes('worldwide') || ll.includes('anywhere') || ll.includes('global') ||
      ll.includes('international') || ll === 'remote') return ['Worldwide']

  for (const [pattern, name] of ASIAN_COUNTRY_MAP) {
    if (pattern.test(l)) return [name]
  }

  if (APAC_KEYWORDS.some(k => ll.includes(k))) return ['APAC']

  if (EXCLUDE_LOCATION_PATTERNS.some(p => p.test(l))) return null

  return ['Worldwide']
}

function isSuspiciousTitle(title) {
  if (!title || title.length < 3 || title.length > 120) return true
  return JUNK_TITLE_PATTERNS.some(p => p.test(title))
}

function isValidDescription(desc) {
  if (!desc) return false
  const stripped = desc.replace(/<[^>]+>/g, '').trim()
  return stripped.length >= 100
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function uniqueSlug(base) {
  return slugify(base) + '-' + Math.random().toString(36).slice(2, 6)
}

async function getCategoryId(name) {
  const { data } = await supabase.from('categories').select('id').ilike('name', name).single()
  return data?.id ?? null
}

async function getOrCreateCompany(name, website, logoUrl) {
  const { data: existing } = await supabase.from('companies').select('id').eq('name', name).single()
  if (existing) return existing.id
  const slug = slugify(name)
  const { data } = await supabase
    .from('companies')
    .insert({ name, slug, website: website || null, logo_url: logoUrl || null, verified: false })
    .select('id')
    .single()
  return data?.id ?? null
}

async function jobExists(applyUrl) {
  const { data } = await supabase.from('jobs').select('id').eq('apply_url', applyUrl).single()
  return !!data
}

async function fetchRemotive() {
  console.log('Fetching Remotive...')
  const res = await fetch('https://remotive.com/api/remote-jobs?limit=200')
  if (!res.ok) { console.log('Remotive failed:', res.status); return 0 }
  const { jobs } = await res.json()
  let count = 0

  for (const job of jobs) {
    if (isSuspiciousTitle(job.title)) continue
    if (!isValidDescription(job.description)) continue
    if (await jobExists(job.url)) continue

    const regionTags = getRegionTags(job.candidate_required_location || '')
    if (!regionTags) continue

    const categoryName = REMOTIVE_CATEGORY_MAP[(job.category || '').toLowerCase().trim()] || 'Operations'
    const categoryId = await getCategoryId(categoryName)
    const companyId = await getOrCreateCompany(job.company_name, job.company_url, job.company_logo)
    if (!companyId) continue

    const { error } = await supabase.from('jobs').insert({
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
    if (!error) {
      count++
      if (regionTags[0] !== 'Worldwide') console.log(`  + [${regionTags[0]}] ${job.title}`)
    }
  }
  return count
}

async function fetchWorkingNomads() {
  console.log('Fetching Working Nomads...')
  const [resWorldwide, resApac] = await Promise.all([
    fetch('https://www.workingnomads.com/api/exposed_jobs/?limit=150&location=worldwide'),
    fetch('https://www.workingnomads.com/api/exposed_jobs/?limit=50&location=apac'),
  ])

  const worldwide = resWorldwide.ok ? await resWorldwide.json() : []
  const apac = resApac.ok ? await resApac.json() : []

  const seen = new Set()
  const allJobs = [...worldwide, ...apac].filter(j => {
    if (seen.has(j.url)) return false
    seen.add(j.url)
    return true
  })

  let count = 0

  for (const job of allJobs) {
    if (!job.url || !job.company_name || !job.title) continue
    if (isSuspiciousTitle(job.title)) continue
    if (!isValidDescription(job.description)) continue
    if (await jobExists(job.url)) continue

    const regionTags = getRegionTags(job.location || 'worldwide')
    if (!regionTags) continue

    const categoryName = WN_CATEGORY_MAP[(job.category_name || '').toLowerCase().trim()] || 'Operations'
    const categoryId = await getCategoryId(categoryName)
    const companyId = await getOrCreateCompany(job.company_name, job.company_url || undefined, job.company_logo || undefined)
    if (!companyId) continue

    const { error } = await supabase.from('jobs').insert({
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
    if (!error) {
      count++
      if (regionTags[0] !== 'Worldwide') console.log(`  + [${regionTags[0]}] ${job.title}`)
    }
  }
  return count
}

const remotive = await fetchRemotive()
console.log(`Remotive: ${remotive} new jobs`)

const wn = await fetchWorkingNomads()
console.log(`Working Nomads: ${wn} new jobs`)

console.log(`Total: ${remotive + wn} new jobs added`)
