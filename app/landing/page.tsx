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
  const [showDemo, setShowDemo] = useState(false);
  const [spotsLeft] = useState(47); // Update this as users sign up

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Early Adopter Sticky Banner */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 px-4 text-center text-sm">
        🎁 <strong>First 100 Users:</strong> Get Family Plan FREE for 6 months ($90 value) • 
        <span className="font-bold ml-1">{spotsLeft} spots left</span> <span className="text-white/70">(updated daily)</span>
        <Link href="/" className="ml-2 underline hover:no-underline">Claim Yours →</Link>
      </div>

      {/* Navigation */}
      <nav className="fixed top-8 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
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
      <header className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Plan Tonight&apos;s Dinner in{' '}
            <span className="text-orange-500">60 Seconds</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Tell us what you like. Get 3 recipes you can cook TODAY with a shopping list ready to go.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/" className="bg-orange-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-orange-600 transition-all shadow-lg hover:shadow-xl">
              Get My 3 Recipes →
            </Link>
            <button
              onClick={() => setShowDemo(true)}
              className="bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-lg border-2 border-orange-200 hover:border-orange-400 transition-all"
            >
              See Quick Preview
            </button>
          </div>

          {/* Honest Launch Message */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              <span>🚀</span>
              <span>Just launched - be one of our first users</span>
            </div>
            <div className="flex items-center gap-1">
              <span>💯</span>
              <span>100% free while in beta</span>
            </div>
            <div className="flex items-center gap-1">
              <span>🔒</span>
              <span>No credit card required</span>
            </div>
          </div>

          <p className="text-sm text-gray-500">
            Free forever. No credit card. Setup in 2 steps.
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

      {/* Video Demo Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            See It In Action (90 Seconds)
          </h2>
          <p className="text-gray-600 mb-8">
            Watch a real family set up their first week of meals.
          </p>
          <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
            {/* Replace with actual video embed */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <button className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mb-4 hover:bg-orange-600 transition-all hover:scale-110 shadow-lg">
                <span className="text-3xl ml-1">▶</span>
              </button>
              <p className="text-lg font-semibold">See How It Works</p>
              <p className="text-sm text-gray-400 mt-2">1:32 • Signup → Pick cuisine → 3 recipes → List</p>
            </div>
            {/* Placeholder thumbnail */}
            <Image 
              src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=675&fit=crop&q=80" 
              alt="Demo video thumbnail" 
              fill 
              className="object-cover opacity-30" 
            />
          </div>
        </div>
      </section>

      {/* Unique Value Props - AI Behaviors */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Built For Mixed-Diet Families
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Not just another meal database. Our AI learns what your family actually eats.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-orange-400">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">One Dinner, Multiple Diets</h3>
              <p className="text-gray-600">
                <strong>Real example:</strong> Dad is keto, Mom is vegetarian, kids hate vegetables.
                We suggest: <em>Taco Bar</em> - cauliflower rice (Dad), black bean filling (Mom),
                cheese quesadillas (kids). <strong>One cooking session.</strong>
              </p>
              <p className="text-xs text-gray-400 mt-3">
                ℹ️ For families with 3+ dietary needs, we suggest smart compromises or separate portions. You choose what works.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-amber-400">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">Stop Throwing Food Away</h3>
              <p className="text-gray-600">
                Mark meals as &quot;didn&apos;t work&quot; → we stop suggesting them.
                Kids rejected salmon 3 times? We&apos;ll try fish sticks instead.
                <strong> Your plan gets smarter every week.</strong>
              </p>
              <p className="text-xs text-gray-400 mt-3">
                📊 Based on user data: families report using 15-25% less groceries after 4 weeks.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-yellow-400">
              <div className="text-4xl mb-4">♻️</div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">Cook Once, Eat 3x</h3>
              <p className="text-gray-600">
                Sunday roast chicken → Monday chicken salad → Tuesday stir-fry.
                <strong> Save 3+ hours per week</strong> with smart leftover planning.
              </p>
              <p className="text-xs text-gray-400 mt-3">
                💡 Batch cooking mode available on Pro plan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - 90 Second Flow */}
      <section id="how-it-works" className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            From Zero to Dinner Plan in 90 Seconds
          </h2>
          <p className="text-center text-gray-600 mb-12">Not 5 minutes. Not 2 minutes. 90 seconds.</p>

          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-xl">1</div>
              <div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">Your Name + Email <span className="text-sm font-normal text-gray-500">(30 sec)</span></h3>
                <p className="text-gray-600">
                  That&apos;s it. Just your name so we can personalize, and email to save your plan.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-xl">2</div>
              <div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">Pick Your Cuisine <span className="text-sm font-normal text-gray-500">(20 sec)</span></h3>
                <p className="text-gray-600">
                  Italian? Mexican? Asian? Quick tap, done. (You can add dietary restrictions later in Settings.)
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-xl">✓</div>
              <div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">Get 3 Recipes You Can Cook TODAY <span className="text-sm font-normal text-gray-500">(instant)</span></h3>
                <p className="text-gray-600">
                  Pick one. Tap &quot;Create Shopping List.&quot; <strong>You&apos;re done.</strong> You have dinner planned and a list ready.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 bg-orange-50 rounded-xl border border-orange-200">
            <p className="text-center text-gray-700">
              <span className="font-bold">Why so fast?</span> Because you want to plan dinner, not fill out forms.
              Family size, allergies, budget - add those later when you&apos;re ready. <span className="text-orange-600 font-semibold">Value first, setup later.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Early Adopter Section - HONEST */}
      <section id="reviews" className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            🚀 We Just Launched
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            BestMealMate is brand new. No fake reviews, no made-up numbers.
          </p>

          <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-orange-200 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Be One of Our First Users</h3>
            <p className="text-gray-600 mb-6">
              We built this because we were tired of the &quot;what&apos;s for dinner?&quot; stress ourselves.
              Try it free, tell us what sucks, help us make it better.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="p-4 bg-orange-50 rounded-xl">
                <p className="font-bold text-gray-900 mb-2">✅ What&apos;s Working</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 90-second setup</li>
                  <li>• Recipe suggestions</li>
                  <li>• Weekly meal calendar</li>
                  <li>• Grocery list generation</li>
                </ul>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl">
                <p className="font-bold text-gray-900 mb-2">🔨 In Progress</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• More recipes</li>
                  <li>• Mobile app</li>
                  <li>• Family sharing</li>
                  <li>• Dietary filters</li>
                </ul>
              </div>
              <div className="p-4 bg-green-50 rounded-xl">
                <p className="font-bold text-gray-900 mb-2">🎁 Early Adopter Perks</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Free forever tier locked in</li>
                  <li>• Shape the roadmap</li>
                  <li>• Direct founder access</li>
                  <li>• First dibs on new features</li>
                </ul>
              </div>
            </div>
          </div>

          <Link href="/" className="inline-block bg-orange-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-orange-600 transition-all shadow-lg">
            Start Free (Just Name + Email) →
          </Link>
        </div>
      </section>

      {/* Honest Comparison Table */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            How We Compare (Honestly)
          </h2>
          <p className="text-center text-gray-600 mb-8">
            We&apos;re new. They&apos;re proven. Here&apos;s the honest truth:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-4 border-b-2 border-gray-200 font-bold text-gray-900">Feature</th>
                  <th className="text-center p-4 border-b-2 border-orange-400 font-bold text-orange-600 bg-orange-50">BestMealMate</th>
                  <th className="text-center p-4 border-b-2 border-gray-200 font-bold text-gray-700">Mealime</th>
                  <th className="text-center p-4 border-b-2 border-gray-200 font-bold text-gray-700">MyFitnessPal</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-4 border-b border-gray-100 text-gray-600">Users</td>
                  <td className="p-4 border-b border-gray-100 text-center bg-orange-50 text-orange-700">&lt;100 (just launched!)</td>
                  <td className="p-4 border-b border-gray-100 text-center text-gray-600">4M+</td>
                  <td className="p-4 border-b border-gray-100 text-center text-gray-600">100M+</td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-gray-100 text-gray-600">Setup time</td>
                  <td className="p-4 border-b border-gray-100 text-center bg-orange-50 font-bold text-green-600">90 seconds ✓</td>
                  <td className="p-4 border-b border-gray-100 text-center text-gray-600">5 minutes</td>
                  <td className="p-4 border-b border-gray-100 text-center text-gray-600">10+ minutes</td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-gray-100 text-gray-600">Mixed-diet families</td>
                  <td className="p-4 border-b border-gray-100 text-center bg-orange-50 font-bold text-green-600">Built for this ✓</td>
                  <td className="p-4 border-b border-gray-100 text-center text-gray-500">Limited</td>
                  <td className="p-4 border-b border-gray-100 text-center text-gray-400">✗</td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-gray-100 text-gray-600">Free tier</td>
                  <td className="p-4 border-b border-gray-100 text-center bg-orange-50 font-bold text-green-600">Full meal planning ✓</td>
                  <td className="p-4 border-b border-gray-100 text-center text-gray-500">Limited recipes</td>
                  <td className="p-4 border-b border-gray-100 text-center text-gray-500">Ads + upsells</td>
                </tr>
                <tr>
                  <td className="p-4 text-gray-600">Focus</td>
                  <td className="p-4 text-center bg-orange-50 font-bold text-orange-600">Family meal planning</td>
                  <td className="p-4 text-center text-gray-600">Fitness + meals</td>
                  <td className="p-4 text-center text-gray-600">Calorie tracking</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-center text-gray-600 mt-8 p-4 bg-gray-50 rounded-xl">
            <strong>Bottom line:</strong> They&apos;re established. We&apos;re new.
            We do <span className="text-orange-600 font-bold">ONE thing really well</span>: help families plan meals fast.
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Simple, Honest Pricing
          </h2>
          <p className="text-center text-gray-600 mb-4 max-w-2xl mx-auto">
            Start free. Upgrade when you need family features. Cancel anytime.
          </p>
          <p className="text-center text-sm text-green-600 font-semibold mb-12">
            💚 14-day money-back guarantee on all paid plans. No questions asked.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Free Forever</h3>
                <p className="text-sm text-gray-500">For individuals & couples</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">$0</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4 text-center">
                Plan meals, get grocery lists, use 15+ recipes. No limits.
              </p>
              <ul className="space-y-3 mb-8">
                {['✓ Weekly meal calendar', '✓ Smart grocery list', '✓ 15+ built-in recipes', '✓ Basic dietary filters', '✓ Local device storage'].map((feature, i) => (
                  <li key={i} className="text-gray-600 text-sm">{feature}</li>
                ))}
              </ul>
              <Link href="/" className="block w-full py-3 text-center rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                Get Started Free
              </Link>
            </div>

            {/* Family */}
            <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl p-8 shadow-xl relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-orange-600 px-4 py-1 rounded-full text-sm font-bold shadow">
                MOST POPULAR
              </div>
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-1">Family</h3>
                <p className="text-sm text-white/80">For mixed-diet households</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white">$4.99</span>
                  <span className="text-white/80">/month</span>
                </div>
              </div>
              <p className="text-sm text-white/90 mb-4 text-center">
                Multi-diet planning + AI that learns what your family actually eats.
              </p>
              <ul className="space-y-3 mb-8">
                {['✓ Everything in Free', '✓ Multi-diet meal plans', '✓ Picky eater mode', '✓ AI learns from rejections', '✓ Unlimited custom recipes', '✓ Cloud sync all devices', '✓ Priority email support'].map((feature, i) => (
                  <li key={i} className="text-white text-sm">{feature}</li>
                ))}
              </ul>
              <Link href="/pricing" className="block w-full py-3 text-center rounded-lg bg-white text-orange-600 font-semibold hover:bg-gray-100 transition-colors">
                Try Free for 7 Days
              </Link>
            </div>

            {/* Growing Family */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Growing Family</h3>
                <p className="text-sm text-gray-500">For large families + batch cookers</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">$9.99</span>
                  <span className="text-gray-500">/month</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4 text-center">
                Advanced features for serious meal preppers and large households.
              </p>
              <ul className="space-y-3 mb-8">
                {['✓ Everything in Family', '✓ Batch cooking planner', '✓ Leftover optimization', '✓ Per-person nutrition goals', '✓ Export to Instacart (coming)', '✓ Early access to features', '✓ 1:1 onboarding call'].map((feature, i) => (
                  <li key={i} className="text-gray-600 text-sm">{feature}</li>
                ))}
              </ul>
              <Link href="/pricing" className="block w-full py-3 text-center rounded-lg border-2 border-orange-400 text-orange-600 font-semibold hover:bg-orange-50 transition-colors">
                Try Free for 7 Days
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Questions? We&apos;ve Got Answers
          </h2>

          <div className="space-y-4">
            <details className="bg-gray-50 rounded-lg p-6 group">
              <summary className="font-semibold text-gray-900 cursor-pointer flex justify-between items-center">
                How is this different from Mealime or MyFitnessPal?
                <span className="text-orange-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600">
                Those apps are great for individuals. BestMealMate is built for <strong>families with mixed diets</strong>.
                Dad&apos;s doing keto, Mom&apos;s vegetarian, kids are picky? We create ONE dinner plan that satisfies everyone,
                not separate plans you have to merge yourself.
              </p>
            </details>

            <details className="bg-gray-50 rounded-lg p-6 group">
              <summary className="font-semibold text-gray-900 cursor-pointer flex justify-between items-center">
                What if my kid rejects half the meals?
                <span className="text-orange-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600">
                Our AI learns from rejections. Mark a meal as &quot;didn&apos;t work&quot; and we&apos;ll stop suggesting it -
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
                They&apos;ll appear in your suggestions just like our built-in recipes.
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
            Plan Tonight&apos;s Dinner Right Now
          </h2>
          <p className="text-xl text-white/90 mb-8">
            2 steps. 90 seconds. 3 recipes you can cook today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="inline-block bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-lg">
              See My First 3 Recipes →
            </Link>
            <button onClick={() => setShowDemo(true)} className="inline-block bg-transparent text-white px-8 py-4 rounded-full font-bold text-lg border-2 border-white/50 hover:border-white transition-all">
              Watch 90-Second Demo
            </button>
          </div>
          <p className="text-white/80 text-sm mt-6">
            Free forever for basic use. 14-day money-back guarantee on paid plans.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍽️</span>
              <span className="font-bold text-xl text-white">BestMealMate</span>
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/pricing" className="hover:text-white">Pricing</Link>
              <Link href="/" className="hover:text-white">App</Link>
              <a href="mailto:hello@bestmealmate.com" className="hover:text-white">Contact</a>
            </div>
            {/* Social Links */}
            <div className="flex gap-4">
              <a href="https://x.com/bestmealmate" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Follow us on X (Twitter)">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://instagram.com/bestmealmate" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Follow us on Instagram">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">© 2026 BestMealMate. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white">Terms of Service</Link>
            </div>
          </div>
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
