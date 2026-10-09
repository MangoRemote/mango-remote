import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const getStripe = () => new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const body = await request.json()
  const payload = JSON.stringify(body)
  const chunks = payload.match(/[\s\S]{1,400}/g) || []
  if (chunks.length > 10) {
    return NextResponse.json({ error: 'The job description is too long. Please shorten it and try again.' }, { status: 400 })
  }
  const jobChunks = Object.fromEntries(chunks.map((chunk, i) => [`job_data_${i}`, chunk]))

  const session = await getStripe().checkout.sessions.create({
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
      job_chunks: String(chunks.length),
      ...jobChunks,
    },
  })

  return NextResponse.json({ url: session.url })
}
