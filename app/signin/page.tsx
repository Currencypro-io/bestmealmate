import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function SignInPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect('/');

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-4">Sign In</h1>
      <form method="post" action="/api/auth/callback/credentials" className="flex flex-col gap-4 w-80">
        <input name="csrfToken" type="hidden" />
        <input name="email" type="email" placeholder="Email" required className="p-2 border rounded" />
        <input name="password" type="password" placeholder="Password" required className="p-2 border rounded" />
        <button type="submit" className="bg-orange-500 text-white p-2 rounded font-bold">Sign In</button>
      </form>
      <p className="mt-4 text-gray-500">Demo: user@example.com / password</p>
    </main>
  );
}
