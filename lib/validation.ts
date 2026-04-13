import { z } from 'zod';
import { CENTRES, DEPARTMENTS, MEDICINE_TYPES } from '@/lib/constants';

// --- User Profile schema ---
export const userProfileSchema = z.object({
  centre: z.enum(CENTRES as unknown as [string, ...string[]], {
    errorMap: () => ({ message: 'Please select a centre' })
  }),
  department: z.enum(DEPARTMENTS as unknown as [string, ...string[]], {
    errorMap: () => ({ message: 'Please select a department' })
  }),
});

// --- Asset schemas (discriminated union by category) ---

const baseAssetFields = {
  name: z.string().min(1, 'Asset name is required'),
  department: z.enum(DEPARTMENTS as unknown as [string, ...string[]], {
    errorMap: () => ({ message: 'Please select a department' })
  }),
  status: z.enum(['active', 'phased out'], {
    errorMap: () => ({ message: 'Please select a valid status' })
  }),
  acquired: z.enum(['donated', 'bought'], {
    errorMap: () => ({ message: 'Please select how the asset was acquired' })
  }),
  date: z.string().min(1, 'Date is required').refine((date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  }, 'Please enter a valid date'),
  site: z.enum(CENTRES as unknown as [string, ...string[]], {
    errorMap: () => ({ message: 'Please select a wildlife centre' })
  }),
  quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1'),
  description: z.string().optional(),
};

// Medicine (veterinary)
const medicineFormSchema = z.object({
  ...baseAssetFields,
  category: z.literal('medicine'),
  compound: z.string().min(1, 'Compound is required'),
  companyName: z.string().min(1, 'Company name is required'),
  dateOfManufacture: z.string().optional(),
  dateOfExpiry: z.string().min(1, 'Expiry date is required'),
  medicineType: z.enum(MEDICINE_TYPES as unknown as [string, ...string[]], {
    errorMap: () => ({ message: 'Please select a medicine type' })
  }),
});

// Medical Supplies (veterinary)
const medicalSuppliesFormSchema = z.object({
  ...baseAssetFields,
  category: z.literal('medical-supplies'),
  manufacturer: z.string().min(1, 'Manufacturer is required'),
});

// Medical Equipment (veterinary)
const medicalEquipmentFormSchema = z.object({
  ...baseAssetFields,
  category: z.literal('medical-equipment'),
  manufacturer: z.string().min(1, 'Manufacturer is required'),
  countryOfOrigin: z.string().optional(),
  serialNumber: z.string().optional(),
  warrantyPeriod: z.string().optional(),
  serviceInfo: z.string().optional(),
  insuranceInfo: z.string().optional(),
});

// Vehicle
const vehicleFormSchema = z.object({
  ...baseAssetFields,
  category: z.literal('vehicle'),
  manufacturer: z.string().optional(),
  insuranceDueDate: z.string().optional(),
  serviceDueDate: z.string().optional(),
});

// AV Equipment
const avEquipmentFormSchema = z.object({
  ...baseAssetFields,
  category: z.literal('av-equipment'),
  manufacturer: z.string().optional(),
  serialNumber: z.string().optional(),
});

// Furniture
const furnitureFormSchema = z.object({
  ...baseAssetFields,
  category: z.literal('furniture'),
  manufacturer: z.string().optional(),
  serialNumber: z.string().optional(),
});

// Machinery
const machineryFormSchema = z.object({
  ...baseAssetFields,
  category: z.literal('machinery'),
  manufacturer: z.string().optional(),
  serialNumber: z.string().optional(),
});

// Client-side discriminated union (without loggedBy)
export const assetFormSchema = z.discriminatedUnion('category', [
  medicineFormSchema,
  medicalSuppliesFormSchema,
  medicalEquipmentFormSchema,
  vehicleFormSchema,
  avEquipmentFormSchema,
  furnitureFormSchema,
  machineryFormSchema,
]);

export type AssetFormData = z.infer<typeof assetFormSchema>;

// Loggedby extension for server-side
const loggedBySchema = z.object({
  name: z.string().min(1, 'User name is required'),
  email: z.string().email('Valid email is required'),
});

// Server-side: we validate the form data then attach loggedBy separately
// (discriminatedUnion.extend() is not supported, so we validate in two steps)
export const loggedByFieldSchema = loggedBySchema;

// Keep backward-compatible export
export { assetFormSchema as default };
