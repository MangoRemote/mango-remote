import { createClient, SupabaseClient } from '@supabase/supabase-js'

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

export async function runSync(opts: { dryRun: boolean; supabase?: SupabaseClient; log?: (m: string) => void }) {
  const log = opts.log || console.log
  const supabase = opts.supabase || createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '')
  const summary = { boards: 0, fetched: 0, new_pending: 0, updated: 0, skipped_duplicate: 0, skipped_not_asia: 0, hidden_removed: 0, errors: [] as string[] }

  const { data: existing } = await supabase.from('jobs').select('id, title, apply_url, external_source, external_id, company_id, status, last_seen_at, description, region_tags')
  const rows = existing || []
  const byExternal = new Map(rows.filter(r => r.external_source && r.external_id).map(r => [`${r.external_source}|${r.external_id}`, r]))
  const byUrl = new Set(rows.map(r => normalizeUrl(r.apply_url || '')))
  const byCompanyTitle = new Set<string>()

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
          await supabase.from('jobs').update({
            last_seen_at: new Date().toISOString(),
            ...(changed ? { title: c.title, description: c.description } : {}),
          }).eq('id', existingRow.id)
        }
        continue
      }
      const eligibility = looksAsiaEligible(c)
      if (eligibility !== 'likely') { summary.skipped_not_asia++; continue }
      if (byUrl.has(normalizeUrl(c.apply_url))) { summary.skipped_duplicate++; continue }
      const companyKey = `${b.company.toLowerCase()}|${c.title.trim().toLowerCase()}`
      if (byCompanyTitle.has(companyKey)) { summary.skipped_duplicate++; continue }
      byCompanyTitle.add(companyKey)
      summary.new_pending++
      if (!opts.dryRun) {
        const companyId = companyByName.get(b.company.toLowerCase())
        if (!companyId) { summary.errors.push(`no company row for ${b.company}`); continue }
        await supabase.from('jobs').insert({
          company_id: companyId, title: c.title, slug: `${slugify(c.title)}-${slugify(b.company)}-${c.external_id.slice(-6)}`,
          description: c.description || c.title, apply_url: c.apply_url, employment_type: c.employment_type,
          region_tags: eligibility === 'likely' ? [c.location_text] : [],
          status: 'pending', source: 'ats_sync', external_source: source, external_id: c.external_id,
          last_seen_at: new Date().toISOString(), asia_friendly: eligibility === 'likely',
        })
      }
    }
    // Hide jobs that have gone from the ATS board: only after two consecutive days missing, to avoid hiding on a bad fetch.
    const twoDaysAgo = Date.now() - 2 * 86400000
    for (const r of rows) {
      if (r.external_source !== `${b.provider}:${b.token}` || !r.external_id) continue
      if (seenIds.has(r.external_id) || r.status !== 'live') continue
      if (r.last_seen_at && new Date(r.last_seen_at).getTime() > twoDaysAgo) continue
      summary.hidden_removed++
      if (!opts.dryRun) await supabase.from('jobs').update({ status: 'draft', link_status: 'removed_from_ats' }).eq('id', r.id)
    }
  }
  log(JSON.stringify(summary))
  return summary
}
