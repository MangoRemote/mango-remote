import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') +
    '-' + Math.random().toString(36).slice(2, 7)
}

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.user_id
    const jobData = session.metadata?.job_data

    if (session.mode === 'subscription' && userId) {
      const subId = session.subscription as string
      const sub = await stripe.subscriptions.retrieve(subId)
      const periodEnd = (sub as unknown as { current_period_end: number }).current_period_end
      await supabase.from('subscriptions').upsert({
        user_id: userId,
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: subId,
        plan: 'premium',
        status: 'active',
        current_period_end: new Date(periodEnd * 1000).toISOString(),
      }, { onConflict: 'stripe_subscription_id' })
    }

    if (session.mode === 'payment' && userId && jobData) {
      const data = JSON.parse(jobData)
      const { data: company } = await supabase
        .from('companies')
        .insert({ name: data.company_name, slug: slugify(data.company_name), logo_url: data.logo_url || null, verified: false })
        .select()
        .single()

      if (company) {
        const { data: cat } = await supabase.from('categories').select('id').ilike('name', data.category).single()
        const { data: job } = await supabase.from('jobs').insert({
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
          await supabase.from('employer_postings').insert({
            user_id: userId,
            job_id: job.id,
            payment_status: 'paid',
            stripe_payment_id: session.payment_intent as string,
          })
        }
      }
    }
  }

  if (event.type === 'customer.subscription.updated') {
    const sub = event.data.object as Stripe.Subscription
    const periodEnd = (sub as unknown as { current_period_end: number }).current_period_end
    await supabase.from('subscriptions')
      .update({
        status: sub.status === 'active' ? 'active' : sub.status === 'past_due' ? 'past_due' : 'canceled',
        current_period_end: new Date(periodEnd * 1000).toISOString(),
      })
      .eq('stripe_subscription_id', sub.id)
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    await supabase.from('subscriptions')
      .update({ status: 'canceled', plan: 'free' })
      .eq('stripe_subscription_id', sub.id)
  }

  return NextResponse.json({ received: true })
}
