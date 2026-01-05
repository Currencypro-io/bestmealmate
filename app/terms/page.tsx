import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service - BestMealMate',
  description: 'Terms of Service for BestMealMate meal planning application',
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-md shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🍽️</span>
            <span className="font-bold text-xl text-orange-600">BestMealMate</span>
          </Link>
          <Link href="/" className="text-orange-600 hover:text-orange-700 font-medium">
            ← Back to App
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        <p className="text-gray-500 mb-8">Last updated: January 5, 2026</p>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing or using BestMealMate (&quot;the Service&quot;), you agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use our Service. We reserve the right to update
              these terms at any time, and your continued use constitutes acceptance of any changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              BestMealMate is a meal planning application that helps families and individuals:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Plan weekly meals with a visual calendar interface</li>
              <li>Browse and save recipes with nutritional information</li>
              <li>Generate grocery lists from meal plans</li>
              <li>Receive AI-powered meal suggestions (Premium feature)</li>
              <li>Sync data across devices (Premium feature)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.1 Account Creation</h3>
            <p className="text-gray-600 leading-relaxed">
              To access certain features, you may need to create an account. You agree to provide accurate,
              current, and complete information during registration and to keep your account information updated.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.2 Account Security</h3>
            <p className="text-gray-600 leading-relaxed">
              You are responsible for maintaining the confidentiality of your account credentials and for all
              activities that occur under your account. Notify us immediately of any unauthorized access.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.3 Age Requirements</h3>
            <p className="text-gray-600 leading-relaxed">
              You must be at least 13 years old to create an account. Users under 18 should have parental
              consent. Parents may create family accounts to manage meal planning for their households.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Subscription Plans</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.1 Free Plan</h3>
            <p className="text-gray-600 leading-relaxed">
              The free plan provides basic meal planning features with local device storage. Features may be
              limited compared to Premium subscriptions.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.2 Premium Subscription</h3>
            <p className="text-gray-600 leading-relaxed">
              Premium subscriptions are billed monthly or annually. Subscriptions automatically renew unless
              canceled before the renewal date. You can cancel anytime through your account settings.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.3 Refunds</h3>
            <p className="text-gray-600 leading-relaxed">
              We offer a 7-day money-back guarantee for new Premium subscribers. After 7 days, subscription
              fees are non-refundable except where required by law. Contact support@bestmealmate.com for refund requests.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. User Content</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5.1 Your Content</h3>
            <p className="text-gray-600 leading-relaxed">
              You retain ownership of content you create, such as custom recipes and meal plans. By using our
              Service, you grant us a license to store and display your content to provide the Service.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5.2 Content Guidelines</h3>
            <p className="text-gray-600 leading-relaxed">You agree not to upload content that:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-2">
              <li>Violates any laws or regulations</li>
              <li>Infringes on intellectual property rights</li>
              <li>Contains harmful, offensive, or inappropriate material</li>
              <li>Attempts to exploit or harm other users</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>
            <p className="text-gray-600 leading-relaxed">
              The BestMealMate name, logo, and all related graphics, software, and content are our property
              or licensed to us. Our built-in recipes and content are protected by copyright. You may not
              copy, modify, distribute, or create derivative works without our written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Acceptable Use</h2>
            <p className="text-gray-600 leading-relaxed mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Use the Service for any illegal purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Use automated tools to scrape or collect data</li>
              <li>Impersonate others or misrepresent your affiliation</li>
              <li>Share your account with others or allow multiple users on a single account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Disclaimer of Warranties</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND. We do not guarantee that:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>The Service will be uninterrupted or error-free</li>
              <li>Nutritional information is 100% accurate (use as estimates only)</li>
              <li>Recipes are suitable for all dietary needs or allergies</li>
              <li>AI-generated suggestions will meet your specific requirements</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              <strong>Important:</strong> Always verify ingredients for allergens and consult healthcare
              providers for specific dietary or medical advice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed">
              To the maximum extent permitted by law, BestMealMate and its affiliates shall not be liable for
              any indirect, incidental, special, consequential, or punitive damages, including loss of data,
              profits, or goodwill. Our total liability shall not exceed the amount you paid us in the 12 months
              prior to the claim.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Indemnification</h2>
            <p className="text-gray-600 leading-relaxed">
              You agree to indemnify and hold harmless BestMealMate, its officers, directors, employees, and
              agents from any claims, damages, or expenses arising from your use of the Service, violation
              of these Terms, or infringement of any third-party rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Termination</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We may suspend or terminate your account if you violate these Terms. You may also delete your
              account at any time. Upon termination:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Your right to use the Service ends immediately</li>
              <li>We may delete your data after a reasonable retention period</li>
              <li>Provisions that should survive (like liability limitations) will remain in effect</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Governing Law</h2>
            <p className="text-gray-600 leading-relaxed">
              These Terms are governed by the laws of the State of Delaware, United States, without regard
              to conflict of law principles. Any disputes shall be resolved in the courts of Delaware.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Changes to Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              We may modify these Terms at any time. We will notify you of material changes via email or
              by posting a notice on the Service. Continued use after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have questions about these Terms, please contact us:
            </p>
            <ul className="list-none text-gray-600 mt-4 space-y-2">
              <li><strong>Email:</strong> legal@bestmealmate.com</li>
              <li><strong>Website:</strong> bestmealmate.com</li>
              <li><strong>Twitter/X:</strong> @bestmealmate</li>
            </ul>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 flex gap-4">
          <Link href="/" className="text-orange-600 hover:text-orange-700 font-medium">
            ← Back to BestMealMate
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/privacy" className="text-orange-600 hover:text-orange-700 font-medium">
            Privacy Policy
          </Link>
        </div>
      </main>
    </div>
  );
}
