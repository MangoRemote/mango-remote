import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://wdzxmpgqcoycrhdzxrzr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkenhtcGdxY295Y3JoZHp4cnpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDcwNDMyNCwiZXhwIjoyMTAwMjgwMzI0fQ.RJRPD9kuQiOEgtZC_K-aODbaQ740HVoz-q-VuN6LU8g'
)

console.log('Deleting non-manual jobs...')
const { error } = await supabase
  .from('jobs')
  .delete()
  .neq('source', 'manual')

if (error) {
  console.log(`❌ Error: ${error.message}`)
} else {
  console.log('✅ Delete executed')
}

const { data, count } = await supabase
  .from('jobs')
  .select('*', { count: 'exact' })

console.log(`\nJobs remaining: ${count}`)

if (data && data.length > 0) {
  const sources = {}
  data.forEach(j => {
    sources[j.source] = (sources[j.source] || 0) + 1
  })
  Object.entries(sources).forEach(([s, c]) => console.log(`  ${s}: ${c}`))
}
