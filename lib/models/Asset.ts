import mongoose from 'mongoose';
import { DEPARTMENTS, CATEGORIES, MEDICINE_TYPES, CENTRES } from '@/lib/constants';

const repairEntrySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  description: { type: String, required: true },
  cost: { type: Number, required: true },
}, { _id: false });

const assetSchema = new mongoose.Schema({
  // Unique human-readable ID (generated server-side)
  assetId: {
    type: String,
    unique: true,
    sparse: true,
  },

  // Core fields (all assets)
  name: {
    type: String,
    required: true,
    trim: true,
  },
  department: {
    type: String,
    required: true,
    enum: [...DEPARTMENTS],
  },
  category: {
    type: String,
    required: true,
    enum: [...CATEGORIES],
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'phased out'],
  },
  acquired: {
    type: String,
    required: true,
    enum: ['donated', 'bought'],
  },
  date: {
    type: Date,
    required: true,
  },
  site: {
    type: String,
    required: true,
    enum: [...CENTRES],
    trim: true,
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },
  description: {
    type: String,
    trim: true,
  },
  loggedBy: {
    name: { type: String, required: true },
    email: { type: String, required: true },
  },

  // --- Veterinary > Medicine ---
  compound: { type: String, trim: true },
  companyName: { type: String, trim: true },
  dateOfManufacture: { type: Date },
  dateOfExpiry: { type: Date },
  medicineType: {
    type: String,
    enum: [...MEDICINE_TYPES],
  },

  // --- Veterinary > Medical Supplies & Equipment, AV, Furniture, Machinery ---
  manufacturer: { type: String, trim: true },
  countryOfOrigin: { type: String, trim: true },
  serialNumber: { type: String, trim: true },
  warrantyPeriod: { type: String, trim: true },
  serviceInfo: { type: String, trim: true },
  insuranceInfo: { type: String, trim: true },

  // --- Vehicles ---
  insuranceDueDate: { type: Date },
  serviceDueDate: { type: Date },
  repairHistory: [repairEntrySchema],
}, {
  timestamps: true,
});

const Asset = mongoose.models.Asset || mongoose.model('Asset', assetSchema);

export default Asset;
