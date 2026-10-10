import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const getStripe = () => new Stripe(process.env.STRIPE_SECRET_KEY!)
const getResend = () => new Resend(process.env.RESEND_API_KEY!)

const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') +
    '-' + Math.random().toString(36).slice(2, 7)
}

async function findUserIdByEmail(email: string): Promise<string | null> {
  const target = email.toLowerCase()
  for (let page = 1; page < 1000; page++) {
    const { data, error } = await getSupabase().auth.admin.listUsers({ page, perPage: 1000 })
    if (error || !data?.users?.length) return null
    const match = data.users.find(u => u.email?.toLowerCase() === target)
    if (match) return match.id
    if (data.users.length < 1000) return null
  }
  return null
}

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const email = session.customer_details?.email
    const plan = session.metadata?.plan || 'monthly'

    if (session.mode === 'subscription' && email) {
      const subId = session.subscription as string
      const sub = await getStripe().subscriptions.retrieve(subId)
      const periodEnd = (sub as unknown as { current_period_end: number }).current_period_end

      // Find or create the Supabase user
      let userId: string | null = await findUserIdByEmail(email)

      if (!userId) {
        const { data: invited } = await getSupabase().auth.admin.inviteUserByEmail(email, {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://mangoremote.com'}/auth/set-password`,
        })
        userId = invited?.user?.id ?? null
      }

      if (userId) {
        const { data: existing, error: findErr } = await getSupabase()
          .from('subscriptions').select('id, stripe_subscription_id, status').eq('user_id', userId).maybeSingle()
        if (findErr) return NextResponse.json({ error: findErr.message }, { status: 500 })

        if (existing?.status === 'active' && existing.stripe_subscription_id && existing.stripe_subscription_id !== subId) {
          console.error(`Duplicate premium purchase for user ${userId}: existing ${existing.stripe_subscription_id}, new ${subId}. Needs manual review.`)
          return NextResponse.json({ received: true, duplicate: true })
        }

        const values = {
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: subId,
          plan: 'premium',
          status: 'active',
          current_period_end: new Date(periodEnd * 1000).toISOString(),
        }
        const { error: saveErr } = existing
          ? await getSupabase().from('subscriptions').update(values).eq('id', existing.id)
          : await getSupabase().from('subscriptions').insert({ user_id: userId, ...values })
        if (saveErr) return NextResponse.json({ error: saveErr.message }, { status: 500 })
      } else {
        return NextResponse.json({ error: 'Could not find or create a user for this payment' }, { status: 500 })
      }
    }

    // Job posting payment
    const userId = session.metadata?.user_id
    const chunkCount = Number(session.metadata?.job_chunks || 0)
    const jobData = chunkCount > 0
      ? Array.from({ length: chunkCount }, (_, i) => session.metadata?.[`job_data_${i}`] || '').join('')
      : session.metadata?.job_data
    if (session.mode === 'payment' && userId && jobData) {
      const paymentId = session.payment_intent as string
      const data = JSON.parse(jobData)

      const { data: existingPosting, error: postingErr } = await getSupabase()
        .from('employer_postings').select('id, job_id').eq('stripe_payment_id', paymentId).maybeSingle()
      if (postingErr) return NextResponse.json({ error: postingErr.message }, { status: 500 })
      if (existingPosting?.job_id) return NextResponse.json({ received: true })

      let postingId = existingPosting?.id as string | undefined
      if (!postingId) {
        const { data: posting, error: insertPostingErr } = await getSupabase().from('employer_postings').insert({
          user_id: userId, payment_status: 'paid', stripe_payment_id: paymentId,
        }).select('id').single()
        if (insertPostingErr || !posting) return NextResponse.json({ error: insertPostingErr?.message || 'posting insert failed' }, { status: 500 })
        postingId = posting.id
      }

      const companySlug = slugify(data.company_name)
      let companyId: string | undefined
      const { data: existingCompany } = await getSupabase().from('companies').select('id').eq('slug', companySlug).maybeSingle()
      if (existingCompany) {
        companyId = existingCompany.id
      } else {
        const { data: newCompany, error: companyErr } = await getSupabase().from('companies')
          .insert({ name: data.company_name, slug: companySlug, logo_url: data.logo_url || null, verified: false })
          .select('id').single()
        if (companyErr || !newCompany) return NextResponse.json({ error: companyErr?.message || 'company insert failed' }, { status: 500 })
        companyId = newCompany.id
      }

      const { data: cat } = await getSupabase().from('categories').select('id').ilike('name', data.category).maybeSingle()
      const slugSuffix = paymentId.slice(-6).toLowerCase()
      const { data: job, error: jobErr } = await getSupabase().from('jobs').insert({
        title: data.title,
        slug: `${slugify(data.title)}-${slugSuffix}`,
        company_id: companyId,
        description: data.description,
        salary_min: data.salary_min ? Number(data.salary_min) : null,
        salary_max: data.salary_max ? Number(data.salary_max) : null,
        salary_currency: data.salary_currency,
        apply_url: data.apply_url,
        category_id: cat?.id,
        employment_type: data.employment_type,
        region_tags: [data.location],
        status: 'pending',
        source: 'employer',
      }).select('id').single()
      if (jobErr || !job) return NextResponse.json({ error: jobErr?.message || 'job insert failed' }, { status: 500 })

      const { error: linkErr } = await getSupabase().from('employer_postings').update({ job_id: job.id }).eq('id', postingId)
      if (linkErr) console.error('Could not link posting to job', postingId, job.id, linkErr.message)

      // Send notification email
      try {
            await getResend().emails.send({
              from: 'MangoRemote <noreply@mangoremote.com>',
              to: 'hello@mangoremote.com',
              subject: `New job posting: ${data.title} at ${data.company_name}`,
              html: `
                <h2>New Job Posting Received</h2>
                <p><strong>Job Title:</strong> ${data.title}</p>
                <p><strong>Company:</strong> ${data.company_name}</p>
                <p><strong>Category:</strong> ${data.category}</p>
                <p><strong>Employment Type:</strong> ${data.employment_type}</p>
                <p><strong>Location:</strong> ${data.location}</p>
                ${data.salary_min ? `<p><strong>Salary:</strong> ${data.salary_currency} ${data.salary_min}${data.salary_max ? ' - ' + data.salary_max : '+'}</p>` : ''}
                <p><strong>Apply URL:</strong> <a href="${data.apply_url}">${data.apply_url}</a></p>
                <hr />
                <p><strong>Description:</strong></p>
                <p>${data.description.replace(/\n/g, '<br />')}</p>
              `,
            })
        } catch (err) {
          console.error('Failed to send job posting notification:', err)
        }
    }
  }

  if (event.type === 'customer.subscription.updated') {
    const sub = event.data.object as Stripe.Subscription
    const periodEnd = (sub as unknown as { current_period_end: number }).current_period_end
    await getSupabase().from('subscriptions')
      .update({
        status: sub.status === 'active' ? 'active' : sub.status === 'past_due' ? 'past_due' : 'canceled',
        current_period_end: new Date(periodEnd * 1000).toISOString(),
      })
      .eq('stripe_subscription_id', sub.id)
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    await getSupabase().from('subscriptions')
      .update({ status: 'canceled', plan: 'free' })
      .eq('stripe_subscription_id', sub.id)
  }

  return NextResponse.json({ received: true })
}
