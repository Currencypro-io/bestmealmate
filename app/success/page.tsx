export default function SuccessPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-4 text-green-700">Payment Successful!</h1>
      <p className="mb-2">Thank you for subscribing to BestMealMate.</p>
      <a href="/account" className="text-blue-600 underline">Go to your account</a>
    </main>
  );
}
