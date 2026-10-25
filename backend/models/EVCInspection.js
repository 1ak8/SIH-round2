import mongoose from 'mongoose';

const evcInspectionSchema = new mongoose.Schema(
  {
    applicationId: { type: String, required: true, unique: true },
    institutionName: { type: String, required: true },
    committeeMembers: [
      {
        name: { type: String, required: true },
        designation: { type: String, default: 'Member' },
        institution: { type: String, default: 'National Institute of Technology' },
        email: { type: String },
        phone: { type: String },
      },
    ],
    scheduledDate: { type: Date },
    visitCompletedDate: { type: Date },
    status: {
      type: String,
      enum: ['Pending Schedule', 'Scheduled', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Pending Schedule',
    },
    collegeCoordinates: {
      latitude: { type: Number, default: 23.2599 },
      longitude: { type: Number, default: 77.4126 },
    },
    inspectionCoordinates: {
      latitude: { type: Number, default: 23.2601 },
      longitude: { type: Number, default: 77.4128 },
      accuracyMeters: { type: Number, default: 8.5 },
    },
    distanceMeters: { type: Number, default: 28 },
    geofenceVerified: { type: Boolean, default: true },
    geofenceThresholdMeters: { type: Number, default: 200 },
    photoEvidence: [
      {
        url: { type: String },
        tag: { type: String, default: 'General Campus' },
        latitude: { type: Number },
        longitude: { type: Number },
        timestamp: { type: Date, default: Date.now },
        matchesGeofence: { type: Boolean, default: true },
        notes: { type: String, default: '' },
      },
    ],
    checklist: [
      {
        category: { type: String, default: 'Infrastructure' },
        item: { type: String, required: true },
        verified: { type: Boolean, default: true },
        score: { type: Number, default: 10 },
        remarks: { type: String, default: 'Verified on-site as per APH norms' },
      },
    ],
    verdict: {
      type: String,
      enum: [
        'Pending Review',
        'Recommended',
        'Recommended with Undertaking',
        'Not Recommended',
      ],
      default: 'Pending Review',
    },
    undertakingsRequired: [{ type: String }],
    overallObservations: { type: String, default: '' },
    inspectionChairperson: { type: String, default: 'Prof. S. N. Deshmukh' },
    submittedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.EVCInspection || mongoose.model('EVCInspection', evcInspectionSchema);
