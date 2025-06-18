"use client";
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (session) {
    router.push('/inventory');
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="mb-8">
        {/* Logo placeholder, will update with uploaded logo */}
        <Image src="/next.svg" alt="Inventory360 Logo" width={120} height={120} />
      </div>
      <h1 className="text-3xl font-bold mb-4">Inventory360</h1>
      <button
        className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition"
        onClick={() => signIn('google')}
      >
        Sign in with Google
      </button>
    </div>
  );
}
