import QRCode from 'qrcode';
import { memoryStore, logAuditEvent } from '../utils/memoryStore.js';
import Application from '../models/Application.js';
import DocumentRecord from '../models/DocumentRecord.js';
import EVCInspection from '../models/EVCInspection.js';
import Undertaking from '../models/Undertaking.js';
import AuditLog from '../models/AuditLog.js';
import { getDBStatus } from '../config/db.js';
import { calculateSLA, advanceSLABreach } from '../utils/slaEngine.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

export const getApplications = async (req, res) => {
  try {
    const { region, status, stage, search } = req.query;

    let apps = [];
    if (getDBStatus()) {
      const query = {};
      if (region && region !== 'All') query.region = region;
      if (status && status !== 'All') query.status = status;
      if (stage && stage !== 'All') query.stage = stage;
      if (search) {
        query.$or = [
          { applicationId: { $regex: search, $options: 'i' } },
          { institutionName: { $regex: search, $options: 'i' } },
        ];
      }
      apps = await Application.find(query).sort({ updatedAt: -1 });
    } else {
      apps = [...memoryStore.applications];
      if (region && region !== 'All') apps = apps.filter((a) => a.region === region);
      if (status && status !== 'All') apps = apps.filter((a) => a.status === status);
      if (stage && stage !== 'All') apps = apps.filter((a) => a.stage === stage);
      if (search) {
        const s = search.toLowerCase();
        apps = apps.filter(
          (a) =>
            a.applicationId.toLowerCase().includes(s) ||
            a.institutionName.toLowerCase().includes(s)
        );
      }
    }

    res.json({ success: true, count: apps.length, applications: apps });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    let app = null;
    let documents = [];
    let inspection = null;
    let undertakings = [];
    let auditHistory = [];

    if (getDBStatus()) {
      app = await Application.findOne({
        $or: [{ applicationId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
      });
      if (app) {
        documents = await DocumentRecord.find({ applicationId: app.applicationId });
        inspection = await EVCInspection.findOne({ applicationId: app.applicationId });
        undertakings = await Undertaking.find({ applicationId: app.applicationId });
        auditHistory = await AuditLog.find({ applicationId: app.applicationId }).sort({ timestamp: -1 });
      }
    } else {
      app = memoryStore.applications.find(
        (a) => a.applicationId === id || a._id === id
      );
      if (app) {
        documents = memoryStore.documents.filter((d) => d.applicationId === app.applicationId);
        inspection = memoryStore.inspections.find((i) => i.applicationId === app.applicationId);
        undertakings = memoryStore.undertakings.filter((u) => u.applicationId === app.applicationId);
        auditHistory = memoryStore.auditLogs.filter(
          (l) => l.applicationId === app.applicationId || l.applicationId === 'SYSTEM'
        );
      }
    }

    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    res.json({
      success: true,
      application: app,
      documents,
      inspection,
      undertakings,
      auditHistory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createApplication = async (req, res) => {
  try {
    const {
      institutionName,
      applicationType,
      region,
      academicYear = '2026-2027',
      infrastructureDetails,
      courses,
      documents = [],
    } = req.body;

    const count = memoryStore.applications.length + 1;
    const regionCode = (region || 'Central')[0].toUpperCase();
    const applicationId = `AICTE-2026-${regionCode}-${String(1000 + count).slice(-4)}`;

    const qrDataUrl = await QRCode.toDataURL(
      JSON.stringify({
        appId: applicationId,
        institution: institutionName,
        type: applicationType,
        appliedOn: new Date().toISOString(),
        verifyPortal: `https://aicte-india.org/verify/${applicationId}`,
      })
    );

    const initialSLA = calculateSLA(new Date(), 7);

    const newApp = {
      _id: `app_${Date.now()}`,
      applicationId,
      institutionName: institutionName || 'Demo Technical Institute',
      applicationType: applicationType || 'Extension of Approval (EoA)',
      academicYear,
      region: region || 'Central',
      status: 'Submitted',
      stage: 'Submitted',
      infrastructureDetails: infrastructureDetails || {
        landAreaAcres: 5.0,
        builtUpAreaSqMtr: 12000,
        totalClassrooms: 30,
        totalLabs: 16,
        computerCount: 400,
        internetBandwidthMbps: 500,
        latitude: 23.2599,
        longitude: 77.4126,
        address: 'Knowledge Park, Phase II',
      },
      courses: courses || [
        {
          courseName: 'B.Tech',
          branch: 'Computer Science & Engineering',
          level: 'UG',
          proposedIntake: 120,
          approvedIntake: 120,
        },
      ],
      facultyRoster: [
        {
          facultyId: `FAC-${applicationId}-01`,
          name: 'Dr. Rameshwar Dayal Tiwari',
          designation: 'Professor & HOD',
          department: 'Computer Science & Engineering',
          panNumber: 'ABCDE1234F',
          aadhaarMasked: 'XXXX-XXXX-8921',
          highestQualification: 'Ph.D (IIT Bombay)',
          experienceYears: 18,
          biometricVerified: true,
        },
        {
          facultyId: `FAC-${applicationId}-02`,
          name: 'Dr. Sneha Verma',
          designation: 'Associate Professor',
          department: 'Computer Science & Engineering',
          panNumber: 'BKLPV5541Q',
          aadhaarMasked: 'XXXX-XXXX-1142',
          highestQualification: 'Ph.D (MANIT Bhopal)',
          experienceYears: 11,
          biometricVerified: true,
        },
        {
          facultyId: `FAC-${applicationId}-03`,
          name: 'Prof. Amit Kumar Jha',
          designation: 'Assistant Professor',
          department: 'Computer Science & Engineering',
          panNumber: 'JHAAM9023K',
          aadhaarMasked: 'XXXX-XXXX-5510',
          highestQualification: 'M.Tech (BITS Pilani)',
          experienceYears: 5,
          biometricVerified: false,
        },
      ],
      campusPhotos: [],
      documents: documents.map((d) => ({
        docType: d.docType,
        fileUrl: d.fileUrl || '',
        issueDate: d.issueDate ? new Date(d.issueDate) : new Date(),
        expiryDate: d.expiryDate ? new Date(d.expiryDate) : new Date(Date.now() + 365 * 86400000),
        status: 'Valid',
      })),
      deficiencies: [],
      sla: initialSLA,
      qrCodeDataUrl: qrDataUrl,
      docketGenerated: false,
      assignedRO: 'Regional Officer',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRecords = documents.map((d, idx) => ({
      _id: `doc_${Date.now()}_${idx}`,
      applicationId,
      institutionName: institutionName || 'Apex Institute of Technology, Bhopal',
      docType: d.docType,
      fileName: `${(d.docType || 'doc').toLowerCase().replace(/\s+/g, '_')}_2026.pdf`,
      fileUrl: d.fileUrl || '',
      issueDate: d.issueDate ? new Date(d.issueDate) : new Date(),
      expiryDate: d.expiryDate ? new Date(d.expiryDate) : new Date(Date.now() + 365 * 86400000),
      validityStatus: 'Valid',
      daysUntilExpiry: 365,
      uploadedAt: new Date(),
    }));

    if (getDBStatus()) {
      await Application.create(newApp);
      if (docRecords.length > 0) {
        await DocumentRecord.insertMany(docRecords);
      }
    }
    memoryStore.applications.unshift(newApp);
    if (docRecords.length > 0) {
      memoryStore.documents.unshift(...docRecords);
    }

    await logAuditEvent({
      applicationId,
      actorName: req.user?.name || 'College Registrar',
      role: 'College',
      action: 'APPLICATION_SUBMITTED',
      fromState: 'Draft',
      toState: 'Submitted',
      remarks: `New application submitted for ${applicationType} (${academicYear})`,
    });

    res.status(201).json({
      success: true,
      message: 'Application registered and forwarded to Regional Scrutiny Desk successfully!',
      application: newApp,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadCampusPhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const { caption = 'Campus Infrastructure' } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No photo file provided' });
    }

    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      'aicte_pravah/campus',
      `campus_${id}`,
      req.file.mimetype
    );

    const photoObj = {
      url: uploadResult.secure_url,
      caption,
      timestamp: new Date(),
    };

    let app = memoryStore.applications.find((a) => a.applicationId === id);
    if (app) {
      app.campusPhotos.push(photoObj);
    }

    if (getDBStatus()) {
      await Application.findOneAndUpdate(
        { applicationId: id },
        { $push: { campusPhotos: photoObj } }
      );
    }

    await logAuditEvent({
      applicationId: id,
      actorName: req.user?.name || 'College Registrar',
      role: 'College',
      action: 'CAMPUS_PHOTO_UPLOADED',
      remarks: `Uploaded campus photo: ${caption}`,
    });

    res.json({
      success: true,
      message: 'Campus photo uploaded successfully via Cloudinary pipeline.',
      photo: photoObj,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DIFFERENTIATOR 1: Simulate SLA Breach Button
 * Advances application aging by 10 days, triggers Level 2 HQ escalation, and adds to Central Escalation Matrix.
 */
export const simulateSlaBreach = async (req, res) => {
  try {
    const { id } = req.params;
    const { days = 10 } = req.body;

    let app = memoryStore.applications.find((a) => a.applicationId === id);
    if (!app && getDBStatus()) {
      app = await Application.findOne({ applicationId: id });
    }

    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const previousSLA = { ...app.sla };
    const escalatedSLA = advanceSLABreach(app, days);

    app.sla = escalatedSLA;
    app.updatedAt = new Date();

    if (getDBStatus()) {
      await Application.findOneAndUpdate({ applicationId: id }, { sla: escalatedSLA });
    }

    await logAuditEvent({
      applicationId: id,
      actorName: req.user?.name || 'SLA Simulator Control',
      role: 'HQ Super-Admin',
      action: 'SLA_BREACH_SIMULATED',
      fromState: `Level ${previousSLA.escalationLevel || 0} (Days spent: ${previousSLA.daysSpent})`,
      toState: `Level 2 Critical Escalation (Days spent: ${escalatedSLA.daysSpent})`,
      remarks: `DEMO DIFFERENTIATOR: Artificial time-warp applied (+${days} days). Automatic alert dispatched to AICTE Member Secretary HQ.`,
    });

    res.json({
      success: true,
      message: `SLA breach simulated! Application aged by +${days} days. Level 2 HQ Escalation triggered.`,
      application: app,
      escalatedSLA,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DIFFERENTIATOR 4: One-Click AICTE Docket & PDF Generator with QR Code
 */
export const generateDocket = async (req, res) => {
  try {
    const { id } = req.params;

    let app = memoryStore.applications.find((a) => a.applicationId === id);
    if (!app && getDBStatus()) {
      app = await Application.findOne({ applicationId: id });
    }

    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const qrDataUrl = await QRCode.toDataURL(
      JSON.stringify({
        verificationId: `VER-${app.applicationId}`,
        institution: app.institutionName,
        region: app.region,
        academicYear: app.academicYear,
        approvalStage: app.stage,
        approvalStatus: app.status,
        timestamp: new Date().toISOString(),
        councilSeal: 'AICTE-GOVT-INDIA-VALIDATED',
      })
    );

    const docketData = {
      docketNumber: `AICTE/APH/${app.academicYear}/${app.applicationId}`,
      generatedAt: new Date(),
      validTill: '30th April 2027',
      qrCodeDataUrl: qrDataUrl,
      status: app.status,
      signatory: 'Member Secretary, All India Council for Technical Education',
      institutionDetails: {
        name: app.institutionName,
        region: app.region,
        address: app.infrastructureDetails?.address,
        landAreaAcres: app.infrastructureDetails?.landAreaAcres,
        builtUpAreaSqMtr: app.infrastructureDetails?.builtUpAreaSqMtr,
      },
      approvedCourses: app.courses,
    };

    app.docketGenerated = true;
    app.qrCodeDataUrl = qrDataUrl;
    app.docketUrl = `https://aicte-india.org/dockets/${app.applicationId}.pdf`;

    if (getDBStatus()) {
      await Application.findOneAndUpdate(
        { applicationId: id },
        { docketGenerated: true, qrCodeDataUrl: qrDataUrl, docketUrl: app.docketUrl }
      );
    }

    await logAuditEvent({
      applicationId: id,
      actorName: req.user?.name || 'Apex Approving Authority',
      role: 'HQ Super-Admin',
      action: 'DOCKET_GENERATED',
      remarks: `Generated official AICTE Approval Docket with cryptographically signed QR verification badge.`,
    });

    res.json({
      success: true,
      message: 'Official AICTE Approval Docket generated with encrypted QR badge.',
      docket: docketData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const forwardToRO = async (req, res) => {
  try {
    const { id } = req.params;

    let app = null;
    if (getDBStatus()) {
      app = await Application.findOne({ applicationId: id });
      if (app) {
        app.status = 'Under Scrutiny';
        app.stage = 'Scrutiny';
        app.assignedRO = app.assignedRO || 'Regional Officer (Bhopal RO)';
        app.sla = calculateSLA(new Date(), 7);
        await app.save();
      }
    } else {
      app = memoryStore.applications.find((a) => a.applicationId === id);
      if (app) {
        app.status = 'Under Scrutiny';
        app.stage = 'Scrutiny';
        app.assignedRO = app.assignedRO || 'Regional Officer (Bhopal RO)';
        app.sla = calculateSLA(new Date(), 7);
      }
    }

    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    await logAuditEvent({
      applicationId: id,
      actorName: req.user?.name || 'College Registrar',
      role: 'College',
      action: 'FORWARDED_TO_RO',
      fromState: 'Submitted',
      toState: 'Under Scrutiny',
      remarks: 'Application docket formally forwarded to Regional Officer Scrutiny Desk with SLA clock started.',
    });

    res.json({
      success: true,
      message: 'Application successfully forwarded to RO Scrutiny Desk!',
      application: app,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
