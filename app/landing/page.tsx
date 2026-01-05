'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Product screenshots (using placeholder structure - replace with real screenshots)
const SCREENSHOTS = {
  weeklyPlan: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop&q=80',
  groceryList: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=600&fit=crop&q=80',
  recipes: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=80',
};

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍽️</span>
            <span className="font-bold text-xl text-orange-600">BestMealMate</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="#how-it-works" className="text-gray-600 hover:text-orange-600 hidden md:block">How It Works</Link>
            <Link href="#pricing" className="text-gray-600 hover:text-orange-600 hidden md:block">Pricing</Link>
            <Link href="/" className="bg-orange-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-orange-600 transition-colors">
              Try Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            The Only Meal Planner That Creates{' '}
            <span className="text-orange-500">One Plan</span> for Your{' '}
            <span className="text-orange-500">Whole Family</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Keto dad. Vegan teen. Picky toddler. One dinner plan that works for everyone.
            Save 3-5 hours/week and cut food waste by 40%.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/" className="bg-orange-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-orange-600 transition-all shadow-lg hover:shadow-xl">
              Start Planning Free →
            </Link>
            <button
              onClick={() => setShowDemo(true)}
              className="bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-lg border-2 border-orange-200 hover:border-orange-400 transition-all"
            >
              See Demo (No Signup)
            </button>
          </div>

          <p className="text-sm text-gray-500">
            Free forever for basic planning. No credit card required.
          </p>
        </div>
      </header>

      {/* Product Screenshot Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            See Your Week at a Glance
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Plan breakfast, lunch, and dinner for the whole family. Drag and drop meals,
            get smart suggestions, and generate your grocery list in one click.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-6 shadow-lg">
              <div className="relative h-48 mb-4 rounded-xl overflow-hidden">
                <Image src={SCREENSHOTS.weeklyPlan} alt="Weekly meal plan calendar view" fill className="object-cover" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Weekly Plan View</h3>
              <p className="text-gray-600 text-sm">
                See all 21 meals at once. Color-coded by diet type. Lock favorites to repeat weekly.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 shadow-lg">
              <div className="relative h-48 mb-4 rounded-xl overflow-hidden">
                <Image src={SCREENSHOTS.groceryList} alt="Smart grocery list" fill className="object-cover" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Smart Grocery List</h3>
              <p className="text-gray-600 text-sm">
                Auto-generated from your plan. Grouped by aisle. Share to any app or print.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 shadow-lg">
              <div className="relative h-48 mb-4 rounded-xl overflow-hidden">
                <Image src={SCREENSHOTS.recipes} alt="Recipe collection" fill className="object-cover" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">15+ Built-in Recipes</h3>
              <p className="text-gray-600 text-sm">
                Step-by-step instructions, nutritional info, and serving sizes. Add your own favorites.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Unique Value Props - AI Behaviors */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            AI That Actually Understands Families
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Not just another meal database. Our AI learns what your family actually eats.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-orange-400">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">Multi-Diet Magic</h3>
              <p className="text-gray-600">
                <strong>Example:</strong> Dad is keto, Mom is vegetarian, kids hate vegetables.
                We suggest: Taco night with cauliflower rice (Dad), black bean tacos (Mom),
                cheese quesadillas (kids) - one cooking session, everyone happy.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-amber-400">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">Learns From Rejections</h3>
              <p className="text-gray-600">
                <strong>Example:</strong> Your 5-year-old rejected salmon 3 times?
                We stop suggesting it and find kid-friendly fish alternatives
                (fish sticks, tuna melts) they might actually eat.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-yellow-400">
              <div className="text-4xl mb-4">♻️</div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">Leftover Optimization</h3>
              <p className="text-gray-600">
                <strong>Example:</strong> Roast chicken on Sunday becomes chicken salad
                for Monday lunch and chicken fried rice for Tuesday dinner.
                Cook once, eat three times.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            From Signup to Dinner in 5 Minutes
          </h2>

          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-xl">1</div>
              <div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">Tell Us About Your Household</h3>
                <p className="text-gray-600">
                  How many people? Any dietary restrictions (keto, vegan, allergies)?
                  Picky eaters? Cooking skill level? Takes 2 minutes.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-xl">2</div>
              <div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">Get Your Personalized Weekly Plan</h3>
                <p className="text-gray-600">
                  We generate 21 meals that work for everyone. Don't like something?
                  Swap it with one tap. Lock your favorites to repeat weekly.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-xl">3</div>
              <div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">Generate Your Grocery List</h3>
                <p className="text-gray-600">
                  One click creates your shopping list, grouped by store aisle.
                  Share to your phone, print it, or export to your favorite grocery app.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-xl">4</div>
              <div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">Cook With Confidence</h3>
                <p className="text-gray-600">
                  Each recipe has step-by-step instructions, prep times, and nutritional info.
                  Add to your calendar so you never forget what's for dinner.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Simple, Honest Pricing
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Start free, upgrade when you need more. Cancel anytime.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Solo/Couple */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Solo / Couple</h3>
                <p className="text-sm text-gray-500">Perfect for 1-2 people</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">$0</span>
                  <span className="text-gray-500">/month</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {['Weekly meal planning', '15+ built-in recipes', 'Grocery list generator', 'Local storage sync', 'Basic dietary filters'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-600 text-sm">
                    <span className="text-green-500">✓</span> {feature}
                  </li>
                ))}
              </ul>
              <Link href="/" className="block w-full py-3 text-center rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                Start Free
              </Link>
            </div>

            {/* Growing Family */}
            <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl p-8 shadow-xl relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-orange-600 px-4 py-1 rounded-full text-sm font-bold shadow">
                MOST POPULAR
              </div>
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-1">Growing Family</h3>
                <p className="text-sm text-white/80">For families of 3-5</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white">$4.99</span>
                  <span className="text-white/80">/month</span>
                </div>
                <p className="text-xs text-white/70 mt-2">
                  Save ~$100/mo in wasted food = 20x ROI
                </p>
              </div>
              <ul className="space-y-3 mb-8">
                {['Everything in Free', 'Multi-diet support (keto+vegan in one plan)', 'Picky eater mode', 'Cloud sync across devices', 'Unlimited custom recipes', 'AI meal suggestions', 'Priority support'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-white text-sm">
                    <span>✓</span> {feature}
                  </li>
                ))}
              </ul>
              <Link href="/pricing" className="block w-full py-3 text-center rounded-lg bg-white text-orange-600 font-semibold hover:bg-gray-100 transition-colors">
                Start 7-Day Trial
              </Link>
            </div>

            {/* Big Household */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Big Household</h3>
                <p className="text-sm text-gray-500">6+ people or multi-gen</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">$9.99</span>
                  <span className="text-gray-500">/month</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {['Everything in Growing Family', 'Unlimited family members', 'Batch cooking optimizer', 'Leftover tracking', 'Nutritional goals per person', 'Export to grocery apps', 'Early access to new features'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-600 text-sm">
                    <span className="text-green-500">✓</span> {feature}
                  </li>
                ))}
              </ul>
              <Link href="/pricing" className="block w-full py-3 text-center rounded-lg border-2 border-orange-400 text-orange-600 font-semibold hover:bg-orange-50 transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Questions? We've Got Answers
          </h2>

          <div className="space-y-4">
            <details className="bg-gray-50 rounded-lg p-6 group">
              <summary className="font-semibold text-gray-900 cursor-pointer flex justify-between items-center">
                How is this different from Mealime or MyFitnessPal?
                <span className="text-orange-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600">
                Those apps are great for individuals. BestMealMate is built for <strong>families with mixed diets</strong>.
                Dad's doing keto, Mom's vegetarian, kids are picky? We create ONE dinner plan that satisfies everyone,
                not separate plans you have to merge yourself.
              </p>
            </details>

            <details className="bg-gray-50 rounded-lg p-6 group">
              <summary className="font-semibold text-gray-900 cursor-pointer flex justify-between items-center">
                What if my kid rejects half the meals?
                <span className="text-orange-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600">
                Our AI learns from rejections. Mark a meal as "didn't work" and we'll stop suggesting it -
                plus find similar alternatives they might actually eat. Over time, your plan gets smarter.
              </p>
            </details>

            <details className="bg-gray-50 rounded-lg p-6 group">
              <summary className="font-semibold text-gray-900 cursor-pointer flex justify-between items-center">
                Can I import my own recipes?
                <span className="text-orange-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600">
                Yes! Add any custom recipe with ingredients, instructions, and dietary tags.
                They'll appear in your suggestions just like our built-in recipes.
              </p>
            </details>

            <details className="bg-gray-50 rounded-lg p-6 group">
              <summary className="font-semibold text-gray-900 cursor-pointer flex justify-between items-center">
                Does it work with grocery delivery apps?
                <span className="text-orange-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600">
                Right now you can export your list to Notes, print it, or share via any app.
                Direct Instacart/Walmart integration is on our roadmap for Q2 2026.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-orange-500 to-amber-500">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stop Asking "What's For Dinner?"
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join families who save 3-5 hours every week with smarter meal planning.
          </p>
          <Link href="/" className="inline-block bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-lg">
            Start Planning Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍽️</span>
            <span className="font-bold text-xl text-white">BestMealMate</span>
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/pricing" className="hover:text-white">Pricing</Link>
            <Link href="/" className="hover:text-white">App</Link>
            <a href="mailto:hello@bestmealmate.com" className="hover:text-white">Contact</a>
          </div>
          <p className="text-sm">© 2026 BestMealMate. All rights reserved.</p>
        </div>
      </footer>

      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowDemo(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto p-8" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Quick Demo</h3>
              <button onClick={() => setShowDemo(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <div className="space-y-6">
              <div className="bg-orange-50 p-6 rounded-xl">
                <h4 className="font-bold text-lg mb-2">🏠 Sample Family</h4>
                <p className="text-gray-600 text-sm">
                  Dad (keto), Mom (no restrictions), 8-year-old (picky, no spicy food), 4-year-old (allergic to nuts)
                </p>
              </div>
              <div className="bg-green-50 p-6 rounded-xl">
                <h4 className="font-bold text-lg mb-2">🍽️ Tuesday Dinner Suggestion</h4>
                <p className="text-gray-600 text-sm mb-3">
                  <strong>Build-Your-Own Taco Bar</strong>
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Dad: Lettuce wraps with ground beef, cheese, sour cream</li>
                  <li>• Mom: Corn tortillas with everything</li>
                  <li>• Kids: Cheese quesadillas with mild salsa on the side</li>
                </ul>
                <p className="text-xs text-gray-400 mt-3">Prep time: 25 min | One cooking session | Everyone eats together</p>
              </div>
              <Link href="/" className="block w-full bg-orange-500 text-white text-center py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors">
                Try It Yourself - Free
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
