import { runSync } from '../../lib/ats-sync'

export default async () => {
  const summary = await runSync({ dryRun: false })
  return new Response(JSON.stringify(summary), { headers: { 'content-type': 'application/json' } })
}

export const config = { schedule: '@daily' }
