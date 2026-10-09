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
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/set-password`,
        })
        userId = invited?.user?.id ?? null
      }

      if (userId) {
        await getSupabase().from('subscriptions').upsert({
          user_id: userId,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: subId,
          plan: 'premium',
          billing_interval: plan,
          status: 'active',
          current_period_end: new Date(periodEnd * 1000).toISOString(),
        }, { onConflict: 'user_id' })
      }
    }

    // Job posting payment
    const userId = session.metadata?.user_id
    const chunkCount = Number(session.metadata?.job_chunks || 0)
    const jobData = chunkCount > 0
      ? Array.from({ length: chunkCount }, (_, i) => session.metadata?.[`job_data_${i}`] || '').join('')
      : session.metadata?.job_data
    if (session.mode === 'payment' && userId && jobData) {
      const data = JSON.parse(jobData)
      const { data: company } = await getSupabase()
        .from('companies')
        .insert({ name: data.company_name, slug: slugify(data.company_name), logo_url: data.logo_url || null, verified: false })
        .select()
        .single()

      if (company) {
        const { data: cat } = await getSupabase().from('categories').select('id').ilike('name', data.category).single()
        const { data: job } = await getSupabase().from('jobs').insert({
          title: data.title,
          slug: slugify(data.title),
          company_id: company.id,
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
        }).select().single()

        if (job) {
          await getSupabase().from('employer_postings').insert({
            user_id: userId,
            job_id: job.id,
            payment_status: 'paid',
            stripe_payment_id: session.payment_intent as string,
          })

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
