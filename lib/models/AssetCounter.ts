import mongoose from 'mongoose';

const assetCounterSchema = new mongoose.Schema({
  prefix: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 },
});

const AssetCounter = mongoose.models.AssetCounter || mongoose.model('AssetCounter', assetCounterSchema);
export default AssetCounter;
