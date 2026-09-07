// One-shot dedup: delete extra copies of duplicate jobs, keeping the one with the best apply_url
// Permanently-excluded jobs (US timezone, EU-only, etc.) are set to status='rejected'
// so the cron's jobExists() check finds them and never re-adds them.

const SUPABASE_URL = 'https://wdzxmpgqcoycrhdzxrzr.supabase.co'
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkenhtcGdxY295Y3JoZHp4cnpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDcwNDMyNCwiZXhwIjoyMTAwMjgwMzI0fQ.RJRPD9kuQiOEgtZC_K-aODbaQ740HVoz-q-VuN6LU8g'

const headers = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'return=minimal',
}

async function getAll() {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/jobs?select=id,title,company_id,apply_url,published_at,status,company:companies(name)&order=published_at.asc`, { headers })
  return r.json()
}

async function deleteJob(id) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/jobs?id=eq.${id}`, { method: 'DELETE', headers })
  return r.ok
}

async function rejectJob(id) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/jobs?id=eq.${id}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ status: 'rejected' }),
  })
  return r.ok
}

// Jobs to permanently exclude (cron will never re-add because jobExists() finds them as rejected)
const REJECT_TITLE_PATTERNS = [
  /\bEU\s*only\b/i,
  /\beurope\s*only\b/i,
  /\(EU Only\)/i,
  /Central or Eastern U\.S\. time/i,
]

// Companies whose jobs should always be excluded
const REJECT_COMPANIES = [
  /cloudasta/i,
]

async function run() {
  const jobs = await getAll()
  const liveJobs = jobs.filter(j => j.status === 'live')
  console.log(`Total jobs: ${jobs.length} (${liveJobs.length} live)`)

  // --- Dedup live jobs ---
  const groups = {}
  for (const j of liveJobs) {
    const key = `${j.title.trim().toLowerCase()}|||${j.company_id}`
    if (!groups[key]) groups[key] = []
    groups[key].push(j)
  }

  const toDelete = []

  for (const [, group] of Object.entries(groups)) {
    if (group.length > 1) {
      const best = group.find(j => !j.apply_url?.includes('workingnomads')) || group[0]
      const extras = group.filter(j => j.id !== best.id)
      console.log(`DUPE: "${group[0].title}" — keeping ${best.id}, deleting ${extras.map(e=>e.id).join(', ')}`)
      toDelete.push(...extras.map(e => e.id))
    }
  }

  console.log(`\nDeleting ${toDelete.length} duplicate jobs...`)
  let deleted = 0
  for (const id of toDelete) {
    const ok = await deleteJob(id)
    if (ok) deleted++
    else console.log(`  FAILED to delete ${id}`)
  }

  // --- Reject permanently-excluded jobs (ALL statuses, so cron skips them) ---
  const toReject = jobs.filter(j =>
    j.status !== 'rejected' &&
    !toDelete.includes(j.id) &&
    (
      REJECT_TITLE_PATTERNS.some(p => p.test(j.title)) ||
      REJECT_COMPANIES.some(p => p.test(j.company?.name || ''))
    )
  )

  console.log(`\nRejecting ${toReject.length} permanently-excluded jobs...`)
  let rejected = 0
  for (const j of toReject) {
    console.log(`  REJECT: "${j.title}" (${j.id})`)
    const ok = await rejectJob(j.id)
    if (ok) rejected++
    else console.log(`  FAILED to reject ${j.id}`)
  }

  const remaining = liveJobs.length - deleted - rejected
  console.log(`\nDone. Deleted ${deleted}, rejected ${rejected}. Live jobs remaining: ${remaining}`)
}

run().catch(console.error)
