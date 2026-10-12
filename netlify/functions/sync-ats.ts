import { runSync } from '../../lib/ats-sync'
import { runLinkCheck } from '../../lib/link-check'

export default async () => {
  const summary = await runSync({ dryRun: false })
  const links = await runLinkCheck({ dryRun: false })
  return new Response(JSON.stringify({ summary, links }), { headers: { 'content-type': 'application/json' } })
}

export const config = { schedule: '@daily' }
