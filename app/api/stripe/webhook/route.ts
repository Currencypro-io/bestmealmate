import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Create a Supabase admin client for webhook processing
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });
}

// Simple in-memory processed events cache (for idempotency)
const processedEvents = new Set<string>();

async function updateUserSubscription(data: {
  userId?: string;
  email?: string;
  customerId: string;
  subscriptionId?: string;
  status: string;
  plan: string;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
}) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.log('Supabase not available, skipping database update');
    return;
  }

  try {
    // First try to find by stripe_customer_id
    const { data: existingByCustomer } = await supabase
      .from('user_profiles')
      .select('id, user_id')
      .eq('stripe_customer_id', data.customerId)
      .limit(1);

    if (existingByCustomer && existingByCustomer.length > 0) {
      await supabase
        .from('user_profiles')
        .update({
          subscription_status: data.status === 'active' ? data.plan : data.status,
          subscription_id: data.subscriptionId,
          subscription_period_end: data.currentPeriodEnd?.toISOString(),
          cancel_at_period_end: data.cancelAtPeriodEnd || false,
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_customer_id', data.customerId);
      
      console.log('Updated subscription for customer:', data.customerId);
      return;
    }

    // If userId provided, create/update profile
    if (data.userId) {
      await supabase
        .from('user_profiles')
        .upsert({
          user_id: data.userId,
          email: data.email,
          stripe_customer_id: data.customerId,
          subscription_status: data.status === 'active' ? data.plan : data.status,
          subscription_id: data.subscriptionId,
          subscription_period_end: data.currentPeriodEnd?.toISOString(),
          cancel_at_period_end: data.cancelAtPeriodEnd || false,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      console.log('Created/updated user profile for:', data.userId);
    }
  } catch (error) {
    console.error('Error updating user subscription:', error);
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;
  const email = session.customer_email || session.customer_details?.email;

  console.log('✅ Checkout completed:', {
    sessionId: session.id,
    userId,
    customerId,
    subscriptionId,
    email,
    amountTotal: session.amount_total,
  });

  await updateUserSubscription({
    userId,
    email: email || undefined,
    customerId,
    subscriptionId,
    status: 'active',
    plan: 'premium',
  });

  // Stripe automatically sends receipt email when payment succeeds!
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  const customerId = subscription.customer as string;

  console.log('📝 Subscription updated:', {
    subscriptionId: subscription.id,
    status: subscription.status,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  });

  // Get current period end - handle both expanded and non-expanded formats
  const currentPeriodEnd = 'current_period_end' in subscription 
    ? new Date((subscription as Stripe.Subscription & { current_period_end: number }).current_period_end * 1000)
    : new Date();

  await updateUserSubscription({
    userId,
    customerId,
    subscriptionId: subscription.id,
    status: subscription.status,
    plan: subscription.status === 'active' ? 'premium' : 'free',
    currentPeriodEnd,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  const customerId = subscription.customer as string;

  console.log('❌ Subscription canceled:', { subscriptionId: subscription.id });

  await updateUserSubscription({
    userId,
    customerId,
    subscriptionId: subscription.id,
    status: 'canceled',
    plan: 'free',
  });
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  console.log('💰 Invoice paid:', {
    invoiceId: invoice.id,
    amountPaid: invoice.amount_paid,
    receiptUrl: invoice.hosted_invoice_url,
    pdfUrl: invoice.invoice_pdf,
  });
  // Receipt is automatically sent by Stripe!
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  console.log('⚠️ Payment failed:', {
    invoiceId: invoice.id,
    customerId,
    attemptCount: invoice.attempt_count,
    nextAttempt: invoice.next_payment_attempt 
      ? new Date(invoice.next_payment_attempt * 1000) 
      : null,
  });

  // TODO: Send payment failed notification email to customer
}

async function handleChargeSucceeded(charge: Stripe.Charge) {
  console.log('💳 Charge succeeded:', {
    chargeId: charge.id,
    amount: charge.amount / 100,
    currency: charge.currency,
    receiptUrl: charge.receipt_url,
    receiptEmail: charge.receipt_email,
  });
  // Receipt URL: charge.receipt_url
  // Stripe emails receipt to charge.receipt_email automatically!
}

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe is not configured' },
      { status: 503 }
    );
  }

  if (!webhookSecret) {
    console.error('Missing STRIPE_WEBHOOK_SECRET');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  // Idempotency check
  if (processedEvents.has(event.id)) {
    return NextResponse.json({ received: true, skipped: true });
  }

  console.log(`📨 Webhook: ${event.type} (${event.id})`);

  try {
    switch (event.type) {
      // Checkout
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      // Subscriptions
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.paused':
      case 'customer.subscription.resumed':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      // Invoices (receipts!)
      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      // Charges (receipts!)
      case 'charge.succeeded':
        await handleChargeSucceeded(event.data.object as Stripe.Charge);
        break;

      default:
        console.log(`Unhandled: ${event.type}`);
    }

    // Mark as processed
    processedEvents.add(event.id);
    if (processedEvents.size > 1000) {
      const iter = processedEvents.values();
      for (let i = 0; i < 500; i++) {
        const val = iter.next().value;
        if (val) processedEvents.delete(val);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    // Return 500 so Stripe will retry the webhook
    // Only return 200 for successful processing or 400 for permanent failures
    return NextResponse.json(
      { error: 'Handler failed - will retry' },
      { status: 500 }
    );
  }
}
