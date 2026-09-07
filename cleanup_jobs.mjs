import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wdzxmpgqcoycrhdzxrzr.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkenhtcGdxY295Y3JoZHp4cnpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDcwNDMyNCwiZXhwIjoyMTAwMjgwMzI0fQ.RJRPD9kuQiOEgtZC_K-aODbaQ740HVoz-q-VuN6LU8g'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function cleanup() {
  console.log('🧹 Cleaning up database...\n')

  // 1. Count non-manual jobs
  const { data: toDelete } = await supabase
    .from('jobs')
    .select('id')
    .neq('source', 'manual')

  console.log(`Found ${toDelete?.length || 0} non-manual jobs to delete`)

  if (!toDelete || toDelete.length === 0) {
    console.log('✅ Database already clean!')
    return
  }

  // 2. Delete in batches
  const batchSize = 100
  let deleted = 0

  for (let i = 0; i < toDelete.length; i += batchSize) {
    const batch = toDelete.slice(i, i + batchSize)
    const ids = batch.map(j => j.id)

    const { error } = await supabase
      .from('jobs')
      .delete()
      .in('id', ids)

    if (error) {
      console.log(`❌ Error deleting batch: ${error.message}`)
    } else {
      deleted += batch.length
      console.log(`✓ Deleted ${deleted}/${toDelete.length}`)
    }
  }

  // 3. Verify only manual jobs remain
  console.log('\n✅ Cleanup complete!')

  const { data: remaining } = await supabase
    .from('jobs')
    .select('id, title, source')

  console.log(`\nFinal status: ${remaining?.length || 0} jobs remaining`)

  const sources = {}
  remaining?.forEach(job => {
    sources[job.source] = (sources[job.source] || 0) + 1
  })

  Object.entries(sources).forEach(([source, count]) => {
    console.log(`  ${source}: ${count} jobs`)
  })

  console.log('\n📊 Verification:')
  const allManual = remaining?.every(j => j.source === 'manual')
  console.log(`  Only manual jobs remaining: ${allManual ? '✅ Yes' : '❌ No'}`)
}

cleanup().catch(console.error)
