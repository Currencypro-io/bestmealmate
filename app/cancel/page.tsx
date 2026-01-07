export default function CancelPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-4 text-red-700">Payment Cancelled</h1>
      <p className="mb-2">Your payment was cancelled. You can try again at any time.</p>
      <a href="/checkout" className="text-blue-600 underline">Return to checkout</a>
    </main>
  );
}
