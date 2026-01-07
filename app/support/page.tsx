'use client';

import Link from 'next/link';

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/landing" className="flex items-center gap-2">
            <span className="text-2xl">🥗</span>
            <span className="font-bold text-xl text-gray-900">BestMealMate</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/landing" className="text-gray-600 hover:text-gray-900 transition-colors">
              Home
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
              Pricing
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Customer Support</h1>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">How Can We Help?</h2>
          
          <p className="text-gray-600 mb-8">
            We&apos;re here to help you get the most out of BestMealMate. Whether you have questions 
            about features, billing, or anything else, our team is ready to assist.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Email Support */}
            <div className="bg-green-50 rounded-xl p-6">
              <div className="text-3xl mb-3">📧</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
              <p className="text-gray-600 mb-4">
                Send us an email and we&apos;ll get back to you within 24 hours.
              </p>
              <a 
                href="mailto:hello@bestmealmate.com"
                className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
              >
                hello@bestmealmate.com
                <span>→</span>
              </a>
            </div>

            {/* Phone Support */}
            <div className="bg-orange-50 rounded-xl p-6">
              <div className="text-3xl mb-3">📞</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone Support</h3>
              <p className="text-gray-600 mb-4">
                Call us during business hours (Mon-Fri, 9am-5pm EST).
              </p>
              <a 
                href="tel:+16095278656"
                className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
              >
                +1 609-527-8656
                <span>→</span>
              </a>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How do I cancel my subscription?</h3>
              <p className="text-gray-600">
                You can cancel your subscription at any time by emailing us at hello@bestmealmate.com 
                or calling our support line. Your access will continue until the end of your billing period.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I get a refund?</h3>
              <p className="text-gray-600">
                We offer a 30-day money-back guarantee. If you&apos;re not satisfied with BestMealMate 
                within the first 30 days, contact us for a full refund.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How does the AI food scanning work?</h3>
              <p className="text-gray-600">
                Simply take a photo of any food item or meal, and our AI will identify it and provide 
                nutritional information. The more you use it, the better it gets at understanding your preferences.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Is my data secure?</h3>
              <p className="text-gray-600">
                Yes! We take your privacy seriously. All data is encrypted in transit and at rest. 
                We never sell your personal information. See our{' '}
                <Link href="/privacy" className="text-green-600 hover:underline">Privacy Policy</Link>
                {' '}for details.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-gray-50 rounded-2xl p-6 text-center">
          <p className="text-gray-600 mb-4">Looking for something else?</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/privacy" className="text-green-600 hover:underline">Privacy Policy</Link>
            <span className="text-gray-300">|</span>
            <Link href="/terms" className="text-green-600 hover:underline">Terms of Service</Link>
            <span className="text-gray-300">|</span>
            <Link href="/pricing" className="text-green-600 hover:underline">Pricing</Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            © 2026 BestMealMate. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
