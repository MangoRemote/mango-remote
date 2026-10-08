import type { SupabaseClient } from '@supabase/supabase-js'

export async function hasPremiumAccess(supabase: SupabaseClient, userId: string | null | undefined): Promise<boolean> {
  if (!userId) return false
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('plan, status')
    .eq('user_id', userId)
    .single()
  if (sub?.plan === 'premium' && sub?.status === 'active') return true
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single()
  return profile?.role === 'admin'
}
