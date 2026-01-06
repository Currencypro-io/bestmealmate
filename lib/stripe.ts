import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Missing STRIPE_SECRET_KEY - Stripe features will be disabled');
}

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-12-15.clover',
    })
  : null;

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    features: [
      'Weekly meal planning',
      'Basic recipes (15+)',
      'Grocery list generation',
      'Local storage sync',
    ],
  },
  premium: {
    name: 'Premium',
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID,
    price: 4.99,
    features: [
      'Everything in Free',
      'Unlimited custom recipes',
      'Cloud sync across devices',
      'AI meal suggestions',
      'Nutritional tracking',
      'Family sharing (up to 5)',
      'Priority support',
    ],
  },
} as const;

export type PlanType = keyof typeof PLANS;

/**
 * Find or create a Stripe customer for the given email
 * This ensures we can send receipts and manage subscriptions properly
 */
export async function findOrCreateCustomer(
  email: string,
  metadata?: { userId?: string; name?: string }
): Promise<string | null> {
  if (!stripe) return null;

  try {
    // Search for existing customer by email
    const existingCustomers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      const customer = existingCustomers.data[0];
      
      // Update metadata if provided
      if (metadata?.userId && customer.metadata?.userId !== metadata.userId) {
        await stripe.customers.update(customer.id, {
          metadata: { ...customer.metadata, userId: metadata.userId },
        });
      }
      
      return customer.id;
    }

    // Create new customer
    const newCustomer = await stripe.customers.create({
      email: email,
      name: metadata?.name,
      metadata: {
        userId: metadata?.userId || '',
        source: 'bestmealmate',
      },
    });

    return newCustomer.id;
  } catch (error) {
    console.error('Error finding/creating customer:', error);
    return null;
  }
}

/**
 * Create a billing portal session for customer self-service
 */
export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string
): Promise<string | null> {
  if (!stripe) return null;

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    return session.url;
  } catch (error) {
    console.error('Error creating billing portal session:', error);
    return null;
  }
}

/**
 * Get subscription details for a customer
 */
export async function getCustomerSubscription(
  customerId: string
): Promise<Stripe.Subscription | null> {
  if (!stripe) return null;

  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    });

    return subscriptions.data[0] || null;
  } catch (error) {
    console.error('Error getting subscription:', error);
    return null;
  }
}

/**
 * Cancel a subscription at period end
 */
export async function cancelSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription | null> {
  if (!stripe) return null;

  try {
    return await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return null;
  }
}

/**
 * Reactivate a subscription that was set to cancel
 */
export async function reactivateSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription | null> {
  if (!stripe) return null;

  try {
    return await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    });
  } catch (error) {
    console.error('Error reactivating subscription:', error);
    return null;
  }
}
