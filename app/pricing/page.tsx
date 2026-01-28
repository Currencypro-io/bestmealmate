'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import Link from 'next/link';

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

interface Plan {
  name: string;
  price: number;
  priceId?: string;
  features: string[];
}

interface Plans {
  free: Plan;
  premium: Plan;
}

export default function PricingPage() {
  const [plans, setPlans] = useState<Plans | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [email, setEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);

  useEffect(() => {
    // Check URL params for success/cancel
    const params = new URLSearchParams(window.location.search);
    if (params.get('success')) {
      setMessage({ 
        type: 'success', 
        text: '🎉 Welcome to Premium! Your subscription is now active. Check your email for a receipt.' 
      });
      // Clear URL params
      window.history.replaceState({}, '', '/pricing');
    } else if (params.get('canceled')) {
      setMessage({ type: 'error', text: 'Checkout was canceled. No charges were made.' });
      window.history.replaceState({}, '', '/pricing');
    }

    // Fetch plans
    fetch('/api/stripe/checkout')
      .then((res) => res.json())
      .then((data) => setPlans(data.plans))
      .catch(console.error);
  }, []);

  const handleSubscribe = async (priceId: string) => {
    if (!stripePromise) {
      setMessage({ type: 'error', text: 'Stripe is not configured. Please set up your environment variables.' });
      return;
    }

    // Check if email is provided
    if (!email) {
      setShowEmailInput(true);
      setMessage({ type: 'error', text: 'Please enter your email address to continue.' });
      return;
    }

    // Basic email validation
    if (!email.includes('@') || !email.includes('.')) {
      setMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    setLoading(priceId);
    setMessage(null);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          email,
          // Generate a secure userId if not authenticated
          userId: crypto.randomUUID(),
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to start checkout. Please try again.' 
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-6">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Meal Planner
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Upgrade to Premium for unlimited recipes, cloud sync, and AI-powered meal suggestions.
          </p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`max-w-md mx-auto mb-8 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Email Input */}
        {(showEmailInput || email) && (
          <div className="max-w-md mx-auto mb-8">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email address (for your receipt and account)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {plans?.free.name || 'Free'}
              </h2>
              <div className="text-4xl font-bold text-gray-900 dark:text-white">
                $0
                <span className="text-lg font-normal text-gray-500">/month</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              {(plans?.free.features || [
                'Weekly meal planning',
                'Basic recipes (15+)',
                'Grocery list generation',
                'Local storage sync',
              ]).map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href="/"
              className="block w-full py-3 px-6 text-center rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Current Plan
            </Link>
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl shadow-xl p-8 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-semibold">
              POPULAR
            </div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                {plans?.premium.name || 'Premium'}
              </h2>
              <div className="text-4xl font-bold text-white">
                ${plans?.premium.price || '4.99'}
                <span className="text-lg font-normal text-white/80">/month</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              {(plans?.premium.features || [
                'Everything in Free',
                'Unlimited custom recipes',
                'Cloud sync across devices',
                'AI meal suggestions',
                'Nutritional tracking',
                'Family sharing (up to 5)',
                'Priority support',
              ]).map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-white">
                  <svg className="w-5 h-5 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => plans?.premium.priceId && handleSubscribe(plans.premium.priceId)}
              disabled={loading !== null || !plans?.premium.priceId}
              className="w-full py-3 px-6 rounded-lg bg-white text-orange-600 font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === plans?.premium.priceId ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : !plans?.premium.priceId ? (
                'Coming Soon'
              ) : (
                'Upgrade to Premium'
              )}
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <details className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">
                Can I cancel anytime?
              </summary>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Yes! You can cancel your subscription at any time. You&apos;ll continue to have access until the end of your billing period.
              </p>
            </details>
            <details className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">
                What payment methods do you accept?
              </summary>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                We accept all major credit cards (Visa, Mastercard, American Express) through our secure Stripe payment processor.
              </p>
            </details>
            <details className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">
                Is my data secure?
              </summary>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Absolutely. We use industry-standard encryption and never store your payment information. All payments are processed securely through Stripe.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
