"use client";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { assetSchema } from '@/lib/validation';
import type { FC } from 'react';
import { z } from 'zod';
import { useState } from 'react';

interface AssetFormProps {
  onSuccess?: () => void;
}

type AssetInput = z.infer<typeof assetSchema>;

const AssetForm: FC<AssetFormProps> = ({ onSuccess }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(assetSchema),
  });
  const [error, setError] = useState('');

  async function onSubmit(data: AssetInput) {
    setError('');
    const res = await fetch('/api/asset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      reset();
      onSuccess?.();
    } else {
      setError('Failed to add asset');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block mb-1">Name</label>
        <input {...register('name')} className="input" />
        {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
      </div>
      <div>
        <label className="block mb-1">Type</label>
        <select {...register('type')} className="input">
          <option value="">Select</option>
          <option value="long-term">Long-term</option>
          <option value="medical">Medical</option>
          <option value="perishable">Perishable</option>
        </select>
        {errors.type && <span className="text-red-500 text-sm">{errors.type.message}</span>}
      </div>
      <div>
        <label className="block mb-1">Status</label>
        <select {...register('status')} className="input">
          <option value="">Select</option>
          <option value="active">Active</option>
          <option value="phased out">Phased Out</option>
        </select>
        {errors.status && <span className="text-red-500 text-sm">{errors.status.message}</span>}
      </div>
      <div>
        <label className="block mb-1">Acquired</label>
        <select {...register('acquired')} className="input">
          <option value="">Select</option>
          <option value="donated">Donated</option>
          <option value="bought">Bought</option>
        </select>
        {errors.acquired && <span className="text-red-500 text-sm">{errors.acquired.message}</span>}
      </div>
      <div>
        <label className="block mb-1">Date</label>
        <input type="date" {...register('date')} className="input" />
        {errors.date && <span className="text-red-500 text-sm">{errors.date.message}</span>}
      </div>
      <div>
        <label className="block mb-1">Site</label>
        <input {...register('site')} className="input" />
        {errors.site && <span className="text-red-500 text-sm">{errors.site.message}</span>}
      </div>
      <div className="col-span-full flex gap-2 mt-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Asset'}
        </button>
        {error && <span className="text-red-500 ml-2">{error}</span>}
      </div>
    </form>
  );
}

export default AssetForm;
