"use client";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { CENTRES, DEPARTMENTS, DEPARTMENT_LABELS } from '@/lib/constants';

export default function SelectProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [centre, setCentre] = useState('');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    if (status === 'authenticated') {
      fetch('/api/user-profile')
        .then(res => res.json())
        .then(data => {
          if (data.profile) {
            setCentre(data.profile.centre);
            setDepartment(data.profile.department);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!centre || !department) {
      setError('Please select both a centre and department');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/user-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ centre, department }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save profile');
      }

      router.push('/inventory');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setSubmitting(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-wildlife-ivory font-wildlife">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <Image src="/download (2).jpg" alt="Wildlife SOS Logo" fill className="object-contain rounded-full" />
          </div>
          <div className="text-wildlife-green font-semibold">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-wildlife-ivory via-white to-wildlife-beige flex flex-col items-center justify-center p-8 font-wildlife">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-wildlife-black rounded-full overflow-hidden shadow-wildlife relative">
              <Image src="/download (2).jpg" alt="Wildlife SOS Logo" fill className="object-cover" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-wildlife-black">
            Set Up Your Profile
          </h1>
          <p className="text-wildlife-brown mt-2">
            Welcome, {session?.user?.name || 'Ranger'}! Select your centre and department to continue.
          </p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-wildlife border border-wildlife-green/20 p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
              {error}
            </div>
          )}

          {/* Centre Selection */}
          <div>
            <label className="block text-sm font-semibold text-wildlife-black mb-2">
              Wildlife Centre
            </label>
            <select
              value={centre}
              onChange={e => setCentre(e.target.value)}
              className="input w-full"
            >
              <option value="">Select a centre...</option>
              {CENTRES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Department Selection */}
          <div>
            <label className="block text-sm font-semibold text-wildlife-black mb-2">
              Department
            </label>
            <select
              value={department}
              onChange={e => setDepartment(e.target.value)}
              className="input w-full"
            >
              <option value="">Select a department...</option>
              {DEPARTMENTS.map(d => (
                <option key={d} value={d}>{DEPARTMENT_LABELS[d]}</option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || !centre || !department}
            className="w-full bg-wildlife-green hover:bg-wildlife-green-dark text-white font-semibold py-4 px-6 rounded-2xl shadow-wildlife transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {submitting ? 'Saving...' : 'Continue to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
