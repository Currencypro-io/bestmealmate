import { NextRequest, NextResponse } from 'next/server';
import { stripe, PLANS, findOrCreateCustomer } from '@/lib/stripe';
import { z } from 'zod';

const checkoutSchema = z.object({
  priceId: z.string().regex(/^price_[a-zA-Z0-9]+$/, 'Invalid Stripe price ID format'),
  email: z.string().email('Invalid email address'),
  userId: z.string().uuid().optional(),
});

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe is not configured' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();

    const validation = checkoutSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || 'Invalid request data' },
        { status: 400 }
      );
    }

    const { priceId, userId, email } = validation.data;

    // Find or create customer to enable receipts and subscription management
    const customerId = await findOrCreateCustomer(email, { userId });

    // Build base session config
    const baseConfig = {
      mode: 'subscription' as const,
      payment_method_types: ['card' as const],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${request.nextUrl.origin}/pricing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/pricing?canceled=true`,
      billing_address_collection: 'auto' as const,
      allow_promotion_codes: true,
      subscription_data: {
        metadata: {
          userId: userId || '',
          plan: 'premium',
        },
        description: 'BestMealMate Premium Subscription',
      },
      metadata: {
        userId: userId || '',
        plan: 'premium',
      },
      consent_collection: {
        terms_of_service: 'required' as const,
      },
      custom_text: {
        submit: {
          message: 'Your subscription includes a 7-day money-back guarantee.',
        },
        terms_of_service_acceptance: {
          message: `I agree to the [Terms of Service](${request.nextUrl.origin}/terms)`,
        },
      },
      phone_number_collection: {
        enabled: false,
      },
    };

    // Add customer info
    const sessionConfig = customerId
      ? { ...baseConfig, customer: customerId }
      : { ...baseConfig, customer_email: email, customer_creation: 'always' as const };

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ 
      sessionId: session.id, 
      url: session.url,
      customerId: session.customer,
    });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create checkout session';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ plans: PLANS });
}
