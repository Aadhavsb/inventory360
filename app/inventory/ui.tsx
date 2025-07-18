"use client";
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, FC } from 'react';
import Image from 'next/image';
import AssetTable from './AssetTable';
import AssetForm from './AssetForm';

interface InventoryPageProps {
  user: { email?: string };
}

interface Asset {
  _id: string;
  name: string;
  type: string;
  status: string;
  acquired: string;
  date: string;
  site: string;
  description?: string;
}

const InventoryPage: FC<InventoryPageProps> = ({ user }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (      <div className="min-h-screen bg-wildlife-ivory font-wildlife flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <Image
              src="/download (2).jpg"
              alt="Wildlife SOS Logo"
              fill
              className="object-contain rounded-full"
            />
          </div>
          <div className="text-wildlife-black">Loading...</div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (status === 'unauthenticated') {
    // Only redirect on client side
    if (typeof window !== 'undefined') {
      router.push('/login');
    }
    return null;
  }  const handleAssetAdded = () => {
    // Trigger a refresh of the asset table
    setRefreshTrigger(prev => prev + 1);
  };  const handleEditAsset = (asset: Asset) => {
    setEditingAsset(asset);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingAsset(null);
    setShowForm(false);
  };

  const handleAssetUpdated = () => {
    // Trigger a refresh of the asset table and close edit mode
    setRefreshTrigger(prev => prev + 1);
    setEditingAsset(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-wildlife-ivory font-wildlife">
      {/* Wildlife themed header */}
      <header className="bg-wildlife-black shadow-wildlife border-b-2 border-wildlife-green">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo and branding */}            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-wildlife-green rounded-full flex items-center justify-center relative overflow-hidden">
                <Image
                  src="/download (2).jpg"
                  alt="Wildlife SOS Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="text-white font-bold text-xl">
                  Inventory<span className="text-wildlife-green">360</span>
                </div>
                <div className="text-wildlife-green text-xs tracking-wider">WILDLIFE SOS</div>
              </div>
            </div>

            {/* Page title */}
            <div className="hidden md:block text-center">
              <h1 className="text-white font-semibold text-lg">Conservation Asset Dashboard</h1>
              <div className="text-wildlife-green text-sm">Rescue Center Inventory</div>
            </div>

            {/* User menu */}
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <div className="text-white text-sm font-medium">{user?.email || session?.user?.email}</div>
                <div className="text-wildlife-green text-xs">Wildlife Ranger</div>
              </div>
              <button 
                className="bg-wildlife-green hover:bg-wildlife-green-dark text-white px-4 py-2 rounded-xl transition-colors duration-200"
                onClick={() => signOut()}
              >
                <span className="hidden sm:inline">Sign Out</span>
                <span className="sm:hidden">🚪</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome banner */}
        <div className="bg-gradient-to-r from-wildlife-green to-wildlife-green-dark rounded-2xl p-6 mb-8 text-white shadow-wildlife">
          <div className="flex items-center justify-between">
            <div>              <h2 className="text-2xl font-bold mb-2 flex items-center space-x-2">
                <div className="w-8 h-8 relative">
                  <Image
                    src="/download (2).jpg"
                    alt="Wildlife SOS Logo"
                    fill
                    className="object-contain rounded-full"
                  />
                </div>
                <span>Welcome back, Ranger!</span>
              </h2>
              <p className="text-wildlife-ivory opacity-90">
                Track and manage conservation assets across rescue centers
              </p>
            </div>
            <div className="hidden md:block text-6xl opacity-20">🌿</div>
          </div>
        </div>

        {/* Asset management section */}
        <div className="bg-white rounded-2xl shadow-wildlife border border-wildlife-green/20 overflow-hidden">
          {/* Section header */}
          <div className="bg-wildlife-green/5 border-b border-wildlife-green/20 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <h3 className="text-2xl font-bold text-wildlife-black flex items-center space-x-2">
                  <span>📦</span>
                  <span>Conservation Assets</span>
                </h3>
                <p className="text-wildlife-brown mt-1">
                  Medical supplies, equipment, and resources for wildlife care
                </p>
              </div>              <button 
                className={`btn-wildlife flex items-center space-x-2 ${showForm ? 'bg-wildlife-brown hover:bg-wildlife-brown/80' : ''}`}
                onClick={() => {
                  if (showForm && editingAsset) {
                    handleCancelEdit();
                  } else {
                    setShowForm(!showForm);
                    if (!showForm) {
                      setEditingAsset(null); // Clear edit mode when opening for new asset
                    }
                  }
                }}
              >
                <span>{showForm ? '❌' : '➕'}</span>
                <span>
                  {showForm 
                    ? (editingAsset ? 'Cancel Edit' : 'Close Form') 
                    : 'Add New Asset'
                  }
                </span>
              </button>
            </div>
          </div>          {/* Asset form */}
          {showForm && (
            <div className="border-b border-wildlife-green/20 bg-wildlife-green/5">
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-2xl">{editingAsset ? '✏️' : '🛠️'}</span>
                  <h4 className="text-xl font-semibold text-wildlife-black">
                    {editingAsset ? 'Edit Conservation Asset' : 'Add Conservation Asset'}
                  </h4>
                </div>
                <AssetForm 
                  onSuccess={editingAsset ? handleAssetUpdated : handleAssetAdded}
                  editAsset={editingAsset}
                  onCancel={handleCancelEdit}
                />
              </div>
            </div>
          )}          {/* Asset table */}
          <div className="p-6">
            <AssetTable 
              refreshTrigger={refreshTrigger} 
              onEditAsset={handleEditAsset}
            />
          </div>
        </div>

        {/* Wildlife conservation tips */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-wildlife border border-wildlife-green/20">
            <div className="text-3xl mb-3">🌿</div>
            <h4 className="font-semibold text-wildlife-black mb-2">Active Assets</h4>
            <p className="text-sm text-wildlife-brown">Equipment currently in use for wildlife care</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-wildlife border border-wildlife-green/20">
            <div className="text-3xl mb-3">🏥</div>
            <h4 className="font-semibold text-wildlife-black mb-2">Medical Supplies</h4>
            <p className="text-sm text-wildlife-brown">Critical care items for rescue operations</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-wildlife border border-wildlife-green/20">
            <div className="text-3xl mb-3">⚡</div>
            <h4 className="font-semibold text-wildlife-black mb-2">Real-time Updates</h4>
            <p className="text-sm text-wildlife-brown">Track assets across all rescue centers</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InventoryPage;
