import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const body = await request.json()

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [{
      price: process.env.STRIPE_JOB_POSTING_PRICE_ID!,
      quantity: 1,
    }],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/post-a-job/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/post-a-job`,
    customer_email: user.email,
    metadata: {
      user_id: user.id,
      job_data: JSON.stringify(body),
    },
  })

  return NextResponse.json({ url: session.url })
}
