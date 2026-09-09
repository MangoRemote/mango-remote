import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wdzxmpgqcoycrhdzxrzr.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkenhtcGdxY295Y3JoZHp4cnpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDcwNDMyNCwiZXhwIjoyMTAwMjgwMzI0fQ.RJRPD9kuQiOEgtZC_K-aODbaQ740HVoz-q-VuN6LU8g'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const jobsRaw = [
  { title: 'Channel Partner Sales Executive', company: 'Canonical', category: 'Sales', employment_type: 'full-time', apply_url: 'https://job-boards.greenhouse.io/canonical/jobs/7982278' },
  { title: 'Senior Business Data Analyst', company: 'TTEC Digital', category: 'Data', employment_type: 'full-time', apply_url: 'https://jobs.lever.co/ttecdigital/f0ec4455-3e00-42e6-ab15-0bacfdaa2f2a' },
  { title: 'Director, Monitoring, Evaluation, and Learning', company: 'Teach For All', category: 'Management', employment_type: 'full-time', apply_url: 'https://teachforall.org/jobs-and-graduate-programs/jobs?gh_jid=7795660003' },
  { title: 'Chief Learning Officer for AI and Ed Tech', company: 'Teach For All', category: 'Management', employment_type: 'full-time', apply_url: 'https://teachforall.org/jobs-and-graduate-programs/jobs?gh_jid=7833868003' },
  { title: 'Territory Sales Manager', company: 'GitLab', category: 'Sales', employment_type: 'full-time', apply_url: 'https://job-boards.greenhouse.io/gitlab/jobs/8591223002' },
  { title: 'B2B SEO/AEO Expert', company: 'ElevenLabs', category: 'Marketing', employment_type: 'full-time', apply_url: 'https://jobs.ashbyhq.com/elevenlabs/a21ec926-88d3-4f95-98be-c551fe1ec49f' },
  { title: 'Engineering Intern - General / AI', company: 'Allium', category: 'Engineering', employment_type: 'full-time', apply_url: 'https://jobs.ashbyhq.com/allium/5d697ce5-b820-45c0-a101-86a05e1fb15e' },
  { title: 'Deal Desk Strategist', company: 'GitLab', category: 'Operations', employment_type: 'full-time', apply_url: 'https://job-boards.greenhouse.io/gitlab/jobs/8648306002' },
  { title: 'Senior Infrastructure Engineer (Bare Metal)', company: 'Telnyx', category: 'Engineering', employment_type: 'full-time', apply_url: 'https://job-boards.greenhouse.io/telnyx54/jobs/7693384003' },
  { title: 'Assistant Case Manager', company: 'CoreBridge Solutions', category: 'Operations', employment_type: 'contract', apply_url: 'https://corebridgesolutions.applytojob.com/apply/sXFpNdupqU/Assistant-Case-Manager' },
  { title: 'Assistant Demand Writer', company: 'CoreBridge Solutions', category: 'Operations', employment_type: 'contract', apply_url: 'https://corebridgesolutions.applytojob.com/apply/2eKpkuQ13B/Assistant-Demand-Writer' }
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
  let added = 0, skipped = 0

  for (const job of jobsRaw) {
    if (await jobExists(job.apply_url)) {
      console.log(`⏭️  ${job.title}`)
      skipped++
      continue
    }

    const categoryId = await getCategoryId(job.category)
    const companyId = await getOrCreateCompany(job.company)

    const { error } = await supabase.from('jobs').insert({
      title: job.title,
      slug: job.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).slice(2, 6),
      company_id: companyId,
      description: job.title, // Simplified for now
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
    } else {
      console.log(`✅ ${job.title}`)
      added++
    }
  }

  console.log(`\n✓ Added: ${added} | Skipped: ${skipped}`)
}

addJobs()
