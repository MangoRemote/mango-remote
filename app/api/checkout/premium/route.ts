import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const PLAN_PRICE_IDS: Record<string, string> = {
  monthly: process.env.STRIPE_PRICE_MONTHLY!,
  quarterly: process.env.STRIPE_PRICE_QUARTERLY!,
  annual: process.env.STRIPE_PRICE_ANNUAL!,
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const plan = searchParams.get('plan') || 'monthly'
  const priceId = PLAN_PRICE_IDS[plan]

  if (!priceId) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/welcome`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/premium`,
    // Stripe collects the email — we create the account after payment
    billing_address_collection: 'auto',
    metadata: { plan },
  })

  return NextResponse.redirect(session.url!, 303)
}
