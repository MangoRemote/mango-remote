import { createClient as createServerClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  )

  try {
    // Calculate date 40 days ago
    const fortyDaysAgo = new Date()
    fortyDaysAgo.setDate(fortyDaysAgo.getDate() - 40)

    // Find jobs older than 40 days
    const { data: oldJobs } = await supabase
      .from('jobs')
      .select('id, title, published_at')
      .lt('published_at', fortyDaysAgo.toISOString())

    if (!oldJobs || oldJobs.length === 0) {
      return NextResponse.json({
        message: 'No jobs older than 40 days found',
        deleted: 0
      })
    }

    // Delete old jobs
    const { count, error } = await supabase
      .from('jobs')
      .delete()
      .lt('published_at', fortyDaysAgo.toISOString())

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      message: `Deleted ${count} jobs older than 40 days`,
      deleted: count,
      jobs_deleted: oldJobs.map(j => j.title)
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
