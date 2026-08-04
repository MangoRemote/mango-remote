import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ ids: [] })

  const { data } = await supabase
    .from('saved_jobs')
    .select('job_id')
    .eq('user_id', user.id)

  return NextResponse.json({ ids: (data || []).map(r => r.job_id) })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { job_id } = await request.json()
  await supabase.from('saved_jobs').upsert({ user_id: user.id, job_id }, { onConflict: 'user_id,job_id' })

  return NextResponse.json({ ok: true })
}

export async function DELETE(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { job_id } = await request.json()
  await supabase.from('saved_jobs').delete().eq('user_id', user.id).eq('job_id', job_id)

  return NextResponse.json({ ok: true })
}
