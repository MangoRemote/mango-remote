import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{
      price: process.env.STRIPE_PREMIUM_PRICE_ID!,
      quantity: 1,
    }],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/premium?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/premium`,
    customer_email: user.email,
    metadata: { user_id: user.id },
  })

  return NextResponse.json({ url: session.url })
}
