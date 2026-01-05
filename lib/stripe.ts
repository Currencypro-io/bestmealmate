import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Missing STRIPE_SECRET_KEY - Stripe features will be disabled');
}

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
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
