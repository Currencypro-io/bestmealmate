"use client";

export default function FounderPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">Founder</h1>
      <p className="text-lg text-gray-700 mb-4 max-w-2xl text-center">
        To reach our founder directly, please email:
      </p>
      <a href="mailto:founder@bestmealmate.com" className="text-green-600 hover:text-green-700 text-xl font-semibold mb-2">founder@bestmealmate.com</a>
      <p className="text-gray-500 text-sm">All emails are forwarded to bestmealmate@gmail.com</p>
    </main>
  );
}
