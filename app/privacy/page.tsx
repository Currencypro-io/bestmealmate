import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy - BestMealMate',
  description: 'Privacy Policy for BestMealMate meal planning application',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-md shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/landing" className="flex items-center gap-2">
            <span className="text-2xl">🍽️</span>
            <span className="font-bold text-xl text-orange-600">BestMealMate</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-orange-600 hover:text-orange-700 font-medium">
              Open App
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        <p className="text-gray-500 mb-8">Last updated: January 5, 2026</p>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-600 leading-relaxed">
              Welcome to BestMealMate (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy
              and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard
              your information when you use our meal planning application and website at bestmealmate.com.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.1 Information You Provide</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Account Information:</strong> Email address, name, and password when you create an account</li>
              <li><strong>Profile Information:</strong> Dietary preferences, allergies, family member details, and cooking preferences</li>
              <li><strong>Meal Plans:</strong> Your meal selections, custom recipes, and grocery lists</li>
              <li><strong>Payment Information:</strong> Processed securely through Stripe; we do not store your full credit card details</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.2 Information Collected Automatically</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Usage Data:</strong> How you interact with the app, features used, and time spent</li>
              <li><strong>Device Information:</strong> Browser type, operating system, and device identifiers</li>
              <li><strong>Cookies:</strong> We use cookies to maintain your session and remember preferences</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>To provide and personalize our meal planning services</li>
              <li>To generate AI-powered meal suggestions based on your preferences</li>
              <li>To sync your data across devices (Premium users)</li>
              <li>To process payments and manage subscriptions</li>
              <li>To send important service updates and notifications</li>
              <li>To improve our app and develop new features</li>
              <li>To respond to your inquiries and provide customer support</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Storage and Security</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We take data security seriously and implement appropriate technical and organizational measures:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Data is encrypted in transit using TLS/SSL</li>
              <li>Database hosted on Supabase with enterprise-grade security</li>
              <li>Payment processing handled by Stripe (PCI-DSS compliant)</li>
              <li>Regular security audits and updates</li>
              <li>Free tier users: data stored locally on device only</li>
              <li>Premium users: data synced securely to cloud</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Sharing</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We do not sell your personal information. We may share data with:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Service Providers:</strong> Supabase (database), Stripe (payments), Vercel (hosting)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger or acquisition</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights</h2>
            <p className="text-gray-600 leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data</li>
              <li><strong>Export:</strong> Download your meal plans and recipes</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              To exercise these rights, contact us at privacy@bestmealmate.com
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies and Tracking</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We use essential cookies to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Keep you logged in to your account</li>
              <li>Remember your preferences (dark mode, etc.)</li>
              <li>Analyze app usage to improve our service (via privacy-respecting analytics)</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              We use Google AdSense to display relevant advertisements. Google may use cookies to personalize ads
              based on your browsing history. You can opt out of personalized ads in your Google account settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children&apos;s Privacy</h2>
            <p className="text-gray-600 leading-relaxed">
              BestMealMate is designed for families but is not intended for children under 13 to use independently.
              Parents or guardians manage family accounts. We do not knowingly collect personal information
              directly from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. International Users</h2>
            <p className="text-gray-600 leading-relaxed">
              Our services are hosted in the United States. If you access our app from outside the US,
              your information may be transferred to and processed in the US. By using our service,
              you consent to this transfer.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to This Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of significant changes
              by email or by posting a notice on our app. Your continued use after changes constitutes
              acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <ul className="list-none text-gray-600 mt-4 space-y-2">
              <li><strong>Email:</strong> privacy@bestmealmate.com</li>
              <li><strong>Website:</strong> bestmealmate.com</li>
              <li><strong>Phone:</strong> +1 609-527-8656</li>
                <li><strong>Twitter/X:</strong> @bestmealmate</li>
            </ul>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link href="/" className="text-orange-600 hover:text-orange-700 font-medium">
            ← Back to BestMealMate
          </Link>
        </div>
      </main>
    </div>
  );
}
