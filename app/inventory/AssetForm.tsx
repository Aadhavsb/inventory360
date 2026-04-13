"use client";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { assetFormSchema, type AssetFormData } from '@/lib/validation';
import { useState } from 'react';
import Image from 'next/image';
import {
  CENTRES,
  DEPARTMENTS,
  DEPARTMENT_LABELS,
  DEPARTMENT_CATEGORIES,
  CATEGORY_LABELS,
  MEDICINE_TYPES,
} from '@/lib/constants';

interface AssetFormProps {
  onSuccess?: (newAsset?: { success: boolean; insertedId?: string; updatedId?: string }) => void;
  editAsset?: Record<string, unknown> | null;
  onCancel?: () => void;
  userProfile?: { centre: string; department: string } | null;
}

export default function AssetForm({ onSuccess, editAsset, onCancel, userProfile }: AssetFormProps) {
  const defaultDepartment = (editAsset?.department as string) || userProfile?.department || '';
  const defaultCategory = (editAsset?.category as string) || '';

  function buildEditDefaults(asset: Record<string, unknown>): AssetFormData {
    const base: Record<string, unknown> = {
      name: asset.name as string,
      department: asset.department,
      category: asset.category,
      status: asset.status,
      acquired: asset.acquired,
      date: asset.date as string,
      site: asset.site as string,
      quantity: (asset.quantity as number) || 1,
      description: (asset.description as string) || '',
    };
    // Copy category-specific optional fields if present
    const optionalFields = [
      'compound', 'companyName', 'dateOfManufacture', 'dateOfExpiry', 'medicineType',
      'manufacturer', 'countryOfOrigin', 'serialNumber', 'warrantyPeriod',
      'serviceInfo', 'insuranceInfo', 'insuranceDueDate', 'serviceDueDate',
    ];
    for (const field of optionalFields) {
      if (asset[field]) base[field] = asset[field] as string;
    }
    return base as AssetFormData;
  }

  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<AssetFormData>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: editAsset
      ? buildEditDefaults(editAsset)
      : {
          department: defaultDepartment,
          site: userProfile?.centre || '',
          quantity: 1,
        } as unknown as AssetFormData,
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const watchDepartment = watch('department') || defaultDepartment;
  const watchCategory = watch('category') || defaultCategory;

  const availableCategories = watchDepartment ? (DEPARTMENT_CATEGORIES[watchDepartment] || []) : [];

  async function onSubmit(data: AssetFormData) {
    setError('');
    setSuccess('');

    try {
      const isUpdate = !!editAsset;
      const url = '/api/asset';
      const method = isUpdate ? 'PUT' : 'POST';
      const payload = isUpdate ? { ...data, id: (editAsset as Record<string, unknown>)._id } : data;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json();

      if (res.ok && responseData.success) {
        const successMessage = isUpdate
          ? 'Asset updated successfully!'
          : `Asset added successfully! ID: ${responseData.asset?.assetId || ''}`;

        setSuccess(successMessage);

        if (!isUpdate) {
          reset();
        }

        setTimeout(() => {
          onSuccess?.(responseData);
        }, 500);

        setTimeout(() => {
          setSuccess('');
        }, 4000);
      } else {
        let errorMessage = 'Failed to save asset';

        if (responseData.details) {
          if (Array.isArray(responseData.details)) {
            errorMessage = responseData.details.map((err: { path?: string[]; message: string }) =>
              `${err.path?.join('.')}: ${err.message}`
            ).join(', ');
          } else if (typeof responseData.details === 'string') {
            errorMessage = responseData.details;
          }
        } else if (responseData.error) {
          errorMessage = typeof responseData.error === 'string' ? responseData.error : 'Server error occurred';
        }

        if (responseData.type === 'database_unavailable') {
          errorMessage = 'Database temporarily unavailable. Please try again.';
        } else if (responseData.type === 'not_found') {
          errorMessage = 'Asset not found. It may have been deleted.';
        }

        setError(errorMessage);
      }
    } catch {
      setError('Network error - please check your connection');
    }
  }

  return (
    <div className="font-wildlife">
      {success && (
        <div className="mb-4 p-4 bg-wildlife-green/15 border-2 border-wildlife-green/40 rounded-xl text-wildlife-green-text text-sm font-medium flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">✓</span>
            <div>{success}</div>
          </div>
          <button onClick={() => setSuccess('')} className="text-wildlife-green/60 hover:text-wildlife-green text-xs">✕</button>
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Row 1: Core fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Asset Name */}
          <div>
            <label className="block text-sm font-semibold text-wildlife-black mb-2">Asset Name *</label>
            <input {...register('name')} className="input" placeholder="e.g., Amoxicillin, X-Ray Machine..." />
            {errors.name && <span className="text-red-500 text-sm mt-1 block">{errors.name.message}</span>}
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-semibold text-wildlife-black mb-2">Department *</label>
            <select {...register('department')} className="input">
              <option value="">Select department...</option>
              {DEPARTMENTS.map(d => (
                <option key={d} value={d}>{DEPARTMENT_LABELS[d]}</option>
              ))}
            </select>
            {errors.department && <span className="text-red-500 text-sm mt-1 block">{errors.department.message}</span>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-wildlife-black mb-2">Category *</label>
            <select {...register('category')} className="input" disabled={!watchDepartment}>
              <option value="">Select category...</option>
              {availableCategories.map(c => (
                <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
              ))}
            </select>
            {errors.category && <span className="text-red-500 text-sm mt-1 block">{errors.category.message}</span>}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-wildlife-black mb-2">Status *</label>
            <select {...register('status')} className="input">
              <option value="">Select status...</option>
              <option value="active">Active</option>
              <option value="phased out">Phased Out</option>
            </select>
            {errors.status && <span className="text-red-500 text-sm mt-1 block">{errors.status.message}</span>}
          </div>

          {/* How Acquired */}
          <div>
            <label className="block text-sm font-semibold text-wildlife-black mb-2">How Acquired *</label>
            <select {...register('acquired')} className="input">
              <option value="">Select method...</option>
              <option value="donated">Donated</option>
              <option value="bought">Purchased</option>
            </select>
            {errors.acquired && <span className="text-red-500 text-sm mt-1 block">{errors.acquired.message}</span>}
          </div>

          {/* Date Acquired */}
          <div>
            <label className="block text-sm font-semibold text-wildlife-black mb-2">Date Acquired *</label>
            <input type="date" {...register('date')} className="input" max={new Date().toISOString().split('T')[0]} />
            {errors.date && <span className="text-red-500 text-sm mt-1 block">{errors.date.message}</span>}
          </div>

          {/* Wildlife Centre */}
          <div>
            <label className="block text-sm font-semibold text-wildlife-black mb-2">Wildlife Centre *</label>
            <select {...register('site')} className="input">
              <option value="">Select centre...</option>
              {CENTRES.map(site => (
                <option key={site} value={site}>{site}</option>
              ))}
            </select>
            {errors.site && <span className="text-red-500 text-sm mt-1 block">{errors.site.message}</span>}
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-semibold text-wildlife-black mb-2">Quantity *</label>
            <input type="number" {...register('quantity')} className="input" min={1} defaultValue={1} />
            {errors.quantity && <span className="text-red-500 text-sm mt-1 block">{errors.quantity.message}</span>}
          </div>
        </div>

        {/* Category-specific fields */}
        {watchCategory === 'medicine' && (
          <div className="border border-wildlife-green/20 rounded-xl p-4 bg-wildlife-green/5">
            <h5 className="text-sm font-semibold text-wildlife-black mb-4">Medicine Details</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-wildlife-black mb-1">Compound *</label>
                <input {...register('compound')} className="input" placeholder="e.g., Amoxicillin Trihydrate" />
                {'compound' in errors && <span className="text-red-500 text-sm mt-1 block">{(errors as Record<string, { message?: string }>).compound?.message}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-wildlife-black mb-1">Company Name *</label>
                <input {...register('companyName')} className="input" placeholder="Pharmaceutical company" />
                {'companyName' in errors && <span className="text-red-500 text-sm mt-1 block">{(errors as Record<string, { message?: string }>).companyName?.message}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-wildlife-black mb-1">Medicine Type *</label>
                <select {...register('medicineType')} className="input">
                  <option value="">Select type...</option>
                  {MEDICINE_TYPES.map(t => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
                {'medicineType' in errors && <span className="text-red-500 text-sm mt-1 block">{(errors as Record<string, { message?: string }>).medicineType?.message}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-wildlife-black mb-1">Date of Manufacture</label>
                <input type="date" {...register('dateOfManufacture')} className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-wildlife-black mb-1">Date of Expiry *</label>
                <input type="date" {...register('dateOfExpiry')} className="input" />
                {'dateOfExpiry' in errors && <span className="text-red-500 text-sm mt-1 block">{(errors as Record<string, { message?: string }>).dateOfExpiry?.message}</span>}
              </div>
            </div>
          </div>
        )}

        {watchCategory === 'medical-supplies' && (
          <div className="border border-wildlife-green/20 rounded-xl p-4 bg-wildlife-green/5">
            <h5 className="text-sm font-semibold text-wildlife-black mb-4">Medical Supplies Details</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-wildlife-black mb-1">Manufacturer *</label>
                <input {...register('manufacturer')} className="input" placeholder="Manufacturer name" />
                {'manufacturer' in errors && <span className="text-red-500 text-sm mt-1 block">{(errors as Record<string, { message?: string }>).manufacturer?.message}</span>}
              </div>
            </div>
          </div>
        )}

        {watchCategory === 'medical-equipment' && (
          <div className="border border-wildlife-green/20 rounded-xl p-4 bg-wildlife-green/5">
            <h5 className="text-sm font-semibold text-wildlife-black mb-4">Medical Equipment Details</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-wildlife-black mb-1">Manufacturer *</label>
                <input {...register('manufacturer')} className="input" placeholder="Manufacturer name" />
                {'manufacturer' in errors && <span className="text-red-500 text-sm mt-1 block">{(errors as Record<string, { message?: string }>).manufacturer?.message}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-wildlife-black mb-1">Country of Origin</label>
                <input {...register('countryOfOrigin')} className="input" placeholder="e.g., India, USA" />
              </div>
              <div>
                <label className="block text-sm font-medium text-wildlife-black mb-1">Serial Number</label>
                <input {...register('serialNumber')} className="input" placeholder="Equipment serial number" />
              </div>
              <div>
                <label className="block text-sm font-medium text-wildlife-black mb-1">Warranty Period</label>
                <input {...register('warrantyPeriod')} className="input" placeholder="e.g., 2 years" />
              </div>
              <div>
                <label className="block text-sm font-medium text-wildlife-black mb-1">Service Info</label>
                <input {...register('serviceInfo')} className="input" placeholder="Service provider / schedule" />
              </div>
              <div>
                <label className="block text-sm font-medium text-wildlife-black mb-1">Insurance Info</label>
                <input {...register('insuranceInfo')} className="input" placeholder="Insurance details" />
              </div>
            </div>
          </div>
        )}

        {watchCategory === 'vehicle' && (
          <div className="border border-wildlife-green/20 rounded-xl p-4 bg-wildlife-green/5">
            <h5 className="text-sm font-semibold text-wildlife-black mb-4">Vehicle Details</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-wildlife-black mb-1">Manufacturer</label>
                <input {...register('manufacturer')} className="input" placeholder="e.g., Tata, Mahindra" />
              </div>
              <div>
                <label className="block text-sm font-medium text-wildlife-black mb-1">Insurance Due Date</label>
                <input type="date" {...register('insuranceDueDate')} className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-wildlife-black mb-1">Service Due Date</label>
                <input type="date" {...register('serviceDueDate')} className="input" />
              </div>
            </div>
          </div>
        )}

        {(watchCategory === 'av-equipment' || watchCategory === 'furniture' || watchCategory === 'machinery') && (
          <div className="border border-wildlife-green/20 rounded-xl p-4 bg-wildlife-green/5">
            <h5 className="text-sm font-semibold text-wildlife-black mb-4">{CATEGORY_LABELS[watchCategory]} Details</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-wildlife-black mb-1">Manufacturer</label>
                <input {...register('manufacturer')} className="input" placeholder="Manufacturer name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-wildlife-black mb-1">Serial Number</label>
                <input {...register('serialNumber')} className="input" placeholder="Serial number" />
              </div>
            </div>
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-wildlife-black mb-2">Description</label>
          <textarea
            {...register('description')}
            className="input min-h-[80px] resize-vertical"
            placeholder="Additional details about the asset..."
            rows={3}
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4 pt-4 border-t border-wildlife-green/20">
          {editAsset && (
            <button
              type="button"
              className="px-6 py-3 border border-wildlife-brown/30 text-wildlife-brown-dark rounded-xl hover:bg-wildlife-brown/5 transition-colors duration-200"
              onClick={() => onCancel?.()}
            >
              Cancel Edit
            </button>
          )}
          <button
            type="button"
            className="px-6 py-3 border border-wildlife-green/30 text-wildlife-brown-dark rounded-xl hover:bg-wildlife-green/5 transition-colors duration-200"
            onClick={() => reset()}
          >
            Reset Form
          </button>
          <button
            type="submit"
            className="btn-wildlife px-8 py-3 flex items-center space-x-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin">⏳</span>
                <span>{editAsset ? 'Updating...' : 'Adding...'}</span>
              </>
            ) : (
              <>
                <span>{editAsset ? '✏️' : (
                  <div className="w-5 h-5 relative">
                    <Image src="/download (2).jpg" alt="Wildlife SOS Logo" fill className="object-contain rounded-full" />
                  </div>
                )}</span>
                <span>{editAsset ? 'Update Asset' : 'Add Asset'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
