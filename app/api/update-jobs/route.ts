import { createClient as createServerClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request)
  if (denied) return denied
  let updates: any[] = []

  try {
    const body = await request.json()
    updates = body.updates || []
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!Array.isArray(updates) || updates.length === 0) {
    return NextResponse.json({ error: 'Updates array is required' }, { status: 400 })
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  )

  try {
    let updatedCount = 0

    for (const update of updates) {
      const { apply_url, premium } = update

      if (!apply_url) continue

      const { error } = await supabase
        .from('jobs')
        .update({ premium })
        .eq('apply_url', apply_url)

      if (!error) updatedCount++
    }

    return NextResponse.json({
      message: `Updated ${updatedCount} jobs`,
      updated: updatedCount
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
