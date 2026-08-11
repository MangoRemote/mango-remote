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
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:520px;margin:0 auto;background:#ffffff">
            <div style="background:#111111;padding:20px 32px;display:flex;align-items:center;gap:8px">
              <span style="font-size:20px">🥭</span>
              <span style="font-size:16px;font-weight:700;color:#ffffff;letter-spacing:-0.3px">Mango<span style="color:#f97316">Remote</span></span>
            </div>

            <div style="padding:36px 32px 28px">
              <h1 style="font-size:26px;font-weight:700;color:#111;letter-spacing:-0.5px;margin:0 0 14px;line-height:1.2">
                You're on the list.
              </h1>
              <p style="font-size:15px;line-height:1.65;color:#444;margin:0 0 16px">
                Every week we'll send you the best remote jobs compatible with living in Asia —
                timezone-friendly roles from employers who mean it.
              </p>

              <div style="background:#fff8f3;border:1px solid #ffe4cc;border-radius:8px;padding:20px 24px;margin:24px 0">
                <p style="font-size:13px;font-weight:700;color:#f97316;letter-spacing:0.06em;text-transform:uppercase;margin:0 0 10px">Premium membership</p>
                <p style="font-size:15px;font-weight:600;color:#111;margin:0 0 8px;line-height:1.3">See every job. Most free members miss the best roles.</p>
                <p style="font-size:14px;color:#555;margin:0 0 16px;line-height:1.6">
                  Free members see 5 jobs. Premium unlocks the full board — every role, every day, before they fill.
                </p>
                <ul style="font-size:14px;color:#444;margin:0 0 20px;padding:0;list-style:none">
                  <li style="padding:4px 0">✓ &nbsp;Full access to every job posted</li>
                  <li style="padding:4px 0">✓ &nbsp;New jobs added daily from vetted sources</li>
                  <li style="padding:4px 0">✓ &nbsp;Weekly digest delivered to your inbox</li>
                  <li style="padding:4px 0">✓ &nbsp;Save jobs and apply when you're ready</li>
                </ul>
                <a href="https://www.mangoremote.com/premium"
                   style="display:inline-block;background:#f97316;color:#fff;font-weight:600;
                          padding:13px 26px;border-radius:6px;text-decoration:none;font-size:15px">
                  Unlock all jobs →
                </a>
              </div>

              <p style="font-size:14px;color:#777;margin:0">
                Or <a href="https://www.mangoremote.com/jobs" style="color:#f97316;text-decoration:none;font-weight:500">browse the free jobs</a> first — no pressure.
              </p>
            </div>

            <div style="height:1px;background:#e5e5e5;margin:0 32px"></div>

            <div style="padding:20px 32px 28px;font-size:12px;color:#999;line-height:1.6">
              MangoRemote · Remote jobs that let you live in Asia<br>
              <a href="https://www.mangoremote.com/unsubscribe?email=${encodeURIComponent(email)}" style="color:#999">Unsubscribe</a>
            </div>
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
