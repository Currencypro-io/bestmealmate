'use client';

export default function CheckoutPage() {
  async function handleCheckout() {
    const res = await fetch('/api/checkout', { method: 'POST' });
    const data = await res.json();
    window.location = data.url;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>
      <button onClick={handleCheckout} className="bg-green-600 text-white p-4 rounded font-bold text-xl">Subscribe for $9.90</button>
    </main>
  );
}
