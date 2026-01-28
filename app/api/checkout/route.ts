import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Validate Stripe configuration
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Payment system not configured' },
      { status: 503 }
    );
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const origin = request.nextUrl.origin;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Meal Planner Subscription' },
            unit_amount: 990,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/success`,
      cancel_url: `${origin}/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
