import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as 'invite' | 'recovery' | 'email' | null
  const next = searchParams.get('next') ?? '/account'

  const supabase = await createClient()

  let error: { message: string } | null = null
  if (code) {
    ;({ error } = await supabase.auth.exchangeCodeForSession(code))
  } else if (token_hash && type) {
    ;({ error } = await supabase.auth.verifyOtp({ token_hash, type }))
  }
  if (error) {
    return NextResponse.redirect(`${origin}/auth/login?error=link_expired`)
  }

  if (type === 'invite' || type === 'recovery') {
    return NextResponse.redirect(`${origin}/auth/set-password`)
  }

  return NextResponse.redirect(`${origin}${next}`)
}
