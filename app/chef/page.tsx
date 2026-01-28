'use client';

import dynamic from 'next/dynamic';

// The entire chef page content is loaded client-side only
// This avoids SSR issues with browser APIs and Supabase initialization
const ChefPageContent = dynamic(() => import('./ChefPageContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4 animate-bounce">👨‍🍳</div>
        <p className="text-gray-600">Loading AI Chef...</p>
      </div>
    </div>
  ),
});

export default function ChefPage() {
  return <ChefPageContent />;
}
