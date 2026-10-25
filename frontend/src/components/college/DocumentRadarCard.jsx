import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Bell,
  Upload,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  Building,
  Scale,
  MapPin,
  Clock,
  Send,
  Eye,
} from 'lucide-react';
import { complianceAPI } from '../../services/api';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const DocumentRadarCard = ({ document, onRenewed, onOpenAlertModal }) => {
  const { showToast } = useApp();
  const { activeRole } = useAuth();
  const [renewModalOpen, setRenewModalOpen] = useState(false);
  const [showCauseModalOpen, setShowCauseModalOpen] = useState(false);
  const [showCauseReason, setShowCauseReason] = useState(
    'Notice: Statutory certificate has expired or is nearing expiration without approved renewal under APH 2024-27 Clause 4.6.'
  );
  const [newExpiry, setNewExpiry] = useState('');
  const [certNum, setCertNum] = useState('');
  const [renewing, setRenewing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const {
    _id,
    applicationId,
    institutionName,
    region,
    docType,
    certificateNumber,
    issuingAuthority,
    expiryDate,
    validityStatus,
    daysUntilExpiry,
    renewalSubmitted,
    renewalSubmissionNotes,
    verifiedOnsite,
    showCauseIssued,
    fileUrl,
  } = document;

  const handleRenewSubmit = async (e) => {
    e.preventDefault();
    if (!newExpiry) {
      showToast('Please select the new certificate expiry date', 'warning');
      return;
    }

    try {
      setRenewing(true);
      const formData = new FormData();
      formData.append('newExpiryDate', newExpiry);
      formData.append('certificateNumber', certNum || certificateNumber);
      formData.append('notes', 'Renewed statutory certificate uploaded via college portal');

      const res = await complianceAPI.renewDocument(_id || document.id, formData);
      if (res.data?.success) {
        showToast(`Document ${docType} successfully updated with new validity!`, 'success');
        setRenewModalOpen(false);
        if (onRenewed) onRenewed();
      }
    } catch (err) {
      showToast(err.message || 'Renewal failed', 'error');
    } finally {
      setRenewing(false);
    }
  };

  // RO Action: Verify & Clear Submitted Renewal
  const handleVerifyRenewal = async () => {
    try {
      setActionLoading(true);
      const res = await complianceAPI.verifyRenewal(_id || document.id, {
        verdict: 'Approved',
        notes: 'Statutory validity verified against regulatory issuer records.',
      });
      if (res.data?.success) {
        showToast(`Cleared! ${docType} renewed for 1 full year.`, 'success');
        if (onRenewed) onRenewed();
      }
    } catch (err) {
      showToast(err.message || 'Failed to verify renewal', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // EVC Action: Verify Original Deed On-Site
  const handleVerifyOnsite = async () => {
    try {
      setActionLoading(true);
      const res = await complianceAPI.verifyOnsite(_id || document.id, {
        verified: !verifiedOnsite,
        notes: 'Original physical certificate and seal inspected on-site by EVC team.',
      });
      if (res.data?.success) {
        showToast(
          !verifiedOnsite
            ? `Physical Original of ${docType} marked Verified On-Site!`
            : `Physical verification reset for ${docType}.`,
          'success'
        );
        if (onRenewed) onRenewed();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update physical verification', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // RO/HQ Action: Issue Show-Cause Notice
  const handleIssueShowCause = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const res = await complianceAPI.issueShowCause(_id || document.id, {
        reason: showCauseReason,
      });
      if (res.data?.success) {
        showToast(`Statutory Show-Cause Notice dispatched to ${institutionName}!`, 'success');
        setShowCauseModalOpen(false);
        if (onRenewed) onRenewed();
      }
    } catch (err) {
      showToast(err.message || 'Failed to issue show-cause notice', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const getBorderColor = () => {
    if (daysUntilExpiry <= 0) return 'border-rose-300/80 bg-white ring-1 ring-rose-500/10';
    if (daysUntilExpiry <= 60) return 'border-amber-300/80 bg-white ring-1 ring-amber-500/10';
    return 'border-slate-200/90 bg-white';
  };

  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm transition hover:shadow-md flex flex-col justify-between h-full ${getBorderColor()}`}
    >
      <div className="flex-1 flex flex-col">
        {/* If Officer / EVC / HQ View: Show College Name & Regional Jurisdiction prominently */}
        {activeRole !== 'college' && (
          <div className="mb-3 pb-2.5 border-b border-slate-100 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-slate-700 truncate block font-display" title={institutionName}>
                {institutionName}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold truncate block">
                Ref: {applicationId}
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
              {region || 'Central'}
            </span>
          </div>
        )}

        {/* Card Header */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                daysUntilExpiry <= 0
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : daysUntilExpiry <= 60
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}
            >
              <FileText className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-slate-900 truncate font-display" title={docType}>
                {docType}
              </h4>
              <p className="text-xs text-slate-500 font-semibold mt-0.5 truncate">
                {certificateNumber || 'CERT-STAMPED-2024'}
              </p>
            </div>
          </div>

          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full border shrink-0 ${
              daysUntilExpiry <= 0
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : daysUntilExpiry <= 60
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}
          >
            {daysUntilExpiry <= 0 ? 'Expired' : `${daysUntilExpiry}d Left`}
          </span>
        </div>

        {/* Details Box */}
        <div className="text-xs sm:text-sm space-y-1.5 text-slate-600 mb-3 bg-slate-50/80 p-3 rounded-xl border border-slate-200/80">
          <div className="flex justify-between items-center gap-2">
            <span className="text-slate-500 shrink-0">Issuing Authority:</span>
            <span
              className="font-semibold text-slate-800 truncate text-right max-w-[170px]"
              title={issuingAuthority}
            >
              {issuingAuthority}
            </span>
          </div>
          <div className="flex justify-between items-center gap-2">
            <span className="text-slate-500 shrink-0">Statutory Expiry:</span>
            <span className="font-bold text-slate-800 tabular-nums">
              {new Date(expiryDate).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Conditional Status Badges */}
        {renewalSubmitted && (
          <div className="mb-2 text-xs font-semibold text-teal-800 bg-teal-50 px-2.5 py-1.5 rounded-xl border border-teal-200 flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span className="truncate">
                {activeRole === 'ro'
                  ? 'Renewal receipt uploaded • Ready for RO clearance'
                  : 'Renewal receipt submitted • In review'}
              </span>
            </div>
          </div>
        )}

        {showCauseIssued && (
          <div className="mb-2 text-xs font-semibold text-rose-800 bg-rose-50 px-2.5 py-1.5 rounded-xl border border-rose-200 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span className="truncate">Statutory Show-Cause Notice Dispatched</span>
          </div>
        )}

        {verifiedOnsite && (
          <div className="mb-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">Physical Original Verified On-Site by EVC</span>
          </div>
        )}
      </div>

      {/* Action Buttons: Dynamically Tailored by Role */}
      <div className="flex items-center gap-2 pt-3 border-t border-slate-100 mt-auto">
        {/* ROLE: COLLEGE USER */}
        {activeRole === 'college' && (
          <>
            <button
              type="button"
              onClick={() => setRenewModalOpen(true)}
              className="h-9 flex-1 text-xs font-bold px-3 bg-[#0c2340] hover:bg-[#163a66] text-white rounded-xl flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span className="truncate">Upload Renewal</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenAlertModal(document)}
              title="Request officer guidance or trigger self-audit alert"
              className="h-9 w-9 shrink-0 flex items-center justify-center text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition shadow-xs cursor-pointer"
            >
              <Bell className="w-4 h-4 text-amber-600" />
            </button>
          </>
        )}

        {/* ROLE: REGIONAL OFFICER (RO) */}
        {activeRole === 'ro' && (
          <>
            {renewalSubmitted ? (
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleVerifyRenewal}
                className="h-9 flex-1 text-xs font-bold px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                <span className="truncate">{actionLoading ? 'Clearing...' : 'Verify & Clear'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowCauseModalOpen(true)}
                className={`h-9 flex-1 text-xs font-bold px-3 text-white rounded-xl flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer ${
                  daysUntilExpiry <= 0
                    ? 'bg-rose-700 hover:bg-rose-800'
                    : 'bg-[#0c2340] hover:bg-[#163a66]'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span className="truncate">
                  {daysUntilExpiry <= 0 ? 'Issue Show-Cause' : 'Dispatch Notice'}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onOpenAlertModal(document)}
              title="Dispatch multi-channel WhatsApp / Email compliance notice to Principal"
              className="h-9 w-9 shrink-0 flex items-center justify-center text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition shadow-xs cursor-pointer"
            >
              <Bell className="w-4 h-4 text-amber-600" />
            </button>
          </>
        )}

        {/* ROLE: EVC INSPECTION CHAIR */}
        {activeRole === 'evc' && (
          <>
            <button
              type="button"
              disabled={actionLoading}
              onClick={handleVerifyOnsite}
              className={`h-9 flex-1 text-xs font-bold px-3 text-white rounded-xl flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer ${
                verifiedOnsite
                  ? 'bg-emerald-700 hover:bg-emerald-800'
                  : 'bg-[#0c2340] hover:bg-[#163a66]'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              <span className="truncate">
                {verifiedOnsite ? 'Original Verified ✓' : 'Verify Physical'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setShowCauseModalOpen(true)}
              title="Flag deed discrepancy found during on-site visit"
              className="h-9 w-9 shrink-0 flex items-center justify-center text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition shadow-xs cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </button>
          </>
        )}

        {/* ROLE: HQ SUPER-ADMIN */}
        {activeRole === 'hq' && (
          <>
            <button
              type="button"
              onClick={() => setShowCauseModalOpen(true)}
              className="h-9 flex-1 text-xs font-bold px-3 bg-[#0c2340] hover:bg-[#163a66] text-white rounded-xl flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span className="truncate">Council Directive</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenAlertModal(document)}
              title="Dispatch National Secretariat compliance warning"
              className="h-9 w-9 shrink-0 flex items-center justify-center text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition shadow-xs cursor-pointer"
            >
              <Bell className="w-4 h-4 text-amber-600" />
            </button>
          </>
        )}

        {/* 3rd Slot: Always Document Viewer (Active or Inactive Placeholder) */}
        {fileUrl ? (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Inspect Official Stamped PDF"
            className="h-9 w-9 shrink-0 flex items-center justify-center text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition border border-slate-200/90 shadow-xs cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        ) : (
          <span
            title="No certificate document attached"
            className="h-9 w-9 shrink-0 flex items-center justify-center text-slate-300 bg-slate-50 rounded-xl border border-slate-100 cursor-not-allowed opacity-60"
          >
            <ExternalLink className="w-4 h-4" />
          </span>
        )}
      </div>

      {/* College Renewal Modal */}
      {renewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <h3 className="text-sm font-bold text-[#0c2340] mb-1 font-display">
              Upload Renewed Certificate
            </h3>
            <p className="text-xs text-slate-500 mb-4">{docType}</p>

            <form onSubmit={handleRenewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Certificate Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. NOC-IND-2026-9901"
                  value={certNum}
                  onChange={(e) => setCertNum(e.target.value)}
                  className="w-full text-xs p-2.5 border rounded-xl border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ea580c]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Statutory Expiry Date *
                </label>
                <input
                  type="date"
                  required
                  value={newExpiry}
                  onChange={(e) => setNewExpiry(e.target.value)}
                  className="w-full text-xs p-2.5 border rounded-xl border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ea580c]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Upload Signed & Stamped PDF
                </label>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-[#ea580c] hover:file:bg-orange-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRenewModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={renewing}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#ea580c] hover:bg-[#c2410c] rounded-xl shadow-xs transition cursor-pointer"
                >
                  {renewing ? 'Saving...' : 'Confirm Renewal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RO / HQ Statutory Show-Cause Modal */}
      {showCauseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2 mb-2 text-rose-700">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="text-sm font-bold font-display">
                Issue Statutory Notice (APH Clause 4.6)
              </h3>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              Dispatches an official regulatory show-cause notice to <strong>{institutionName}</strong> regarding statutory deficiency in <strong>{docType}</strong>.
            </p>

            <form onSubmit={handleIssueShowCause} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Statutory Non-Compliance Ground
                </label>
                <textarea
                  rows={4}
                  required
                  value={showCauseReason}
                  onChange={(e) => setShowCauseReason(e.target.value)}
                  className="w-full text-xs p-3 border rounded-xl border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-700"
                />
              </div>

              <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-[11px] text-amber-800">
                Notice will automatically freeze the institution's EoA approval pipeline until clearance receipt is uploaded.
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCauseModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{actionLoading ? 'Dispatching...' : 'Dispatch Statutory Notice'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentRadarCard;
