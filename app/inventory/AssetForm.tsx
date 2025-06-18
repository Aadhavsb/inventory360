"use client";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { assetSchema } from '@/lib/validation';
import { z } from 'zod';
import { useState } from 'react';

interface AssetFormProps {
  onSuccess?: (newAsset?: { success: boolean; insertedId?: string }) => void;
}

// Wildlife SOS conservation sites in India
const wildlifeSites = [
  'Elephant Conservation and Care Centre',
  'Agra Bear Rescue Facility',
  'Bannerghatta Bear Rescue Centre',
  'Manikdoh Leopard Rescue Centre',
  'Elephant Hospital',
  'Dachigam Rescue Centre',
  'Pahalgam Rescue Centre',
  'Elephant Rehabilitation Centre',
  'Wildlife SOS Transit Facility',
  'Human Primate Conflict Mitigation Centre',
  'Van Vihar Bear Rescue Facility',
  'West Bengal Bear Rescue Centre'
];

export default function AssetForm({ onSuccess }: AssetFormProps) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(assetSchema),
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');  async function onSubmit(data: z.infer<typeof assetSchema>) {
    setError('');
    setSuccess('');
    
    console.log('Form data being submitted:', data);
    
    try {
      const res = await fetch('/api/asset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const responseData = await res.json();
      console.log('API response:', responseData);      if (res.ok) {
        setSuccess('🎉 Asset added successfully to conservation inventory!');
        reset();
        setTimeout(() => {
          onSuccess?.(responseData); // Pass the response data but don't close the form
        }, 500); // Shorter timeout since we're not clearing the success message
        setTimeout(() => {
          setSuccess('');
        }, 4000); // Clear success message after 4 seconds} else {
        console.error('API error:', responseData);
        let errorMessage = 'Failed to add conservation asset';
        
        if (responseData.details) {
          if (Array.isArray(responseData.details)) {
            // Zod validation errors
            errorMessage = responseData.details.map((err: { path?: string[]; message: string }) => 
              `${err.path?.join('.')}: ${err.message}`
            ).join(', ');
          } else if (typeof responseData.details === 'string') {
            // String error message
            errorMessage = responseData.details;
          } else {
            // Object error details
            errorMessage = responseData.details.message || responseData.details.toString();
          }
        } else if (responseData.error) {
          errorMessage = typeof responseData.error === 'string' ? responseData.error : 'Server error occurred';
        }
        
        // Handle specific error types
        if (responseData.type === 'database_unavailable') {
          errorMessage = '🔧 Database temporarily unavailable. Please try again in a moment.';
        }
        
        setError(errorMessage);
      }
    } catch (err) {
      console.error('Network error:', err);
      setError('Network error - please check your connection');
    }
  }

  return (
    <div className="font-wildlife">
      {/* Success/Error Messages */}      {success && (
        <div className="mb-4 p-4 bg-wildlife-green/15 border-2 border-wildlife-green/40 rounded-xl text-wildlife-green text-sm font-medium flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🎉</span>
            <div>
              <div>{success}</div>
              <div className="text-xs text-wildlife-green/70 mt-1">Form cleared and ready for next entry</div>
            </div>
          </div>
          <button 
            onClick={() => setSuccess('')}
            className="text-wildlife-green/60 hover:text-wildlife-green text-xs"
          >
            ✕
          </button>
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Asset Name */}
          <div>
            <label className="block text-sm font-semibold text-wildlife-black mb-2">
              📝 Asset Name *
            </label>
            <input 
              {...register('name')} 
              className="input" 
              placeholder="e.g., Medical Oxygen Tank, Bear Enclosure Gate..."
            />
            {errors.name && <span className="text-red-500 text-sm mt-1 block">⚠️ {errors.name.message}</span>}
          </div>

          {/* Asset Type */}
          <div>
            <label className="block text-sm font-semibold text-wildlife-black mb-2">
              🏷️ Asset Type *
            </label>
            <select {...register('type')} className="input">
              <option value="">Select asset type...</option>
              <option value="long-term">🏗️ Long-term Equipment</option>
              <option value="medical">🏥 Medical Supplies</option>
              <option value="perishable">⏰ Perishable Items</option>
            </select>
            {errors.type && <span className="text-red-500 text-sm mt-1 block">⚠️ {errors.type.message}</span>}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-wildlife-black mb-2">
              📊 Asset Status *
            </label>
            <select {...register('status')} className="input">
              <option value="">Select status...</option>
              <option value="active">🌿 Active - In Use</option>
              <option value="phased out">💀 Phased Out - Retired</option>
            </select>
            {errors.status && <span className="text-red-500 text-sm mt-1 block">⚠️ {errors.status.message}</span>}
          </div>

          {/* Acquisition Method */}
          <div>
            <label className="block text-sm font-semibold text-wildlife-black mb-2">
              💼 How Acquired *
            </label>
            <select {...register('acquired')} className="input">
              <option value="">Select method...</option>
              <option value="donated">🤝 Donated - Gift/Grant</option>
              <option value="bought">💰 Purchased - Funded</option>
            </select>
            {errors.acquired && <span className="text-red-500 text-sm mt-1 block">⚠️ {errors.acquired.message}</span>}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-wildlife-black mb-2">
              📅 Date Acquired *
            </label>
            <input 
              type="date" 
              {...register('date')} 
              className="input"
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.date && <span className="text-red-500 text-sm mt-1 block">⚠️ {errors.date.message}</span>}
          </div>

          {/* Wildlife Site */}
          <div>
            <label className="block text-sm font-semibold text-wildlife-black mb-2">
              🏥 Wildlife Center *
            </label>
            <select {...register('site')} className="input">
              <option value="">Select rescue center...</option>
              {wildlifeSites.map(site => (
                <option key={site} value={site}>{site}</option>
              ))}
            </select>
            {errors.site && <span className="text-red-500 text-sm mt-1 block">⚠️ {errors.site.message}</span>}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 pt-4 border-t border-wildlife-green/20">
          <button 
            type="button"
            className="px-6 py-3 border border-wildlife-green/30 text-wildlife-brown rounded-xl hover:bg-wildlife-green/5 transition-colors duration-200"
            onClick={() => reset()}
          >
            🔄 Reset Form
          </button>
          <button 
            type="submit" 
            className="btn-wildlife px-8 py-3 flex items-center space-x-2" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin">⏳</span>
                <span>Adding to Inventory...</span>
              </>
            ) : (
              <>
                <span>🦎</span>
                <span>Add Conservation Asset</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
