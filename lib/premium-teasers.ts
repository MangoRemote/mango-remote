import type { SupabaseClient } from '@supabase/supabase-js'
import type { Job } from '@/lib/types'

// Premium rows are hidden from non-subscribers at the database level.
// premium_job_teasers() returns only the fields that are safe to show publicly
// (no description, no apply_url). Full Premium rows come from the jobs table
// and are only returned to active Premium members.

interface TeaserRow {
  id: string
  title: string
  slug: string
  employment_type: string
  region_tags: string[]
  asia_friendly: boolean
  published_at: string | null
  created_at: string
  expires_at: string | null
  is_premium: boolean
  is_featured: boolean
  salary_min: number | null
  salary_max: number | null
  salary_currency: string | null
  company_id: string | null
  company_name: string | null
  company_slug: string | null
  category_id: string | null
  category_name: string | null
  category_slug: string | null
}

function teaserToJob(t: TeaserRow): Job {
  return {
    id: t.id,
    title: t.title,
    slug: t.slug,
    company_id: t.company_id ?? '',
    description: '',
    salary_min: t.salary_min,
    salary_max: t.salary_max,
    salary_currency: t.salary_currency,
    apply_url: '',
    category_id: t.category_id ?? '',
    employment_type: t.employment_type as Job['employment_type'],
    tags: [],
    region_tags: t.region_tags || [],
    is_premium: true,
    is_featured: t.is_featured,
    status: 'live',
    source: 'manual',
    asia_friendly: t.asia_friendly,
    published_at: t.published_at,
    expires_at: t.expires_at,
    created_at: t.created_at,
    company: t.company_id ? { id: t.company_id, name: t.company_name ?? '', slug: t.company_slug ?? '', logo_url: null, website: null, industry: null } as Job['company'] : undefined,
    category: t.category_id ? { id: t.category_id, name: t.category_name ?? '', slug: t.category_slug ?? '' } as Job['category'] : undefined,
  }
}

export async function loadPremiumTeasers(supabase: SupabaseClient): Promise<Job[]> {
  const { data } = await supabase.rpc('premium_job_teasers')
  return ((data || []) as TeaserRow[]).map(teaserToJob)
}

export async function loadPremiumTeaser(supabase: SupabaseClient, slug: string): Promise<Job | null> {
  const { data } = await supabase.rpc('premium_job_teasers', { p_slug: slug })
  const row = ((data || []) as TeaserRow[])[0]
  return row ? teaserToJob(row) : null
}

// Same filters as the jobs list, applied in the app because the teaser query takes no filters.
// Search matches title and company name only: teasers don't carry descriptions.
const ASIA_TAGS = ['APAC', 'Japan', 'Vietnam', 'Thailand', 'Indonesia', 'Philippines', 'Malaysia', 'Singapore', 'South Korea', 'Taiwan', 'Hong Kong', 'China', 'India', 'Cambodia', 'Myanmar', 'Sri Lanka']
const LEVEL_TERMS: Record<string, string[]> = {
  entry: ['junior', 'entry', 'graduate', 'intern', 'trainee', 'no experience'],
  mid: ['mid', 'intermediate', 'associate'],
  senior: ['senior', 'sr.', 'sr ', 'principal', 'staff ', 'expert'],
  manager: ['manager', 'lead', 'head of', 'director', 'vp ', 'vice president', 'cto', 'cpo'],
}

export interface TeaserFilters {
  q?: string
  category?: string
  type?: string
  asia?: string
  country?: string
  level?: string
  posted?: string
}

export function filterTeasers(jobs: Job[], f: TeaserFilters): Job[] {
  const q = f.q?.replace(/[,()*%\\]/g, ' ').trim().toLowerCase()
  const days = f.posted ? parseInt(f.posted) : NaN
  const since = isNaN(days) ? null : Date.now() - days * 24 * 60 * 60 * 1000
  const levelTerms = f.level ? LEVEL_TERMS[f.level] : undefined

  return jobs.filter(j => {
    if (q && !j.title.toLowerCase().includes(q) && !(j.company?.name || '').toLowerCase().includes(q)) return false
    if (f.category && (j.category?.slug || '').toLowerCase() !== f.category.toLowerCase()) return false
    if (f.type && j.employment_type !== f.type) return false
    if (f.asia === '1' && !j.region_tags.some(t => ASIA_TAGS.includes(t))) return false
    if (f.country && !j.region_tags.includes(f.country)) return false
    if (levelTerms) {
      const title = j.title.toLowerCase()
      if (!levelTerms.some(t => title.includes(t))) return false
    }
    if (since !== null && new Date(j.published_at || 0).getTime() < since) return false
    return true
  })
}
