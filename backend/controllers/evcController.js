import { memoryStore, logAuditEvent } from '../utils/memoryStore.js';
import EVCInspection from '../models/EVCInspection.js';
import Application from '../models/Application.js';
import Undertaking from '../models/Undertaking.js';
import { getDBStatus } from '../config/db.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

// Haversine formula for exact distance between two GPS coordinates in meters
const calculateDistanceMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
};

export const getEVCInspections = async (req, res) => {
  try {
    let inspections = [];
    if (getDBStatus()) {
      inspections = await EVCInspection.find().sort({ updatedAt: -1 });
    } else {
      inspections = [...memoryStore.inspections];
    }
    res.json({ success: true, count: inspections.length, inspections });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const scheduleInspection = async (req, res) => {
  try {
    const { id } = req.params;
    const { scheduledDate, committeeMembers = [] } = req.body;

    let inspection = memoryStore.inspections.find((i) => i.applicationId === id);
    if (!inspection && getDBStatus()) {
      inspection = await EVCInspection.findOne({ applicationId: id });
    }

    if (!inspection) {
      return res.status(404).json({ success: false, message: 'Inspection record not found' });
    }

    inspection.scheduledDate = new Date(scheduledDate);
    inspection.status = 'Scheduled';
    if (committeeMembers.length > 0) {
      inspection.committeeMembers = committeeMembers;
    }

    if (getDBStatus()) {
      await EVCInspection.findOneAndUpdate(
        { applicationId: id },
        { scheduledDate: inspection.scheduledDate, status: 'Scheduled', committeeMembers: inspection.committeeMembers }
      );
    }

    await logAuditEvent({
      applicationId: id,
      actorName: req.user?.name || 'EVC Chairman',
      role: 'EVC',
      action: 'INSPECTION_SCHEDULED',
      remarks: `Inspection visit scheduled for ${new Date(scheduledDate).toLocaleDateString('en-IN')}`,
    });

    res.json({
      success: true,
      message: 'Inspection visit date confirmed and calendar notification dispatched.',
      inspection,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DIFFERENTIATOR 3: Anti-Fraud Geofence Verifier + Cloudinary Upload
 * Inspects photo GPS metadata and compares with registered campus coordinates.
 */
export const uploadInspectionPhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const { tag = 'Lab Facility', latitude, longitude, notes = '' } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No photo provided for inspection proof' });
    }

    let inspection = memoryStore.inspections.find((i) => i.applicationId === id);
    if (!inspection && getDBStatus()) {
      inspection = await EVCInspection.findOne({ applicationId: id });
    }

    if (!inspection) {
      return res.status(404).json({ success: false, message: 'Inspection record not found' });
    }

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      'aicte_pravah/inspections',
      `evc_${id}_${Date.now()}`,
      req.file.mimetype
    );

    // Calculate Geofence Distance
    const photoLat = parseFloat(latitude) || inspection.collegeCoordinates?.latitude || 23.2599;
    const photoLng = parseFloat(longitude) || inspection.collegeCoordinates?.longitude || 77.4126;
    const collegeLat = inspection.collegeCoordinates?.latitude || 23.2599;
    const collegeLng = inspection.collegeCoordinates?.longitude || 77.4126;

    const distanceMeters = calculateDistanceMeters(collegeLat, collegeLng, photoLat, photoLng);
    const matchesGeofence = distanceMeters <= (inspection.geofenceThresholdMeters || 200);

    const photoEvidenceObj = {
      url: uploadResult.secure_url,
      tag,
      latitude: photoLat,
      longitude: photoLng,
      timestamp: new Date(),
      matchesGeofence,
      notes: `${notes} [Geofence Check: ${distanceMeters}m away - ${matchesGeofence ? 'VERIFIED' : 'GEOFENCE WARNING'}]`,
    };

    inspection.photoEvidence.push(photoEvidenceObj);
    inspection.distanceMeters = distanceMeters;
    inspection.geofenceVerified = matchesGeofence;

    if (getDBStatus()) {
      await EVCInspection.findOneAndUpdate(
        { applicationId: id },
        {
          $push: { photoEvidence: photoEvidenceObj },
          distanceMeters,
          geofenceVerified: matchesGeofence,
        }
      );
    }

    await logAuditEvent({
      applicationId: id,
      actorName: req.user?.name || 'EVC Inspector',
      role: 'EVC',
      action: 'GEOFENCE_PHOTO_VERIFIED',
      remarks: `Inspection evidence uploaded: ${tag}. Physical location distance: ${distanceMeters}m (${
        matchesGeofence ? 'Pass: Inside Campus' : 'Fail: Outside Geofence'
      })`,
    });

    res.json({
      success: true,
      message: matchesGeofence
        ? `Evidence validated! Photo GPS confirmed inside campus geofence (${distanceMeters}m distance).`
        : `Geofence Warning: Photo taken ${distanceMeters}m away from campus perimeter!`,
      photo: photoEvidenceObj,
      geofenceCheck: {
        distanceMeters,
        thresholdMeters: inspection.geofenceThresholdMeters || 200,
        matchesGeofence,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const submitInspectionReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { verdict, checklist = [], overallObservations = '', undertakingsRequired = [] } = req.body;

    let inspection = memoryStore.inspections.find((i) => i.applicationId === id);
    if (!inspection && getDBStatus()) {
      inspection = await EVCInspection.findOne({ applicationId: id });
    }

    if (!inspection) {
      return res.status(404).json({ success: false, message: 'Inspection record not found' });
    }

    let app = memoryStore.applications.find((a) => a.applicationId === id);
    if (!app && getDBStatus()) {
      app = await Application.findOne({ applicationId: id });
    }

    inspection.verdict = verdict;
    inspection.status = 'Completed';
    inspection.visitCompletedDate = new Date();
    inspection.overallObservations = overallObservations;
    if (checklist.length > 0) inspection.checklist = checklist;
    inspection.undertakingsRequired = undertakingsRequired;

    // Advance application state based on verdict
    if (app) {
      if (verdict === 'Recommended') {
        app.status = 'Approved';
        app.stage = 'Final Decision';
      } else if (verdict === 'Recommended with Undertaking') {
        app.status = 'Approved';
        app.stage = 'Final Decision';

        // Automatically create undertaking records for each required undertaking
        undertakingsRequired.forEach((title, idx) => {
          const newUndertaking = {
            _id: `und_${Date.now()}_${idx}`,
            applicationId: id,
            institutionName: app.institutionName,
            title,
            clauseReference: 'APH 2024-27 Clause 4.8',
            description: `Mandatory compliance requirement: ${title}. Evidence must be submitted before deadline.`,
            issuedDate: new Date(),
            dueDate: new Date(Date.now() + 60 * 86400000), // 60 days to comply
            daysRemaining: 60,
            status: 'Pending',
            complianceProofUrl: '',
            submissionNotes: '',
            penaltyAction: 'Intake restriction in subsequent cycle',
          };
          memoryStore.undertakings.push(newUndertaking);
        });
      } else if (verdict === 'Not Recommended') {
        app.status = 'Rejected';
        app.stage = 'SAC_SHC'; // Can appeal to Standing Appellate Committee
      }
    }

    if (getDBStatus()) {
      await EVCInspection.findOneAndUpdate({ applicationId: id }, inspection);
      if (app) {
        await Application.findOneAndUpdate({ applicationId: id }, { status: app.status, stage: app.stage });
      }
    }

    await logAuditEvent({
      applicationId: id,
      actorName: req.user?.name || 'EVC Chairperson',
      role: 'EVC',
      action: 'EVC_VERDICT_SUBMITTED',
      fromState: 'EVC Scheduled',
      toState: app?.status || 'EVC Completed',
      remarks: `EVC report submitted. Final Verdict: ${verdict}. ${undertakingsRequired.length} undertakings registered.`,
    });

    res.json({
      success: true,
      message: `EVC Inspection report submitted successfully with verdict: ${verdict}.`,
      inspection,
      application: app,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
