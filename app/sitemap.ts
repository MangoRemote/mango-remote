import { createClient } from '@supabase/supabase-js'
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: jobs } = await supabase
    .from('jobs')
    .select('slug, published_at')
    .eq('status', 'live')

  const base = 'https://mangoremote.com'

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${base}/jobs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/premium`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/post-a-job`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/done-for-you`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ]

  const jobPages: MetadataRoute.Sitemap = (jobs || []).map(job => ({
    url: `${base}/jobs/${job.slug}`,
    lastModified: job.published_at ? new Date(job.published_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...jobPages]
}
