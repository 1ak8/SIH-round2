import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    applicationId: { type: String, default: 'SYSTEM' },
    actorName: { type: String, default: 'System Engine' },
    role: { type: String, default: 'HQ Super-Admin' },
    action: { type: String, required: true },
    fromState: { type: String, default: '' },
    toState: { type: String, default: '' },
    remarks: { type: String, default: '' },
    ipAddress: { type: String, default: '127.0.0.1' },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);
