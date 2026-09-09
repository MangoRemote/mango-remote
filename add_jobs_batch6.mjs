import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wdzxmpgqcoycrhdzxrzr.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkenhtcGdxY295Y3JoZHp4cnpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDcwNDMyNCwiZXhwIjoyMTAwMjgwMzI0fQ.RJRPD9kuQiOEgtZC_K-aODbaQ740HVoz-q-VuN6LU8g'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const jobsRaw = [
  { title: 'Strategic Account Executive - South Asia', company: 'Twilio', category: 'Sales', employment_type: 'full-time', apply_url: 'https://job-boards.greenhouse.io/twilio/jobs/8178812' },
  { title: 'Payment Operations Lead', company: 'Xapo Bank', category: 'Operations', employment_type: 'full-time', apply_url: 'https://job-boards.greenhouse.io/xapo61/jobs/7986308003' },
  { title: 'In-House Associate Real Estate Counsel', company: 'BH Properties', category: 'Legal', employment_type: 'full-time', apply_url: 'https://bhproperties.applytojob.com/apply/wqGH5xSS3E/InHouse-Associate-Real-Estate-Counsel' },
  { title: 'Engineering Technician', company: 'Learntastic', category: 'Engineering', employment_type: 'full-time', apply_url: 'https://learntastic.applytojob.com/apply/Gc52BH3QSl/Engineering-Technician' }
]

async function jobExists(applyUrl) {
  const { data } = await supabase.from('jobs').select('id').eq('apply_url', applyUrl).single()
  return !!data
}

async function getCategoryId(name) {
  const { data } = await supabase.from('categories').select('id').ilike('name', name).single()
  return data?.id ?? null
}

async function getOrCreateCompany(name) {
  const { data: existing } = await supabase.from('companies').select('id').eq('name', name).single()
  if (existing) return existing.id
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const { data } = await supabase.from('companies').insert({ name, slug, verified: false }).select('id').single()
  return data?.id ?? null
}

async function addJobs() {
  console.log(`📝 Adding ${jobsRaw.length} jobs...\n`)
  let added = 0, skipped = 0, failed = 0

  for (const job of jobsRaw) {
    if (await jobExists(job.apply_url)) {
      console.log(`⏭️  ${job.title}`)
      skipped++
      continue
    }

    const categoryId = await getCategoryId(job.category)
    if (!categoryId) {
      console.log(`❌ ${job.title} — category not found`)
      failed++
      continue
    }

    const companyId = await getOrCreateCompany(job.company)
    if (!companyId) {
      console.log(`❌ ${job.title} — company creation failed`)
      failed++
      continue
    }

    const { error } = await supabase.from('jobs').insert({
      title: job.title,
      slug: job.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).slice(2, 6),
      company_id: companyId,
      description: job.title,
      apply_url: job.apply_url,
      category_id: categoryId,
      employment_type: job.employment_type,
      region_tags: ['Worldwide'],
      is_premium: added % 2 === 0,
      status: 'live',
      source: 'manual',
      asia_friendly: true,
      published_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    })

    if (error) {
      console.log(`❌ ${job.title}`)
      failed++
    } else {
      console.log(`✅ ${job.title}`)
      added++
    }
  }

  console.log(`\n✓ Added: ${added} | Skipped: ${skipped} | Failed: ${failed}`)
}

addJobs()
