"use client";
import { useEffect, useState, FC } from 'react';

interface Asset {
  _id?: string;
  name: string;
  type: string;
  status: string;
  acquired: string;
  date: string;
  site: string;
}

const AssetTable: FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAssets() {
      setLoading(true);
      const res = await fetch('/api/asset');
      const data = await res.json();
      setAssets(data.assets || []);
      setLoading(false);
    }
    fetchAssets();
  }, []);

  useEffect(() => {
    setFiltered(
      assets.filter(a =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.site.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, assets]);

  if (loading) return <div className="animate-pulse">Loading assets...</div>;

  return (
    <div>
      <input
        className="input mb-4"
        placeholder="Search by name or site..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <table className="min-w-full bg-white rounded shadow overflow-x-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Name</th>
            <th className="p-2">Type</th>
            <th className="p-2">Status</th>
            <th className="p-2">Acquired</th>
            <th className="p-2">Date</th>
            <th className="p-2">Site</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(asset => (
            <tr key={asset._id} className="border-t">
              <td className="p-2">{asset.name}</td>
              <td className="p-2">{asset.type}</td>
              <td className="p-2">{asset.status}</td>
              <td className="p-2">{asset.acquired}</td>
              <td className="p-2">{asset.date}</td>
              <td className="p-2">{asset.site}</td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan={6} className="text-center p-4">No assets found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AssetTable;
