import { createClient, SupabaseClient } from '@supabase/supabase-js'

const CATEGORY_RULES: [RegExp, string][] = [
  [/customer success/i, 'customer-success'],
  [/sales|account executive|account manager|business development|\bbdm\b|\bsdr\b|pre-?sales|solutions? (engineer|consultant)|partner(ship)? manager/i, 'sales'],
  [/recruit|talent|\bhr\b|people operations/i, 'hr-recruiting'],
  [/paralegal|legal|counsel|lawyer|litigation/i, 'legal'],
  [/data (engineer|analyst|scientist)|machine learning|\bml\b/i, 'data'],
  [/product (manager|owner|lead)/i, 'product'],
  [/technical writer|writer|documentation|editor/i, 'technical-writing'],
  [/technical support|support|technician|help ?desk|service desk|onboarding/i, 'support'],
  [/marketing|brand|community|social|growth|content|storyteller/i, 'marketing'],
  [/designer|design\b|\bux\b|\bui\b/i, 'design'],
  [/operations|\bops\b/i, 'operations'],
  [/financ|accountant|bookkeep/i, 'finance'],
  [/project manager|program manager|scrum/i, 'project-management'],
  [/engineer|developer|devops|\bsre\b|architect|\bqa\b|tester/i, 'engineering'],
  [/manager|director|head of|\bvp\b|chief/i, 'management'],
]

export function inferCategorySlug(title: string): string | null {
  for (const [pattern, slug] of CATEGORY_RULES) {
    if (pattern.test(title)) return slug
  }
  return null
}

export type Board = { company: string; provider: 'greenhouse' | 'lever' | 'ashby'; token: string }

export const BOARDS: Board[] = [
  { company: 'Canonical', provider: 'greenhouse', token: 'canonical' },
  { company: 'GitLab', provider: 'greenhouse', token: 'gitlab' },
  { company: 'Twilio', provider: 'greenhouse', token: 'twilio' },
  { company: 'Databento', provider: 'greenhouse', token: 'databento' },
  { company: 'OpenTable', provider: 'greenhouse', token: 'opentable' },
  { company: 'JumpCloud', provider: 'lever', token: 'jumpcloud' },
  { company: 'ElevenLabs', provider: 'ashby', token: 'elevenlabs' },
  { company: 'Mapbox', provider: 'ashby', token: 'mapbox' },
]

export type Candidate = {
  external_id: string
  title: string
  apply_url: string
  location_text: string
  description: string
  employment_type: string
}

const ASIA = ['asia', 'apac', 'singapore', 'japan', 'vietnam', 'thailand', 'indonesia', 'philippines', 'malaysia', 'korea', 'taiwan', 'hong kong', 'china', 'india', 'cambodia', 'myanmar', 'sri lanka', 'australia', 'new zealand', 'bangkok', 'tokyo', 'seoul', 'kuala lumpur', 'manila', 'jakarta', 'hanoi', 'ho chi minh', 'bangalore', 'bengaluru', 'mumbai', 'delhi', 'pune', 'hyderabad', 'chennai']
const WORLDWIDE = ['worldwide', 'anywhere', 'global', 'remote']
const ONSITE_HINT = ['on-site', 'onsite', 'office-based', 'hybrid']

export function looksAsiaEligible(c: Candidate): 'likely' | 'unclear' | 'not_asia' {
  const loc = `${c.location_text} ${c.title}`.toLowerCase()
  if (ONSITE_HINT.some(o => loc.includes(o)) || /office[ -]based|office based/.test(loc)) return 'not_asia'
  if (ASIA.some(a => loc.includes(a))) return 'likely'
  if (WORLDWIDE.some(w => loc.includes(w))) return 'unclear'
  return 'not_asia'
}

