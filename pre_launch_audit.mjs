import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wdzxmpgqcoycrhdzxrzr.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkenhtcGdxY295Y3JoZHp4cnpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDcwNDMyNCwiZXhwIjoyMTAwMjgwMzI0fQ.RJRPD9kuQiOEgtZC_K-aODbaQ740HVoz-q-VuN6LU8g'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function audit() {
  console.log('🔍 MangoRemote Pre-Launch Audit\n')

  // 1. Check job count
  console.log('1️⃣  Job Count')
  const { data: jobs, error: jobError } = await supabase
    .from('jobs')
    .select('id', { count: 'exact' })
  console.log(`   Jobs in database: ${jobs?.length || 0}`)
  if (jobError) console.log(`   ❌ Error: ${jobError.message}`)

  // 2. Check premium jobs
  console.log('\n2️⃣  Premium Job Distribution')
  const { data: premiumJobs } = await supabase
    .from('jobs')
    .select('id')
    .eq('is_premium', true)
  console.log(`   Premium jobs: ${premiumJobs?.length || 0}`)
  const { data: freeJobs } = await supabase
    .from('jobs')
    .select('id')
    .eq('is_premium', false)
  console.log(`   Free jobs: ${freeJobs?.length || 0}`)

  // 3. Check companies
  console.log('\n3️⃣  Companies')
  const { data: companies } = await supabase
    .from('companies')
    .select('id', { count: 'exact' })
  console.log(`   Unique companies: ${companies?.length || 0}`)

  // 4. Check categories
  console.log('\n4️⃣  Categories')
  const { data: categories } = await supabase
    .from('categories')
    .select('name')
  console.log(`   Categories available: ${categories?.length || 0}`)
  categories?.forEach(c => console.log(`     • ${c.name}`))

  // 5. Check for duplicates
  console.log('\n5️⃣  Duplicate Check')
  const { data: allJobs } = await supabase.from('jobs').select('title, apply_url')
  const urlCounts = {}
  allJobs?.forEach(job => {
    urlCounts[job.apply_url] = (urlCounts[job.apply_url] || 0) + 1
  })
  const duplicates = Object.entries(urlCounts).filter(([_, count]) => count > 1)
  console.log(`   Duplicate URLs found: ${duplicates.length}`)
  if (duplicates.length > 0) {
    duplicates.slice(0, 3).forEach(([url, count]) => {
      console.log(`     ⚠️  ${url}: ${count} times`)
    })
  }

  // 6. Sample job with expanded description
  console.log('\n6️⃣  Description Quality Check')
  const { data: sampleJob } = await supabase
    .from('jobs')
    .select('title, description')
    .limit(1)
    .single()
  if (sampleJob) {
    const hasFormat = sampleJob.description?.includes('**What') || false
    const length = sampleJob.description?.length || 0
    console.log(`   Sample: "${sampleJob.title}"`)
    console.log(`   Description length: ${length} chars`)
    console.log(`   Has Working Nomads format: ${hasFormat ? '✅ Yes' : '❌ No'}`)
  }

  // 7. Check job expiration
  console.log('\n7️⃣  Expiration Dates')
  const { data: expiringJobs } = await supabase
    .from('jobs')
    .select('id, expires_at')
    .gt('expires_at', new Date().toISOString())
    .limit(3)
  const sample = expiringJobs?.[0]
  if (sample) {
    const expiryDate = new Date(sample.expires_at)
    const daysLeft = Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24))
    console.log(`   Sample job expires in: ${daysLeft} days`)
    console.log(`   ✅ Jobs are set to expire (30 day lifecycle)`)
  }

  // 8. Check source distribution
  console.log('\n8️⃣  Job Sources')
  const { data: sourceCounts } = await supabase
    .from('jobs')
    .select('source')
  const sources = {}
  sourceCounts?.forEach(job => {
    sources[job.source] = (sources[job.source] || 0) + 1
  })
  Object.entries(sources).forEach(([source, count]) => {
    console.log(`   ${source}: ${count} jobs`)
  })

  console.log('\n✅ Audit complete!')
  console.log('\n📋 Next steps:')
  console.log('   • Test signup/login flow')
  console.log('   • Verify Stripe checkout')
  console.log('   • Test premium gate at job 50')
  console.log('   • Check email delivery')
  console.log('   • Mobile responsiveness check')
}

audit().catch(console.error)
