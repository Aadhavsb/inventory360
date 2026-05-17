"use client";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { assetFormSchema, type AssetFormData } from '@/lib/validation';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  CENTRES,
  DEPARTMENTS,
  DEPARTMENT_LABELS,
  DEPARTMENT_CATEGORIES,
  CATEGORY_LABELS,
  MEDICINE_TYPES,
  FURNITURE_TYPES,
  FURNITURE_TYPE_LABELS,
  MACHINERY_TYPES,
  MACHINERY_TYPE_LABELS,
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
      'itemType',
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
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => { timerRefs.current.forEach(clearTimeout); };
  }, []);

  // Image state (managed outside react-hook-form)
  const [imagePreview, setImagePreview] = useState<string | null>(
    (editAsset?.image as string) || null
  );

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be under 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  // Repair history state (managed outside react-hook-form due to discriminated union limitations)
  interface RepairEntry { date: string; description: string; cost: number | string; }
  const [repairHistory, setRepairHistory] = useState<RepairEntry[]>(
    editAsset?.repairHistory
      ? (editAsset.repairHistory as RepairEntry[]).map(e => ({
          date: e.date ? new Date(e.date as string).toISOString().split('T')[0] : '',
          description: e.description || '',
          cost: e.cost ?? '',
        }))
      : []
  );

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
      // Attach extra fields not managed by react-hook-form
      const extraFields: Record<string, unknown> = {};
      if (data.category === 'vehicle' && repairHistory.length > 0) {
        extraFields.repairHistory = repairHistory;
      }
      if (imagePreview) {
        extraFields.image = imagePreview;
      }
      const formData = { ...data, ...extraFields };
      const payload = isUpdate ? { ...formData, id: (editAsset as Record<string, unknown>)._id } : formData;

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

        timerRefs.current.push(setTimeout(() => { onSuccess?.(responseData); }, 500));
        timerRefs.current.push(setTimeout(() => { setSuccess(''); }, 4000));
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
          <button onClick={() => setSuccess('')} aria-label="Dismiss" className="text-wildlife-green/60 hover:text-wildlife-green text-xs">✕</button>
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

            {/* Repair History */}
            <div className="mt-4 pt-4 border-t border-wildlife-green/20">
              <div className="flex items-center justify-between mb-3">
                <h6 className="text-sm font-semibold text-wildlife-black">Repair History</h6>
                <button
                  type="button"
                  onClick={() => setRepairHistory([...repairHistory, { date: '', description: '', cost: '' }])}
                  className="text-xs px-3 py-1 bg-wildlife-green/10 text-wildlife-green-text rounded-lg hover:bg-wildlife-green/20 transition-colors"
                >
                  + Add Repair Entry
                </button>
              </div>
              {repairHistory.length === 0 && (
                <p className="text-sm text-wildlife-brown-dark italic">No repair entries yet.</p>
              )}
              {repairHistory.map((entry, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr_auto] gap-3 mb-3 items-end">
                  <div>
                    <label className="block text-xs font-medium text-wildlife-black mb-1">Date *</label>
                    <input
                      type="date"
                      className="input"
                      value={entry.date}
                      onChange={(e) => {
                        const updated = [...repairHistory];
                        updated[index] = { ...updated[index], date: e.target.value };
                        setRepairHistory(updated);
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-wildlife-black mb-1">Description *</label>
                    <input
                      className="input"
                      placeholder="e.g., Engine oil change"
                      value={entry.description}
                      onChange={(e) => {
                        const updated = [...repairHistory];
                        updated[index] = { ...updated[index], description: e.target.value };
                        setRepairHistory(updated);
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-wildlife-black mb-1">Cost (₹) *</label>
                    <input
                      type="number"
                      className="input"
                      min={0}
                      placeholder="0"
                      value={entry.cost}
                      onChange={(e) => {
                        const updated = [...repairHistory];
                        updated[index] = { ...updated[index], cost: e.target.value };
                        setRepairHistory(updated);
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setRepairHistory(repairHistory.filter((_, i) => i !== index))}
                    className="text-red-500 hover:text-red-700 text-sm px-2 py-2"
                    aria-label="Remove repair entry"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {watchCategory === 'av-equipment' && (
          <div className="border border-wildlife-green/20 rounded-xl p-4 bg-wildlife-green/5">
            <h5 className="text-sm font-semibold text-wildlife-black mb-4">AV Equipment Details</h5>
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

        {watchCategory === 'furniture' && (
          <div className="border border-wildlife-green/20 rounded-xl p-4 bg-wildlife-green/5">
            <h5 className="text-sm font-semibold text-wildlife-black mb-4">Furniture Details</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-wildlife-black mb-1">Furniture Type *</label>
                <select {...register('itemType')} className="input">
                  <option value="">Select type...</option>
                  {FURNITURE_TYPES.map(t => (
                    <option key={t} value={t}>{FURNITURE_TYPE_LABELS[t]}</option>
                  ))}
                </select>
                {'itemType' in errors && <span className="text-red-500 text-sm mt-1 block">{(errors as Record<string, { message?: string }>).itemType?.message}</span>}
              </div>
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

        {watchCategory === 'machinery' && (
          <div className="border border-wildlife-green/20 rounded-xl p-4 bg-wildlife-green/5">
            <h5 className="text-sm font-semibold text-wildlife-black mb-4">Machinery Details</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-wildlife-black mb-1">Machinery Type *</label>
                <select {...register('itemType')} className="input">
                  <option value="">Select type...</option>
                  {MACHINERY_TYPES.map(t => (
                    <option key={t} value={t}>{MACHINERY_TYPE_LABELS[t]}</option>
                  ))}
                </select>
                {'itemType' in errors && <span className="text-red-500 text-sm mt-1 block">{(errors as Record<string, { message?: string }>).itemType?.message}</span>}
              </div>
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

        {/* Asset Image */}
        <div>
          <label className="block text-sm font-semibold text-wildlife-black mb-2">Asset Photo</label>
          <div className="flex items-start space-x-4">
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="input text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-wildlife-green/10 file:text-wildlife-green-text hover:file:bg-wildlife-green/20"
              />
              <p className="text-xs text-wildlife-brown-dark mt-1">Max 2MB. JPG, PNG accepted.</p>
            </div>
            {imagePreview && (
              <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-wildlife-tan">
                <img src={imagePreview} alt="Asset preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  aria-label="Remove image"
                  className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-bl-lg"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
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
