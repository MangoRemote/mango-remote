import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabase = createClient(
  'https://wdzxmpgqcoycrhdzxrzr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkenhtcGdxY295Y3JoZHp4cnpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDcwNDMyNCwiZXhwIjoyMTAwMjgwMzI0fQ.RJRPD9kuQiOEgtZC_K-aODbaQ740HVoz-q-VuN6LU8g'
)

async function diagnostics() {
  console.log('🔧 MangoRemote Full System Diagnostics\n')

  // 1. Environment Variables
  console.log('1️⃣  Environment Variables')
  const envFile = '.env.local'
  if (fs.existsSync(envFile)) {
    const env = fs.readFileSync(envFile, 'utf-8')
    const hasNextUrl = env.includes('NEXT_PUBLIC_SITE_URL')
    const hasStripe = env.includes('STRIPE_SECRET_KEY')
    const hasSupabase = env.includes('SUPABASE_URL')
    console.log(`   .env.local exists: ✅`)
    console.log(`   NEXT_PUBLIC_SITE_URL: ${hasNextUrl ? '✅' : '❌'}`)
    console.log(`   STRIPE_SECRET_KEY: ${hasStripe ? '✅' : '❌'}`)
    console.log(`   SUPABASE_URL: ${hasSupabase ? '✅' : '❌'}`)
  } else {
    console.log(`   ❌ .env.local not found`)
  }

  // 2. Database Schema
  console.log('\n2️⃣  Database Schema')
  const tables = ['jobs', 'companies', 'categories', 'users', 'saved_jobs']
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('count', { count: 'exact', head: true })
    if (error) {
      console.log(`   ${table}: ❌ (${error.message})`)
    } else {
      console.log(`   ${table}: ✅ exists`)
    }
  }

  // 3. Stripe Setup
  console.log('\n3️⃣  Stripe Integration')
  const envContent = fs.readFileSync('.env.local', 'utf-8')
  const hasStripePublic = envContent.includes('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY')
  const hasStripeSecret = envContent.includes('STRIPE_SECRET_KEY')
  const hasStripeWebhook = envContent.includes('STRIPE_WEBHOOK_SECRET')
  console.log(`   Public key configured: ${hasStripePublic ? '✅' : '❌'}`)
  console.log(`   Secret key configured: ${hasStripeSecret ? '✅' : '❌'}`)
  console.log(`   Webhook secret configured: ${hasStripeWebhook ? '✅' : '❌'}`)

  // 4. API Routes
  console.log('\n4️⃣  API Routes')
  const apiRoutes = [
    'app/api/checkout/premium/route.ts',
    'app/api/checkout/post-a-job/route.ts',
    'app/api/webhooks/stripe/route.ts',
    'app/api/auth/callback/route.ts'
  ]
  for (const route of apiRoutes) {
    const exists = fs.existsSync(route)
    console.log(`   ${route.split('/').pop()}: ${exists ? '✅' : '❌'}`)
  }

  // 5. Auth Setup
  console.log('\n5️⃣  Authentication')
  const authPages = [
    'app/auth/login/page.tsx',
    'app/auth/signup/page.tsx'
  ]
  for (const page of authPages) {
    const exists = fs.existsSync(page)
    console.log(`   ${page.split('/')[2]}: ${exists ? '✅' : '❌'}`)
  }

  // 6. Premium Gate
  console.log('\n6️⃣  Premium Gate Logic')
  const premiumComponent = fs.readFileSync('components/PremiumGate.tsx', 'utf-8')
  const hasJobLimit = premiumComponent.includes('50') || premiumComponent.includes('FREE_JOB_LIMIT')
  const hasRedirect = premiumComponent.includes('redirect') || premiumComponent.includes('/premium')
  console.log(`   Job limit check: ${hasJobLimit ? '✅' : '❌ (may not have limit)'}`)
  console.log(`   Redirect to premium: ${hasRedirect ? '✅' : '❌'}`)

  // 7. Database Integrity
  console.log('\n7️⃣  Data Integrity')
  const { data: jobsNoDesc } = await supabase
    .from('jobs')
    .select('id')
    .or('description.is.null,description.eq.')
  console.log(`   Jobs without descriptions: ${jobsNoDesc?.length || 0}`)

  const { data: jobsNoUrl } = await supabase
    .from('jobs')
    .select('id')
    .or('apply_url.is.null,apply_url.eq.')
  console.log(`   Jobs without apply URLs: ${jobsNoUrl?.length || 0}`)

  const { data: jobsNoCategory } = await supabase
    .from('jobs')
    .select('id')
    .is('category_id', null)
  console.log(`   Jobs without categories: ${jobsNoCategory?.length || 0}`)

  // 8. Overall Status
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📊 OVERALL LAUNCH READINESS')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━')

  const issuesFound = [
    !hasStripePublic || !hasStripeSecret || !hasStripeWebhook,
    jobsNoDesc?.length > 0,
    jobsNoUrl?.length > 0,
    jobsNoCategory?.length > 0
  ].filter(x => x).length

  if (issuesFound === 0) {
    console.log('✅ System looks good for launch!')
  } else {
    console.log(`⚠️  ${issuesFound} critical issues found - see details above`)
  }
}

diagnostics().catch(console.error)
