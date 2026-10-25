import mongoose from 'mongoose';

const undertakingSchema = new mongoose.Schema(
  {
    applicationId: { type: String, required: true },
    institutionName: { type: String, required: true },
    title: { type: String, required: true },
    clauseReference: { type: String, default: 'APH Clause 4.8' },
    description: { type: String, required: true },
    issuedDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    daysRemaining: { type: Number, default: 90 },
    status: {
      type: String,
      enum: ['Pending', 'Proof Submitted', 'Verified & Cleared', 'Defaulted / Breached'],
      default: 'Pending',
    },
    complianceProofUrl: { type: String, default: '' },
    submissionNotes: { type: String, default: '' },
    submittedAt: { type: Date },
    verifiedBy: { type: String, default: '' },
    verifiedAt: { type: Date },
    officerRemarks: { type: String, default: '' },
    penaltyAction: { type: String, default: 'Show-cause notice and 25% intake freeze' },
  },
  { timestamps: true }
);

export default mongoose.models.Undertaking || mongoose.model('Undertaking', undertakingSchema);
