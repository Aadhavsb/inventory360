import mongoose from 'mongoose';
import { CENTRES, DEPARTMENTS } from '@/lib/constants';

const userProfileSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  centre: {
    type: String,
    required: true,
    enum: [...CENTRES],
  },
  department: {
    type: String,
    required: true,
    enum: [...DEPARTMENTS],
  },
}, {
  timestamps: true,
});

const UserProfile = mongoose.models.UserProfile || mongoose.model('UserProfile', userProfileSchema);

export default UserProfile;
