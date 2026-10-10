import { createClient as createServerClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'

const CATEGORY_RULES: [RegExp, string][] = [
  [/customer success/i, 'customer-success'],
  [/sales|account executive|account manager|business development|\bbdm\b|\bsdr\b|pre-?sales|solutions? (engineer|consultant)|partner(ship)? manager/i, 'sales'],
  [/recruit|talent|\bhr\b|people operations/i, 'hr-recruiting'],
  [/paralegal|legal|counsel|lawyer|litigation/i, 'legal'],
  [/data (engineer|analyst|scientist)|machine learning|\bml\b/i, 'data'],
  [/product (manager|owner|lead)/i, 'product'],
  [/technical writer|writer|documentation|editor/i, 'technical-writing'],
  [/technical support|support|technician|help ?desk|service desk|onboarding/i, 'support'],
  [/marketing|brand|community|social|growth|content|storyteller/i, 'marketing'],
  [/designer|design\b|\bux\b|\bui\b/i, 'design'],
  [/operations|\bops\b/i, 'operations'],
  [/financ|accountant|bookkeep/i, 'finance'],
  [/project manager|program manager|scrum/i, 'project-management'],
  [/engineer|developer|devops|\bsre\b|architect|\bqa\b|tester/i, 'engineering'],
  [/manager|director|head of|\bvp\b|chief/i, 'management'],
]

function inferCategorySlug(title: string): string | null {
  for (const [pattern, slug] of CATEGORY_RULES) {
    if (pattern.test(title)) return slug
  }
  return null
}

function normalizeUrl(raw: string): string {
  try {
    const u = new URL(raw)
    const kept = [...u.searchParams.entries()]
      .filter(([k]) => !/^(utm_|ref$|source$)/i.test(k))
      .sort(([a], [b]) => a.localeCompare(b))
    const query = kept.length ? `?${new URLSearchParams(kept).toString()}` : ''
    return `${u.hostname.replace(/^www\./, '').toLowerCase()}${u.pathname.replace(/\/+$/, '').toLowerCase()}${query}`
  } catch {
    return String(raw || '').trim().toLowerCase()
  }
}

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request)
  if (denied) return denied
  let jobs: any[] = []

  try {
    const body = await request.json()
    jobs = body.jobs
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!Array.isArray(jobs) || jobs.length === 0) {
    return NextResponse.json({ error: 'Jobs array is required and must not be empty' }, { status: 400 })
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  )

  try {
    // Ensure default company exists
    const { data: companies } = await supabase
      .from('companies')
      .select('id')
      .eq('slug', 'unknown')
      .single()

    let defaultCompanyId = companies?.id
    if (!defaultCompanyId) {
      const { data: newCompany } = await supabase
        .from('companies')
        .insert({ slug: 'unknown', name: 'Unknown Company' })
        .select('id')
        .single()
      defaultCompanyId = newCompany?.id
    }

    const { data: existingJobs } = await supabase.from('jobs').select('apply_url, title, company_id')
    const existingUrls = new Set((existingJobs || []).map(j => normalizeUrl(j.apply_url)))
    const titleKey = (companyId: string | null, title: string) => `${companyId}|${title.trim().toLowerCase()}`
    const existingTitles = new Set((existingJobs || []).map(j => titleKey(j.company_id, j.title)))
    const slugs = [...new Set(jobs.map(j => j.company_id).filter(Boolean))]
    const { data: companyRows } = await supabase.from('companies').select('id, slug').in('slug', slugs)
    const companyIdBySlug = new Map((companyRows || []).map(c => [c.slug, c.id]))
    const seen = new Set<string>()
    const newJobs = jobs.filter(j => {
      const key = normalizeUrl(j.apply_url)
      const companyId = companyIdBySlug.get(j.company_id) ?? null
      const sameRole = companyId ? existingTitles.has(titleKey(companyId, j.title)) : false
      if (existingUrls.has(key) || seen.has(key) || sameRole) return false
      seen.add(key)
      return true
    })

    if (newJobs.length === 0) {
      return NextResponse.json({ message: 'All jobs already exist', added: 0 })
    }

    const { data: categoryRows } = await supabase.from('categories').select('id, slug')
    const categoryIdBySlug = new Map((categoryRows || []).map(c => [c.slug, c.id]))
    const { count: premiumCount } = await supabase.from('jobs').select('id', { count: 'exact', head: true }).eq('status', 'live').eq('is_premium', true)
    const { count: liveCount } = await supabase.from('jobs').select('id', { count: 'exact', head: true }).eq('status', 'live')
    let premiumSoFar = premiumCount || 0
    let liveSoFar = liveCount || 0

    const jobsToInsert = newJobs.map(job => {
      const slug = inferCategorySlug(job.title)
      const isPremium = typeof job.is_premium === 'boolean' ? job.is_premium : premiumSoFar / Math.max(liveSoFar, 1) < 0.5
      liveSoFar += 1
      if (isPremium) premiumSoFar += 1
      return {
        company_id: defaultCompanyId,
        title: job.title,
        slug: job.slug,
        description: job.description,
        apply_url: job.apply_url,
        employment_type: job.employment_type,
        region_tags: job.region_tags,
        asia_friendly: job.asia_friendly,
        status: job.status,
        source: job.source,
        category_id: job.category_id || (slug && categoryIdBySlug.get(slug)) || null,
        is_premium: isPremium,
        published_at: new Date().toISOString()
      }
    })

    const { data, error } = await supabase
      .from('jobs')
      .insert(jobsToInsert)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      message: `Added ${data.length} jobs`,
      added: data.length,
      jobs: data.map(j => j.title)
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
