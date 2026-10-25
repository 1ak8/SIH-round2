import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    applicationId: { type: String, required: true, unique: true },
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    institutionName: { type: String, required: true },
    applicationType: {
      type: String,
      enum: [
        'New Approval',
        'Extension of Approval (EoA)',
        'Intake Increase',
        'Course Addition',
        'Closure of Course',
      ],
      default: 'Extension of Approval (EoA)',
    },
    academicYear: { type: String, default: '2026-2027' },
    region: {
      type: String,
      enum: ['Northern', 'Western', 'Southern', 'Eastern', 'Central'],
      required: true,
    },
    status: {
      type: String,
      enum: [
        'Draft',
        'Submitted',
        'Under Scrutiny',
        'Deficiency Raised',
        'Scrutiny Passed',
        'EVC Scheduled',
        'EVC Completed',
        'Approved',
        'Rejected',
      ],
      default: 'Submitted',
    },
    stage: {
      type: String,
      enum: ['Draft', 'Scrutiny', 'EVC', 'SAC_SHC', 'Final Decision'],
      default: 'Scrutiny',
    },
    infrastructureDetails: {
      landAreaAcres: { type: Number, default: 5.5 },
      builtUpAreaSqMtr: { type: Number, default: 12500 },
      totalClassrooms: { type: Number, default: 32 },
      totalLabs: { type: Number, default: 18 },
      computerCount: { type: Number, default: 450 },
      internetBandwidthMbps: { type: Number, default: 500 },
      latitude: { type: Number, default: 23.2599 },
      longitude: { type: Number, default: 77.4126 },
      address: { type: String, default: 'Knowledge Park, Phase II' },
    },
    courses: [
      {
        courseName: { type: String, default: 'B.Tech' },
        branch: { type: String, default: 'Computer Science & Engineering' },
        level: { type: String, default: 'Undergraduate' },
        proposedIntake: { type: Number, default: 120 },
        approvedIntake: { type: Number, default: 120 },
      },
    ],
    facultyRoster: [
      {
        facultyId: { type: String },
        name: { type: String, required: true },
        designation: { type: String, required: true },
        department: { type: String, required: true },
        panNumber: { type: String, required: true },
        aadhaarMasked: { type: String, default: 'XXXX-XXXX-4912' },
        highestQualification: { type: String, default: 'Ph.D in Engineering' },
        experienceYears: { type: Number, default: 8 },
        dateOfJoining: { type: Date, default: Date.now },
        biometricVerified: { type: Boolean, default: true },
      },
    ],
    campusPhotos: [
      {
        url: { type: String },
        caption: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    documents: [
      {
        docType: { type: String, required: true },
        fileUrl: { type: String, default: '' },
        issueDate: { type: Date },
        expiryDate: { type: Date },
        status: { type: String, default: 'Valid' },
      },
    ],
    deficiencies: [
      {
        deficiencyId: { type: String },
        field: { type: String },
        description: { type: String },
        raisedBy: { type: String, default: 'Regional Officer' },
        raisedAt: { type: Date, default: Date.now },
        status: {
          type: String,
          enum: ['Open', 'Resolved', 'Waived'],
          default: 'Open',
        },
        responseText: { type: String, default: '' },
        reuploadedDocUrl: { type: String, default: '' },
        resolvedAt: { type: Date },
      },
    ],
    sla: {
      stageStartedAt: { type: Date, default: Date.now },
      daysAllowed: { type: Number, default: 7 },
      daysSpent: { type: Number, default: 1 },
      daysRemaining: { type: Number, default: 6 },
      isOverdue: { type: Boolean, default: false },
      escalationLevel: { type: Number, default: 0 }, // 0: Normal, 1: Regional Director, 2: Member Secretary (HQ)
      escalatedAt: { type: Date },
      escalationReason: { type: String, default: '' },
      escalatedTo: { type: String, default: '' },
    },
    qrCodeDataUrl: { type: String, default: '' },
    docketGenerated: { type: Boolean, default: false },
    docketUrl: { type: String, default: '' },
    assignedRO: { type: String, default: 'Regional Officer' },
    assignedEVC: { type: String, default: '' },
    finalRemarks: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.Application || mongoose.model('Application', applicationSchema);
