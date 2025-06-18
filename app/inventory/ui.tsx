"use client";
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, FC } from 'react';
import AssetTable from './AssetTable';
import AssetForm from './AssetForm';

interface InventoryPageProps {
  user: { email?: string };
}

const InventoryPage: FC<InventoryPageProps> = ({ user }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);

  if (!session) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <img src="/next.svg" alt="Logo" className="w-10 h-10" />
          <span className="font-bold text-xl">Inventory360</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-700">{user?.email}</span>
          <button className="bg-gray-200 px-3 py-1 rounded" onClick={() => signOut()}>Logout</button>
        </div>
      </header>
      <main>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Assets</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Close' : 'Add Asset'}
          </button>
        </div>
        {showForm && <AssetForm onSuccess={() => setShowForm(false)} />}
        <AssetTable />
      </main>
    </div>
  );
}

export default InventoryPage;
