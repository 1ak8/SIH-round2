import mongoose from 'mongoose';

const documentRecordSchema = new mongoose.Schema(
  {
    applicationId: { type: String, required: true },
    institutionName: { type: String, required: true },
    region: { type: String, default: 'Central' },
    docType: {
      type: String,
      required: true,
      enum: [
        'Land Lease Deed',
        'Fire Safety NOC',
        'Building Structural Stability',
        'University Affiliation',
        'Pollution Control NOC',
        'Occupancy Certificate',
      ],
    },
    certificateNumber: { type: String, default: '' },
    issuingAuthority: { type: String, default: 'Competent Authority' },
    issueDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    fileUrl: { type: String, default: '' },
    validityStatus: {
      type: String,
      enum: ['Valid', 'Expiring Soon', 'Expired'],
      default: 'Valid',
    },
    daysUntilExpiry: { type: Number, default: 365 },
    renewalSubmitted: { type: Boolean, default: false },
    renewalSubmissionNotes: { type: String, default: '' },
    renewalDocUrl: { type: String, default: '' },
    verifiedOnsite: { type: Boolean, default: false },
    onsiteVerifiedBy: { type: String, default: '' },
    onsiteVerifiedAt: { type: Date },
    showCauseIssued: { type: Boolean, default: false },
    showCauseReason: { type: String, default: '' },
    showCauseIssuedAt: { type: Date },
    alertsDispatched: [
      {
        channel: { type: String, enum: ['WhatsApp', 'Email', 'In-App', 'SMS'], default: 'In-App' },
        timestamp: { type: Date, default: Date.now },
        recipient: { type: String },
        message: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.DocumentRecord || mongoose.model('DocumentRecord', documentRecordSchema);