export async function fetchBoard(b: Board): Promise<Candidate[]> {
  if (b.provider === 'greenhouse') {
    const res = await fetch(`https://boards-api.greenhouse.io/v1/boards/${b.token}/jobs?content=true`)
    if (!res.ok) throw new Error(`greenhouse ${b.token} ${res.status}`)
    const data = await res.json() as { jobs: Array<{ id: number; title: string; absolute_url: string; location?: { name?: string }; content?: string }> }
    return data.jobs.map(j => ({
      external_id: String(j.id), title: j.title, apply_url: j.absolute_url,
      location_text: j.location?.name || '', description: stripHtml(j.content || ''), employment_type: 'Full-time',
    }))
  }
  if (b.provider === 'lever') {
    const res = await fetch(`https://api.lever.co/v0/postings/${b.token}?mode=json`)
    if (!res.ok) throw new Error(`lever ${b.token} ${res.status}`)
    const data = await res.json() as Array<{ id: string; text: string; hostedUrl: string; applyUrl?: string; descriptionPlain?: string; categories?: { location?: string; commitment?: string } }>
    return data.map(j => ({
      external_id: j.id, title: j.text, apply_url: j.hostedUrl,
      location_text: j.categories?.location || '', description: j.descriptionPlain || '',
      employment_type: j.categories?.commitment || 'Full-time',
    }))
  }
  const res = await fetch(`https://api.ashbyhq.com/posting-api/job-board/${b.token}`)
  if (!res.ok) throw new Error(`ashby ${b.token} ${res.status}`)
  const data = await res.json() as { jobs: Array<{ id: string; title: string; jobUrl: string; applyUrl?: string; location?: string; descriptionPlain?: string; employmentType?: string; isListed?: boolean }> }
  return data.jobs.filter(j => j.isListed !== false).map(j => ({
    external_id: j.id, title: j.title, apply_url: j.jobUrl,
    location_text: j.location || '', description: j.descriptionPlain || '',
    employment_type: j.employmentType || 'Full-time',
  }))
}

function stripHtml(s: string) {
  return s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+\n/g, '\n').trim()
}

export function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function normalizeUrl(raw: string): string {
  try {
    const u = new URL(raw)
    const kept = [...u.searchParams.entries()].filter(([k]) => !/^(utm_|ref$|source$)/i.test(k)).sort(([a], [b]) => a.localeCompare(b))
    const q = kept.length ? `?${new URLSearchParams(kept).toString()}` : ''
    return `${u.hostname.replace(/^www\./, '').toLowerCase()}${u.pathname.replace(/\/+$/, '').toLowerCase()}${q}`
  } catch {
    return String(raw || '').trim().toLowerCase()
  }
}


export const AUTO_APPROVE_HIGH = false

const SPAM_PATTERNS = /crypto|bitcoin|earn \$|make \$\d+ (a|per) (day|hour)|guaranteed income|work from home earn|mlm|pyramid|telegram only|whatsapp only/i

export function qualityScore(c: Candidate, eligibility: string, companyKnown: boolean, linkOk: boolean): { score: number; tier: 'high' | 'medium' | 'low'; reasons: string[] } {
  let score = 0
  const reasons: string[] = []
  if (eligibility === 'likely') { score += 30 } else { reasons.push('location not clearly Asia') }
  if (linkOk) { score += 15 } else { reasons.push('application link not confirmed') }
  if (companyKnown) { score += 10 } else { reasons.push('company not on approved list') }
  if ((c.description || '').length >= 400) { score += 15 } else { reasons.push('short description') }
  if (c.employment_type && c.employment_type !== 'Full-time') { score += 5 } else { score += 5 }
  if (c.title && c.title.length >= 5) { score += 5 }
  if (SPAM_PATTERNS.test(`${c.title} ${c.description}`)) { score -= 40; reasons.push('possible spam or scam wording') } else { score += 20 }
  score = Math.max(0, Math.min(100, score))
  const tier = score >= 80 ? 'high' : score >= 55 ? 'medium' : 'low'
  return { score, tier, reasons }
}

export async function checkLink(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow', headers: { 'User-Agent': 'MangoRemote-link-check/1.0' } })
    return res.status >= 200 && res.status < 400
  } catch {
    return false
  }
}

