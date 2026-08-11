import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const { email } = await request.json()
  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const { error } = await getSupabase()
    .from('waitlist')
    .upsert({ email }, { onConflict: 'email', ignoreDuplicates: true })

  if (error) {
    console.error('Waitlist insert error:', error)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }

  // Send welcome email if Resend is configured
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: 'MangoRemote <hello@mangoremote.com>',
        to: email,
        subject: 'You\'re on the list 🥭',
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#1a1a1a">
            <h1 style="font-size:24px;font-weight:700;margin:0 0 8px">You're on the list.</h1>
            <p style="font-size:16px;color:#444;margin:0 0 24px">
              Every week we'll send you the best remote jobs that are compatible with living in Asia —
              timezone-friendly roles from employers who mean it.
            </p>
            <p style="font-size:16px;color:#444;margin:0 0 24px">
              In the meantime, browse what's live now:
            </p>
            <a href="https://www.mangoremote.com/jobs"
               style="display:inline-block;background:#f97316;color:#fff;font-weight:600;
                      padding:12px 24px;border-radius:8px;text-decoration:none;font-size:15px">
              Browse remote jobs →
            </a>
            <p style="font-size:13px;color:#888;margin:32px 0 0">
              MangoRemote · Remote jobs that let you live in Asia<br>
              <a href="https://www.mangoremote.com/unsubscribe?email=${encodeURIComponent(email)}"
                 style="color:#888">Unsubscribe</a>
            </p>
          </div>
        `,
      })
    } catch (err) {
      console.error('Welcome email failed:', err)
      // Don't fail the whole request if email fails
    }
  }

  return NextResponse.json({ ok: true })
}
