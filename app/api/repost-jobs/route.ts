import { createClient as createServerClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request)
  if (denied) return denied
  let apply_urls: string[] = []

  try {
    const body = await request.json()
    apply_urls = body.apply_urls || []
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!Array.isArray(apply_urls) || apply_urls.length === 0) {
    return NextResponse.json({ error: 'apply_urls is required' }, { status: 400 })
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  )

  const { data, error } = await supabase
    .from('jobs')
    .update({
      published_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'live'
    })
    .in('apply_url', apply_urls)
    .select('title, slug')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({
    message: `Reposted ${data.length} jobs`,
    reposted: data.map(j => j.slug)
  })
}
