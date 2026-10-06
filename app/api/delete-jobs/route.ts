import { createClient as createServerClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  let urls: string[] = []
  let slugs: string[] = []

  try {
    const body = await request.json()
    urls = body.urls || []
    slugs = body.slugs || []
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  )

  try {
    let count = 0
    let error: any = null

    if (urls.length > 0) {
      const result = await supabase
        .from('jobs')
        .delete()
        .in('apply_url', urls)
      count += result.count || 0
      error = result.error
    }

    if (slugs.length > 0) {
      const result = await supabase
        .from('jobs')
        .delete()
        .in('slug', slugs)
      count += result.count || 0
      if (!error) error = result.error
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      message: `Deleted ${count} jobs`,
      deleted: count
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
