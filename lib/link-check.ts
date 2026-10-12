import { createClient, SupabaseClient } from '@supabase/supabase-js'

type Result = 'ok' | 'gone' | 'unverified'

async function probe(url: string): Promise<{ result: Result; code: number | string }> {
  try {
    let res = await fetch(url, { method: 'HEAD', redirect: 'follow', headers: { 'User-Agent': 'MangoRemote-link-check/1.0' } })
    if (res.status === 405 || res.status === 403) {
      res = await fetch(url, { method: 'GET', redirect: 'follow', headers: { 'User-Agent': 'MangoRemote-link-check/1.0' } })
    }
    if (res.status >= 200 && res.status < 400) return { result: 'ok', code: res.status }
    if (res.status === 404 || res.status === 410) return { result: 'gone', code: res.status }
    return { result: 'unverified', code: res.status }
  } catch (e) {
    return { result: 'unverified', code: 'network' }
  }
}

export async function runLinkCheck(opts: { dryRun: boolean; supabase?: SupabaseClient; log?: (m: string) => void }) {
  const log = opts.log || console.log
  const supabase = opts.supabase || createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '')
  const { data: jobs, error } = await supabase.from('jobs').select('id, slug, apply_url, link_fail_count').eq('status', 'live')
  if (error) throw new Error(error.message)
  const list = jobs || []

  const results: Array<{ id: string; slug: string; result: Result; code: number | string; fail: number }> = []
  const batch = 10
  for (let i = 0; i < list.length; i += batch) {
    const chunk = list.slice(i, i + batch)
    const probed = await Promise.all(chunk.map(j => probe(j.apply_url)))
    chunk.forEach((j, k) => results.push({ id: j.id, slug: j.slug, ...probed[k], fail: j.link_fail_count || 0 }))
  }

  const goneCount = results.filter(r => r.result === 'gone').length
  const outageSuspected = list.length > 0 && goneCount / list.length > 0.25
  const summary = { checked: results.length, ok: 0, gone: goneCount, unverified: 0, hidden: 0, flagged: 0, outage_suspected: outageSuspected, errors: [] as string[] }

  for (const r of results) {
    if (r.result === 'ok') { summary.ok++; if (!opts.dryRun) await supabase.from('jobs').update({ link_status: 'ok', link_checked_at: new Date().toISOString(), link_fail_count: 0 }).eq('id', r.id); continue }
    if (r.result === 'unverified') { summary.unverified++; if (!opts.dryRun) await supabase.from('jobs').update({ link_status: 'unverified', link_checked_at: new Date().toISOString() }).eq('id', r.id); continue }
    // gone: only hide after two separate failed checks, and never during a suspected outage
    const fails = r.fail + 1
    if (fails >= 2 && !outageSuspected) {
      summary.hidden++
      if (!opts.dryRun) await supabase.from('jobs').update({ status: 'draft', link_status: 'broken', link_checked_at: new Date().toISOString(), link_fail_count: fails }).eq('id', r.id)
    } else {
      summary.flagged++
      if (!opts.dryRun) await supabase.from('jobs').update({ link_status: outageSuspected ? 'unverified' : 'gone_once', link_checked_at: new Date().toISOString(), link_fail_count: fails }).eq('id', r.id)
    }
  }
  log(JSON.stringify(summary))
  return summary
}
