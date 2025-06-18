import mongoose from 'mongoose';

// Asset Schema
const assetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['long-term', 'medical', 'perishable']
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'phased out']
  },
  acquired: {
    type: String,
    required: true,
    enum: ['donated', 'bought']
  },
  date: {
    type: Date,
    required: true
  },  site: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  loggedBy: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Create or get the Asset model
const Asset = mongoose.models.Asset || mongoose.model('Asset', assetSchema);

export default Asset;
export type { Asset as AssetType };
