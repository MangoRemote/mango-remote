import { createClient as createServerClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  let updates: any[] = []

  try {
    const body = await request.json()
    updates = body.updates || []
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  )

  try {
    let updatedCount = 0

    for (const update of updates) {
      const { slug, description, category_id } = update

      if (!slug) continue

      const updateData: any = {}
      if (description) updateData.description = description
      if (category_id) updateData.category_id = category_id

      if (Object.keys(updateData).length === 0) continue

      const { error } = await supabase
        .from('jobs')
        .update(updateData)
        .eq('slug', slug)

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
