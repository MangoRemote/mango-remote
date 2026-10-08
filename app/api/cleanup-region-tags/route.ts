import { createClient as createServerClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'

const GENERIC = ['remote', 'global', 'worldwide', 'anywhere', 'work from anywhere']

function clean(tags: string[]): string[] {
  const out: string[] = []
  for (const raw of tags || []) {
    const t = (raw || '').trim()
    if (!t) continue
    const l = t.toLowerCase()
    if (GENERIC.includes(l)) continue
    const stripped = t.replace(/^remote\s+/i, '').trim()
    const value = stripped || t
    if (!out.includes(value)) out.push(value)
  }
  return out
}

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request)
  if (denied) return denied
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  )

  const { data: jobs, error } = await supabase.from('jobs').select('id, region_tags')
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  let changed = 0
  for (const job of jobs || []) {
    const before = job.region_tags || []
    const after = clean(before)
    if (JSON.stringify(before) === JSON.stringify(after)) continue
    const { error: upErr } = await supabase.from('jobs').update({ region_tags: after }).eq('id', job.id)
    if (!upErr) changed++
  }

  return NextResponse.json({ message: `Cleaned region tags on ${changed} jobs`, changed })
}
