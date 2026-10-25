import { memoryStore, logAuditEvent } from '../utils/memoryStore.js';
import DocumentRecord from '../models/DocumentRecord.js';
import Undertaking from '../models/Undertaking.js';
import { getDBStatus } from '../config/db.js';
import { evaluateDocumentValidity, generateSimulatedAlert } from '../utils/expiryWatchdog.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

export const getUndertakings = async (req, res) => {
  try {
    const { applicationId, status } = req.query;
    let list = [];

    if (getDBStatus()) {
      const q = {};
      if (applicationId) q.applicationId = applicationId;
      if (status) q.status = status;
      list = await Undertaking.find(q).sort({ dueDate: 1 });
    } else {
      list = [...memoryStore.undertakings];
      if (applicationId) list = list.filter((u) => u.applicationId === applicationId);
      if (status) list = list.filter((u) => u.status === status);
    }

    res.json({ success: true, count: list.length, undertakings: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const submitUndertakingProof = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    let undertaking = memoryStore.undertakings.find((u) => u._id?.toString() === id || u.id === id);
    if (!undertaking && getDBStatus()) {
      undertaking = await Undertaking.findById(id);
    }

    if (!undertaking) {
      return res.status(404).json({ success: false, message: 'Undertaking record not found' });
    }

    let proofUrl = undertaking.complianceProofUrl;
    if (req.file) {
      const uploadRes = await uploadToCloudinary(
        req.file.buffer,
        'aicte_pravah/undertakings',
        `undertaking_${id}`,
        req.file.mimetype
      );
      proofUrl = uploadRes.secure_url;
    }

    undertaking.status = 'Proof Submitted';
    undertaking.complianceProofUrl = proofUrl;
    undertaking.submissionNotes = notes || 'Compliance documentation submitted';
    undertaking.submittedAt = new Date();

    if (getDBStatus()) {
      await Undertaking.findByIdAndUpdate(id, {
        status: 'Proof Submitted',
        complianceProofUrl: proofUrl,
        submissionNotes: undertaking.submissionNotes,
        submittedAt: undertaking.submittedAt,
      });
    }

    await logAuditEvent({
      applicationId: undertaking.applicationId,
      actorName: req.user?.name || 'College Principal',
      role: 'College',
      action: 'UNDERTAKING_PROOF_SUBMITTED',
      remarks: `Submitted compliance evidence for conditional undertaking: ${undertaking.title}`,
    });

    res.json({
      success: true,
      message: 'Compliance evidence submitted successfully! Under review by Regional Officer.',
      undertaking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyUndertaking = async (req, res) => {
  try {
    const { id } = req.params;
    const { verdict = 'Verified & Cleared', remarks = '' } = req.body;

    let undertaking = memoryStore.undertakings.find((u) => u._id?.toString() === id || u.id === id);
    if (!undertaking && getDBStatus()) {
      undertaking = await Undertaking.findById(id);
    }

    if (!undertaking) {
      return res.status(404).json({ success: false, message: 'Undertaking record not found' });
    }

    undertaking.status = verdict;
    undertaking.officerRemarks = remarks;
    undertaking.verifiedBy = req.user?.name || 'Regional Scrutiny Officer';
    undertaking.verifiedAt = new Date();

    if (getDBStatus()) {
      await Undertaking.findByIdAndUpdate(id, {
        status: verdict,
        officerRemarks: remarks,
        verifiedBy: undertaking.verifiedBy,
        verifiedAt: undertaking.verifiedAt,
      });
    }

    await logAuditEvent({
      applicationId: undertaking.applicationId,
      actorName: req.user?.name || 'Regional Officer',
      role: 'RO',
      action: 'UNDERTAKING_VERIFIED',
      fromState: 'Proof Submitted',
      toState: verdict,
      remarks: `Undertaking verification outcome: ${verdict}. Notes: ${remarks}`,
    });

    res.json({
      success: true,
      message: `Undertaking status marked as '${verdict}'.`,
      undertaking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Document Validity Radar: Evaluates validity & days remaining across all certificates
 * Supports role, region, and institution-specific filtering
 */
export const getDocumentRadar = async (req, res) => {
  try {
    const { applicationId, role, region, institutionName } = req.query;
    let docs = [];

    if (getDBStatus()) {
      const q = {};
      if (applicationId) q.applicationId = applicationId;
      if (region && region !== 'All') q.region = region;
      if (institutionName) q.institutionName = new RegExp(institutionName, 'i');
      docs = await DocumentRecord.find(q);
    } else {
      docs = [...memoryStore.documents];
      if (applicationId) docs = docs.filter((d) => d.applicationId === applicationId);
      if (region && region !== 'All') docs = docs.filter((d) => d.region === region);
      if (institutionName) {
        docs = docs.filter((d) =>
          d.institutionName?.toLowerCase().includes(institutionName.toLowerCase())
        );
      }
    }

    // Role-based scoping if not explicitly queried
    if (role === 'college' && !applicationId && !institutionName) {
      // College only tracks its own institution dockets
      docs = docs.filter(
        (d) =>
          d.applicationId === 'AICTE-2026-C-1042' ||
          d.institutionName?.includes('Apex Institute of Technology')
      );
    } else if (role === 'evc' && !applicationId) {
      // EVC tracks the scheduled inspection institute
      docs = docs.filter(
        (d) =>
          d.applicationId === 'AICTE-2026-N-0891' ||
          d.institutionName?.includes('Delhi Engineering & Technology')
      );
    }

    // Run watchdog analysis on every document
    const analyzedDocs = docs.map((doc) => {
      const evalResult = evaluateDocumentValidity(doc.expiryDate);
      return {
        ...(doc.toObject ? doc.toObject() : doc),
        validityStatus: evalResult.validityStatus,
        daysUntilExpiry: evalResult.daysUntilExpiry,
        badgeColor: evalResult.badgeColor,
        urgency: evalResult.urgency,
      };
    });

    const summary = {
      total: analyzedDocs.length,
      valid: analyzedDocs.filter((d) => d.validityStatus === 'Valid').length,
      expiringSoon: analyzedDocs.filter((d) => d.validityStatus === 'Expiring Soon').length,
      expired: analyzedDocs.filter((d) => d.validityStatus === 'Expired').length,
      pendingClearance: analyzedDocs.filter((d) => d.renewalSubmitted).length,
      verifiedOnsiteCount: analyzedDocs.filter((d) => d.verifiedOnsite).length,
    };

    res.json({ success: true, summary, documents: analyzedDocs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * RO Action: Verify & Clear Submitted Renewal Receipt
 */
export const verifyDocumentRenewal = async (req, res) => {
  try {
    const { id } = req.params;
    const { verdict = 'Approved', notes = '' } = req.body;

    let doc = memoryStore.documents.find((d) => d._id?.toString() === id || d.id === id);
    if (!doc && getDBStatus()) {
      doc = await DocumentRecord.findById(id);
    }

    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document record not found' });
    }

    doc.renewalSubmitted = false;
    doc.validityStatus = 'Valid';
    doc.daysUntilExpiry = 365;
    doc.expiryDate = new Date(Date.now() + 365 * 86400000);
    doc.renewalVerifiedBy = req.user?.name || 'Regional Scrutiny Officer';
    doc.renewalVerifiedAt = new Date();

    if (getDBStatus()) {
      await DocumentRecord.findByIdAndUpdate(id, doc);
    }

    await logAuditEvent({
      applicationId: doc.applicationId,
      actorName: req.user?.name || 'Regional Officer',
      role: 'RO',
      action: 'RENEWAL_VERIFIED_AND_CLEARED',
      fromState: 'Renewal In Review',
      toState: 'Statutory Valid',
      remarks: `RO cleared renewed certificate for ${doc.docType} (${doc.institutionName}). ${notes || 'Complies with APH Clause 4.6.'}`,
    });

    res.json({
      success: true,
      message: `Renewal cleared! ${doc.docType} marked Statutory Valid for 1 Year.`,
      document: doc,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * EVC Action: Stamp Physical Certificate Verified On-Site
 */
export const verifyOnsiteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { verified = true, notes = '' } = req.body;

    let doc = memoryStore.documents.find((d) => d._id?.toString() === id || d.id === id);
    if (!doc && getDBStatus()) {
      doc = await DocumentRecord.findById(id);
    }

    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document record not found' });
    }

    doc.verifiedOnsite = verified;
    doc.onsiteVerifiedBy = req.user?.name || 'EVC Committee Member';
    doc.onsiteVerifiedAt = new Date();
    doc.onsiteNotes = notes || 'Original physical deed inspected and stamped inside geofence perimeter.';

    if (getDBStatus()) {
      await DocumentRecord.findByIdAndUpdate(id, doc);
    }

    await logAuditEvent({
      applicationId: doc.applicationId,
      actorName: req.user?.name || 'Prof. S. N. Deshmukh (EVC Chair)',
      role: 'EVC',
      action: verified ? 'PHYSICAL_DEED_VERIFIED_ONSITE' : 'PHYSICAL_DEED_REJECTED',
      remarks: `EVC On-site Inspection: Original deed verified for ${doc.docType}. Notes: ${notes || 'Original physical seal authenticated.'}`,
    });

    res.json({
      success: true,
      message: verified
        ? `Physical Original of ${doc.docType} verified on-site by EVC!`
        : `Physical verification flagged for ${doc.docType}.`,
      document: doc,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * RO/HQ Action: Issue Statutory Show-Cause Notice under APH Clause 4.6
 */
export const issueShowCauseNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason = 'Failure to maintain statutory validity under APH 2024-27 Clause 4.6' } = req.body;

    let doc = memoryStore.documents.find((d) => d._id?.toString() === id || d.id === id);
    if (!doc && getDBStatus()) {
      doc = await DocumentRecord.findById(id);
    }

    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document record not found' });
    }

    doc.showCauseIssued = true;
    doc.showCauseReason = reason;
    doc.showCauseIssuedAt = new Date();

    const noticeAlert = {
      channel: 'Email',
      timestamp: new Date(),
      recipient: doc.institutionName,
      message: `STATUTORY SHOW-CAUSE NOTICE: Non-compliance regarding ${doc.docType}. Respond within 72 hours. Reason: ${reason}`,
    };

    doc.alertsDispatched = doc.alertsDispatched || [];
    doc.alertsDispatched.unshift(noticeAlert);

    if (getDBStatus()) {
      await DocumentRecord.findByIdAndUpdate(id, doc);
    }

    await logAuditEvent({
      applicationId: doc.applicationId,
      actorName: req.user?.name || 'Regional Officer',
      role: req.user?.role?.toUpperCase() || 'RO',
      action: 'STATUTORY_SHOW_CAUSE_ISSUED',
      remarks: `Official Show-Cause issued to ${doc.institutionName} for ${doc.docType}. Clause 4.6. Reason: ${reason}`,
    });

    res.json({
      success: true,
      message: `Statutory Show-Cause Notice issued to ${doc.institutionName} for ${doc.docType}.`,
      document: doc,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DIFFERENTIATOR 5: Multi-Channel Alert Dispatcher
 * Simulates immediate WhatsApp, Email, and In-App alert delivery to institute heads.
 */
export const dispatchAlert = async (req, res) => {
  try {
    const { documentId, customMessage } = req.body;

    let doc = memoryStore.documents.find((d) => d._id?.toString() === documentId);
    if (!doc && getDBStatus()) {
      doc = await DocumentRecord.findById(documentId);
    }

    const institutionName = doc?.institutionName || 'Apex Institute of Technology';
    const docType = doc?.docType || 'Statutory Land Lease Deed';
    const daysUntilExpiry = doc ? evaluateDocumentValidity(doc.expiryDate).daysUntilExpiry : 45;

    const generatedAlerts = generateSimulatedAlert(institutionName, docType, daysUntilExpiry);

    if (customMessage) {
      generatedAlerts.forEach((a) => (a.message = `${customMessage} - [Ref: ${docType}]`));
    }

    if (doc) {
      doc.alertsDispatched = doc.alertsDispatched || [];
      doc.alertsDispatched.push(...generatedAlerts);
      if (getDBStatus()) {
        await DocumentRecord.findByIdAndUpdate(documentId, {
          $push: { alertsDispatched: { $each: generatedAlerts } },
        });
      }
    }

    await logAuditEvent({
      applicationId: doc?.applicationId || 'SYSTEM',
      actorName: req.user?.name || 'Automated Compliance Watchdog',
      role: 'HQ Super-Admin',
      action: 'MULTI_CHANNEL_ALERTS_DISPATCHED',
      remarks: `Simulated 3-channel alert delivery (WhatsApp, Email, In-App) for ${docType} to ${institutionName}`,
    });

    res.json({
      success: true,
      message: 'Multi-channel compliance alert dispatched to College Principal and Management.',
      dispatchedAlerts: generatedAlerts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const renewDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { newExpiryDate, certificateNumber, notes } = req.body;

    let doc = memoryStore.documents.find((d) => d._id?.toString() === id);
    if (!doc && getDBStatus()) {
      doc = await DocumentRecord.findById(id);
    }

    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document record not found' });
    }

    let fileUrl = doc.fileUrl;
    if (req.file) {
      const uploadRes = await uploadToCloudinary(
        req.file.buffer,
        'aicte_pravah/renewals',
        `renewal_${id}`,
        req.file.mimetype
      );
      fileUrl = uploadRes.secure_url;
    }

    doc.issueDate = new Date();
    doc.expiryDate = new Date(newExpiryDate || Date.now() + 365 * 86400000);
    doc.validityStatus = 'Valid';
    doc.certificateNumber = certificateNumber || doc.certificateNumber;
    doc.renewalSubmitted = true;
    doc.renewalSubmissionNotes = notes || 'Renewed document uploaded';
    doc.fileUrl = fileUrl;

    if (getDBStatus()) {
      await DocumentRecord.findByIdAndUpdate(id, doc);
    }

    await logAuditEvent({
      applicationId: doc.applicationId,
      actorName: req.user?.name || 'College Registrar',
      role: 'College',
      action: 'DOCUMENT_RENEWED',
      fromState: 'Expiring Soon / Expired',
      toState: 'Valid',
      remarks: `Renewed certificate uploaded for ${doc.docType}. New validity till ${new Date(
        doc.expiryDate
      ).toLocaleDateString('en-IN')}`,
    });

    res.json({
      success: true,
      message: `Document ${doc.docType} successfully updated with new statutory validity.`,
      document: doc,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
