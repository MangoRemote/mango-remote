import { createClient as createServerClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request)
  if (denied) return denied
  let companies: any[] = []

  try {
    const body = await request.json()
    companies = body.companies || []
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!Array.isArray(companies) || companies.length === 0) {
    return NextResponse.json({ error: 'Companies array is required' }, { status: 400 })
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  )

  try {
    const { data, error } = await supabase
      .from('companies')
      .upsert(companies, { onConflict: 'slug' })
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      message: `Added/updated ${data.length} companies`,
      added: data.length,
      companies: data.map(c => c.name)
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
