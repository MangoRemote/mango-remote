import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'gbp',
        product_data: { name: 'MangoRemote Done For You', description: 'Personalised remote job search service' },
        unit_amount: 19700,
        recurring: { interval: 'month' },
      },
      quantity: 1,
    }],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/done-for-you?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/done-for-you`,
    customer_email: user?.email,
    metadata: user ? { user_id: user.id } : {},
  })

  return NextResponse.json({ url: session.url })
}
