import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['college', 'ro', 'evc', 'hq'],
      required: true,
      default: 'college',
    },
    institutionName: { type: String, default: '' },
    region: {
      type: String,
      enum: ['Northern', 'Western', 'Southern', 'Eastern', 'Central', 'Pan-India', 'HQ'],
      default: 'Central',
    },
    designation: { type: String, default: '' },
    phone: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', userSchema);
