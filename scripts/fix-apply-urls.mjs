import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://wdzxmpgqcoycrhdzxrzr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkenhtcGdxY295Y3JoZHp4cnpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDcwNDMyNCwiZXhwIjoyMTAwMjgwMzI0fQ.RJRPD9kuQiOEgtZC_K-aODbaQ740HVoz-q-VuN6LU8g'
)

async function resolveUrl(url) {
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(8000) })
    const final = res.url
    // If it redirected somewhere useful (not back to workingnomads listing)
    if (final && !final.includes('workingnomads.com/jobs') && final !== url) return final
    // Try GET if HEAD didn't redirect properly
    const res2 = await fetch(url, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(8000) })
    return res2.url !== url ? res2.url : null
  } catch {
    return null
  }
}

const { data: jobs } = await supabase
  .from('jobs')
  .select('id, title, apply_url')
  .eq('status', 'live')
  .or('apply_url.ilike.%workingnomads.com%,apply_url.ilike.%remotive.com%')

console.log(`Found ${jobs.length} jobs with redirect URLs`)

let fixed = 0
let failed = 0

for (const job of jobs) {
  const resolved = await resolveUrl(job.apply_url)
  if (resolved && resolved !== job.apply_url) {
    await supabase.from('jobs').update({ apply_url: resolved }).eq('id', job.id)
    console.log(`✓ ${job.title?.substring(0,50)}\n  → ${resolved.substring(0,80)}`)
    fixed++
  } else {
    console.log(`✗ Could not resolve: ${job.title?.substring(0,50)}`)
    failed++
  }
  await new Promise(r => setTimeout(r, 300))
}

console.log(`\nFixed: ${fixed} | Failed: ${failed}`)
