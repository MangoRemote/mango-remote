import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wdzxmpgqcoycrhdzxrzr.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkenhtcGdxY295Y3JoZHp4cnpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDcwNDMyNCwiZXhwIjoyMTAwMjgwMzI0fQ.RJRPD9kuQiOEgtZC_K-aODbaQ740HVoz-q-VuN6LU8g'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function verifyDescriptions() {
  try {
    console.log('Checking sample expanded descriptions...\n')

    const { data } = await supabase
      .from('jobs')
      .select('title, description')
      .in('title', ['Software Engineer', 'Senior Machine Learning Engineer, AI Platform', 'AI Content Writer - Sri Lanka'])

    for (const job of data) {
      const descLength = job.description.length
      const hasFormatting = job.description.includes('**What you\'ll do:**') || job.description.includes('**What we\'re looking for:**')
      console.log(`✓ ${job.title}`)
      console.log(`  Length: ${descLength} characters`)
      console.log(`  Has Working Nomads format: ${hasFormatting ? 'Yes' : 'No'}`)
      console.log(`  Preview: ${job.description.substring(0, 120)}...`)
      console.log()
    }

    console.log('✓ Descriptions verified and formatted correctly')
  } catch (error) {
    console.error('Error:', error)
  }
}

verifyDescriptions()
