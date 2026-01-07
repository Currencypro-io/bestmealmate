import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/signin');

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-4">Account</h1>
      <p className="mb-2">Signed in as <span className="font-mono">{session.user?.email}</span></p>
      <form method="post" action="/api/auth/signout">
        <button type="submit" className="bg-gray-300 text-gray-800 p-2 rounded font-bold">Sign Out</button>
      </form>
    </main>
  );
}