export async function runSync(opts: { dryRun: boolean; supabase?: SupabaseClient; log?: (m: string) => void }) {
  const log = opts.log || console.log
  const supabase = opts.supabase || createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '')
  const summary: { boards: number; fetched: number; new_pending: number; updated: number; skipped_duplicate: number; skipped_not_asia: number; hidden_removed: number; rejected_low_quality?: number; errors: string[] } = { boards: 0, fetched: 0, new_pending: 0, updated: 0, skipped_duplicate: 0, skipped_not_asia: 0, hidden_removed: 0, errors: [] }

  const { data: existing } = await supabase.from('jobs').select('id, title, apply_url, external_source, external_id, company_id, status, last_seen_at, description, region_tags')
  const rows = existing || []
  let premiumCount = rows.filter(r => (r as { is_premium?: boolean }).is_premium).length
  let liveCount = rows.filter(r => r.status === 'live').length
  const byExternal = new Map(rows.filter(r => r.external_source && r.external_id).map(r => [`${r.external_source}|${r.external_id}`, r]))
  const byUrl = new Set(rows.map(r => normalizeUrl(r.apply_url || '')))
  const byCompanyTitle = new Set<string>()

  const { data: categories } = await supabase.from('categories').select('id, slug')
  const categoryBySlug = new Map((categories || []).map(c => [c.slug, c.id]))
  const { data: companies } = await supabase.from('companies').select('id, slug, name')
  const companyByName = new Map((companies || []).map(c => [c.name.toLowerCase(), c.id]))

  for (const b of BOARDS) {
    let candidates: Candidate[]
    try { candidates = await fetchBoard(b) } catch (e) { summary.errors.push(String(e)); continue }
    summary.boards++
    summary.fetched += candidates.length
    const seenIds = new Set<string>()
    for (const c of candidates) {
      seenIds.add(c.external_id)
      const source = `${b.provider}:${b.token}`
      const key = `${source}|${c.external_id}`
      const existingRow = byExternal.get(key)
      if (existingRow) {
        const changed = existingRow.title !== c.title || existingRow.description !== c.description
        summary.updated += changed ? 1 : 0
        if (!opts.dryRun) {
          const { error: updErr } = await supabase.from('jobs').update({
            last_seen_at: new Date().toISOString(),
            ...(changed ? { title: c.title, description: c.description } : {}),
          }).eq('id', existingRow.id)
          if (updErr) summary.errors.push(`update ${c.external_id}: ${updErr.message}`)
        }
        continue
      }
      const eligibility = looksAsiaEligible(c)
      if (eligibility !== 'likely') { summary.skipped_not_asia++; continue }
      if (byUrl.has(normalizeUrl(c.apply_url))) { summary.skipped_duplicate++; continue }
      const companyKey = `${b.company.toLowerCase()}|${c.title.trim().toLowerCase()}`
      if (byCompanyTitle.has(companyKey)) { summary.skipped_duplicate++; continue }
      byCompanyTitle.add(companyKey)
      const companyKnown = BOARDS.some(x => x.company === b.company)
      const linkOk = await checkLink(c.apply_url)
      const q = qualityScore(c, eligibility, companyKnown, linkOk)
      if (q.tier === 'low') { summary.rejected_low_quality = (summary.rejected_low_quality || 0) + 1; if (!opts.dryRun) { await supabase.from('jobs').insert({ company_id: companyByName.get(b.company.toLowerCase()), title: c.title, slug: `${slugify(c.title)}-${slugify(b.company)}-${c.external_id.slice(-6)}`, description: c.description || c.title, apply_url: c.apply_url, employment_type: c.employment_type, region_tags: [], status: 'draft', source: 'ats_sync', external_source: `${b.provider}:${b.token}`, external_id: c.external_id, last_seen_at: new Date().toISOString(), link_status: 'rejected_low_quality:' + q.reasons.join('; ') }) } continue }
      summary.new_pending++
      const makePremium = premiumCount / Math.max(liveCount, 1) < 0.5
      liveCount++
      if (makePremium) premiumCount++
      if (!opts.dryRun) {
        const companyId = companyByName.get(b.company.toLowerCase())
        if (!companyId) { summary.errors.push(`no company row for ${b.company}`); continue }
        const { error: insErr } = await supabase.from('jobs').insert({
          company_id: companyId, title: c.title, slug: `${slugify(c.title)}-${slugify(b.company)}-${c.external_id.slice(-6)}`,
          description: c.description || c.title, apply_url: c.apply_url, employment_type: c.employment_type,
          region_tags: eligibility === 'likely' ? [c.location_text] : [],
          source: 'ats_sync', external_source: source, external_id: c.external_id,
          last_seen_at: new Date().toISOString(), asia_friendly: eligibility === 'likely',
          category_id: categoryBySlug.get(inferCategorySlug(c.title) || '') ?? null,
          is_premium: makePremium,
          link_status: linkOk ? 'ok' : 'unverified',
          status: (q.tier === 'high' && AUTO_APPROVE_HIGH) ? 'live' : 'pending',
          published_at: (q.tier === 'high' && AUTO_APPROVE_HIGH) ? new Date().toISOString() : null,
        })
        if (insErr) summary.errors.push(`insert ${c.external_id}: ${insErr.message}`)
      }
    }
    // Hide jobs that have gone from the ATS board: only after two consecutive days missing, to avoid hiding on a bad fetch.
    const twoDaysAgo = Date.now() - 2 * 86400000
    for (const r of rows) {
      if (r.external_source !== `${b.provider}:${b.token}` || !r.external_id) continue
      if (seenIds.has(r.external_id) || r.status !== 'live') continue
      if (r.last_seen_at && new Date(r.last_seen_at).getTime() > twoDaysAgo) continue
      summary.hidden_removed++
      if (!opts.dryRun) {
        const { error: hideErr } = await supabase.from('jobs').update({ status: 'draft', link_status: 'removed_from_ats' }).eq('id', r.id)
        if (hideErr) summary.errors.push(`hide ${r.id}: ${hideErr.message}`)
      }
    }
  }
  log(JSON.stringify(summary))
  return summary
}
