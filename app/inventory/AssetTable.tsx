"use client";
import { useEffect, useState, FC } from 'react';
import Image from 'next/image';

interface Asset {
  _id: string;
  name: string;
  type: string;
  status: string;
  acquired: string;
  date: string;
  site: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  loggedBy?: {
    name: string;
    email: string;
  };
}

interface AssetTableProps {
  refreshTrigger?: number;
  onEditAsset?: (asset: Asset) => void;
}

const AssetTable: FC<AssetTableProps> = ({ refreshTrigger, onEditAsset }) => {  const [assets, setAssets] = useState<Asset[]>([]);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  // CSV Export Function
  const exportToCSV = () => {
    if (filtered.length === 0) {
      alert('📊 No assets to export. Please adjust your filters to see data.');
      return;
    }    // CSV Headers - including additional metadata
    const headers = [
      'Asset Name', 
      'Type', 
      'Status', 
      'Acquired', 
      'Date Acquired', 
      'Wildlife Center',
      'Logged By',
      'Asset ID',
      'Created Date',
      'Last Updated'
    ];      // Convert filtered data to CSV format with enhanced data
    const csvData = filtered.map(asset => [
      `"${asset.name}"`,
      `"${asset.type}"`,
      `"${asset.status}"`,
      `"${asset.acquired}"`,
      `"${new Date(asset.date).toLocaleDateString('en-IN')}"`,
      `"${asset.site}"`,
      `"${asset.loggedBy?.name || 'Unknown'}"`,
      `"${asset._id || 'N/A'}"`,
      `"${asset.createdAt ? new Date(asset.createdAt).toLocaleDateString('en-IN') : 'N/A'}"`,
      `"${asset.updatedAt ? new Date(asset.updatedAt).toLocaleDateString('en-IN') : 'N/A'}"`
    ]);

    // Generate summary statistics
    const totalAssets = filtered.length;
    const activeAssets = filtered.filter(a => a.status === 'active').length;
    const medicalAssets = filtered.filter(a => a.type === 'medical').length;
    const longTermAssets = filtered.filter(a => a.type === 'long-term').length;
    const perishableAssets = filtered.filter(a => a.type === 'perishable').length;
    const donatedAssets = filtered.filter(a => a.acquired === 'donated').length;
    const boughtAssets = filtered.filter(a => a.acquired === 'bought').length;
    const uniqueLocations = new Set(filtered.map(a => a.site)).size;

    // Add summary rows
    const summaryRows = [
      [''], // Empty row for separation
      ['"=== WILDLIFE SOS INVENTORY SUMMARY ==="'],
      [`"Total Assets:"`, `"${totalAssets}"`],
      [`"Active Assets:"`, `"${activeAssets}"`],
      [`"Medical Supplies:"`, `"${medicalAssets}"`],
      [`"Long-term Equipment:"`, `"${longTermAssets}"`],
      [`"Perishable Items:"`, `"${perishableAssets}"`],
      [`"Donated Items:"`, `"${donatedAssets}"`],
      [`"Purchased Items:"`, `"${boughtAssets}"`],
      [`"Wildlife Centers Covered:"`, `"${uniqueLocations}"`],
      [''], // Empty row
      [`"Export Date:"`, `"${new Date().toLocaleDateString('en-IN')} ${new Date().toLocaleTimeString('en-IN')}"`],
      [`"Filters Applied:"`, `"Type: ${filter === 'all' ? 'All' : filter}, Location: ${locationFilter === 'all' ? 'All' : locationFilter}, Search: ${search || 'None'}"`],
      [`"Generated by:"`, `"Wildlife SOS Inventory360 System"`]
    ];

    // Combine headers, data, and summary
    const csvContent = [
      headers.join(','), 
      ...csvData.map(row => row.join(',')),
      ...summaryRows.map(row => row.join(','))
    ].join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      
      // Generate descriptive filename with current date and filter info
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      let filename = `wildlife-sos-assets-${dateStr}`;
      
      if (filter !== 'all') filename += `-${filter}`;
      if (locationFilter !== 'all') filename += `-${locationFilter.replace(/\s+/g, '-')}`;
      if (search) filename += `-search-${search.replace(/\s+/g, '-')}`;
      
      link.setAttribute('download', `${filename}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show success feedback
      console.log(`✅ Successfully exported ${filtered.length} assets to ${filename}.csv`);
      
      // Optional: You could add a toast notification here in the future
    }
  };

  useEffect(() => {
    async function fetchAssets() {
      setLoading(true);
      try {
        const res = await fetch('/api/asset');
        const data = await res.json();
        setAssets(data.assets || []);
      } catch (error) {
        console.error('Failed to fetch assets:', error);
      }
      setLoading(false);    }
    fetchAssets();
  }, [refreshTrigger]); // Add refreshTrigger as dependency
  useEffect(() => {
    let result = assets.filter(a =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.site.toLowerCase().includes(search.toLowerCase()) ||
      a.type.toLowerCase().includes(search.toLowerCase())
    );

    if (filter !== 'all') {
      result = result.filter(a => a.type === filter);
    }

    if (locationFilter !== 'all') {
      result = result.filter(a => a.site === locationFilter);
    }

    setFiltered(result);
  }, [search, assets, filter, locationFilter]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'medical': return '🏥';
      case 'long-term': return '🏗️';
      case 'perishable': return '⏰';
      default: return '📦';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '🌿';
      case 'phased out': return '💀';
      default: return '❓';
    }
  };

  const getAcquiredIcon = (acquired: string) => {
    switch (acquired) {
      case 'donated': return '🤝';
      case 'bought': return '💰';
      default: return '📋';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-wildlife-green bg-wildlife-green/10';
      case 'phased out': return 'text-red-600 bg-red-50';
      default: return 'text-wildlife-brown bg-wildlife-brown/10';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'medical': return 'text-red-600 bg-red-50';
      case 'long-term': return 'text-wildlife-green bg-wildlife-green/10';
      case 'perishable': return 'text-orange-600 bg-orange-50';
      default: return 'text-wildlife-brown bg-wildlife-brown/10';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 font-wildlife">
        <div className="text-6xl mb-4">🐻</div>
        <div className="text-wildlife-green font-semibold text-lg">Loading conservation assets...</div>
        <div className="text-wildlife-brown text-sm mt-2">Fetching inventory from rescue centers</div>
      </div>
    );
  }

  return (
    <div className="font-wildlife">      {/* Search and Filter Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-wildlife-brown">🔍</span>
              <input
                className="input pl-10"
                placeholder="Search by name, site, or type..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            {/* Asset Type Filter */}
            <div className="md:w-56">
              <select 
                className="input" 
                value={filter} 
                onChange={e => setFilter(e.target.value)}
              >
                <option value="all">🌍 All Asset Types</option>
                <option value="medical">🏥 Medical Supplies</option>
                <option value="long-term">🏗️ Long-term Equipment</option>
                <option value="perishable">⏰ Perishable Items</option>
              </select>
            </div>

            {/* Location Filter */}
            <div className="md:w-64">
              <select 
                className="input" 
                value={locationFilter} 
                onChange={e => setLocationFilter(e.target.value)}
              >
                <option value="all">🏥 All Wildlife Centers</option>
                {/* Dynamic location options */}
                {Array.from(new Set(assets.map(a => a.site)))
                  .sort()
                  .map(site => (
                    <option key={site} value={site}>
                      <div className="w-6 h-6 relative mr-1">
                        <Image
                          src="/download (2).jpg"
                          alt="Wildlife SOS Logo"
                          fill
                          className="object-contain rounded-full"
                        />
                      </div>
                      {site}
                    </option>
                  ))
                }
              </select>
            </div>
          </div>
        </div>        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-wildlife-brown">
          <span>
            Showing {filtered.length} of {assets.length} conservation assets
            {filter !== 'all' && ` • Type: ${filter}`}
            {locationFilter !== 'all' && ` • Location: ${locationFilter}`}
          </span>
          <div className="flex items-center space-x-3">
            {/* CSV Export Button */}
            <button
              onClick={exportToCSV}
              disabled={filtered.length === 0}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 ${
                filtered.length > 0
                  ? 'bg-wildlife-green text-white hover:bg-wildlife-green-dark'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              title={filtered.length === 0 ? 'No data to export' : `Export ${filtered.length} assets to CSV`}
            >
              <span>📊</span>
              <span>Export CSV ({filtered.length})</span>
            </button>
            
            {(search || filter !== 'all' || locationFilter !== 'all') && (
              <button 
                onClick={() => {
                  setSearch('');
                  setFilter('all');
                  setLocationFilter('all');
                }}
                className="text-wildlife-green hover:text-wildlife-green-dark"
              >
                🔄 Clear all filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Assets Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-2xl shadow-wildlife overflow-hidden border border-wildlife-green/20">          <thead className="bg-wildlife-green text-white">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">Asset Name</th>
              <th className="px-6 py-4 text-left font-semibold">Type</th>
              <th className="px-6 py-4 text-left font-semibold">Status</th>
              <th className="px-6 py-4 text-left font-semibold">Acquired</th>
              <th className="px-6 py-4 text-left font-semibold">Date</th>
              <th className="px-6 py-4 text-left font-semibold">Wildlife Center</th>
              <th className="px-6 py-4 text-left font-semibold">Logged By</th>
              <th className="px-6 py-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((asset, index) => (
              <tr 
                key={asset._id} 
                className={`border-b border-wildlife-green/10 hover:bg-wildlife-green/5 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-wildlife-ivory/30'
                }`}
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-wildlife-black">{asset.name}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(asset.type)}`}>
                    <span>{getTypeIcon(asset.type)}</span>
                    <span className="capitalize">{asset.type}</span>
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(asset.status)}`}>
                    <span>{getStatusIcon(asset.status)}</span>
                    <span className="capitalize">{asset.status}</span>
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center space-x-1 text-wildlife-brown">
                    <span>{getAcquiredIcon(asset.acquired)}</span>
                    <span className="capitalize">{asset.acquired}</span>
                  </span>
                </td>
                <td className="px-6 py-4 text-wildlife-brown">
                  {new Date(asset.date).toLocaleDateString('en-IN')}
                </td>                <td className="px-6 py-4">
                  <div className="text-sm">
                    <div className="font-medium text-wildlife-black">{asset.site}</div>
                  </div>
                </td>                <td className="px-6 py-4">
                  <div className="text-sm">
                    <div className="font-medium text-wildlife-black">
                      {asset.loggedBy?.name || 'Unknown'}
                    </div>
                    {asset.loggedBy?.email && (
                      <div className="text-xs text-wildlife-brown">
                        {asset.loggedBy.email}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onEditAsset?.(asset)}
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-wildlife-green/10 hover:bg-wildlife-green/20 text-wildlife-green rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    <span>✏️</span>
                    <span>Edit</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>        {/* Empty State */}
        {filtered.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-wildlife border border-wildlife-green/20">
            <div className="w-16 h-16 mx-auto mb-4 relative">
              <Image
                src="/download (2).jpg"
                alt="Wildlife SOS Logo"
                fill
                className="object-contain rounded-full"
              />
            </div>
            <h3 className="text-xl font-semibold text-wildlife-black mb-2">
              No conservation assets found
            </h3>
            <p className="text-wildlife-brown mb-4">
              {search || filter !== 'all' || locationFilter !== 'all' ? 
                `No assets match your current filters. Try adjusting your search terms or filters.` : 
                'Start by adding your first conservation asset to the inventory.'
              }
            </p>
            {(search || filter !== 'all' || locationFilter !== 'all') && (
              <button 
                onClick={() => {
                  setSearch('');
                  setFilter('all');
                  setLocationFilter('all');
                }}
                className="btn-wildlife"
              >
                🔄 Clear all filters and show all assets
              </button>
            )}
          </div>
        )}
      </div>

      {/* Conservation Stats */}
      {assets.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-wildlife border border-wildlife-green/20 text-center">
            <div className="text-2xl text-wildlife-green font-bold">
              {assets.filter(a => a.status === 'active').length}
            </div>
            <div className="text-sm text-wildlife-brown">🌿 Active Assets</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-wildlife border border-wildlife-green/20 text-center">
            <div className="text-2xl text-wildlife-green font-bold">
              {assets.filter(a => a.type === 'medical').length}
            </div>
            <div className="text-sm text-wildlife-brown">🏥 Medical Supplies</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-wildlife border border-wildlife-green/20 text-center">
            <div className="text-2xl text-wildlife-green font-bold">
              {assets.filter(a => a.acquired === 'donated').length}
            </div>
            <div className="text-sm text-wildlife-brown">🤝 Donated Items</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-wildlife border border-wildlife-green/20 text-center">
            <div className="text-2xl text-wildlife-green font-bold">
              {new Set(assets.map(a => a.site)).size}
            </div>
            <div className="text-sm text-wildlife-brown">🏥 Centers</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetTable;
