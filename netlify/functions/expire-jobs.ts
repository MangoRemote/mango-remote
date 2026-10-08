import { createClient } from '@supabase/supabase-js'

const LIFETIME_DAYS = 35

export default async () => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  )
  const cutoff = new Date(Date.now() - LIFETIME_DAYS * 24 * 60 * 60 * 1000).toISOString()
  const { error, count } = await supabase
    .from('jobs')
    .delete({ count: 'exact' })
    .lt('published_at', cutoff)

  if (error) {
    console.error('expire-jobs failed', error.message)
    return new Response(error.message, { status: 500 })
  }
  console.log(`expire-jobs removed ${count} jobs older than ${LIFETIME_DAYS} days`)
  return new Response(`removed ${count}`)
}

export const config = { schedule: '@daily' }
