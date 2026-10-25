import React, { useState, useEffect } from 'react';
import {
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
  Plus,
  ShieldCheck,
  FileCheck,
  Building2,
  Calendar,
  Camera,
  Upload,
  ExternalLink,
  Flame,
  Bell,
  Users,
} from 'lucide-react';
import { applicationAPI, complianceAPI } from '../../services/api';
import { useApp } from '../../context/AppContext';
import MetricCard from '../common/MetricCard';
import WorkflowStepper from './WorkflowStepper';
import DeficiencyBox from './DeficiencyBox';
import DocumentRadarCard from './DocumentRadarCard';
import UndertakingModal from './UndertakingModal';
import ApplicationWizard from './ApplicationWizard';
import GhostFacultyRadar from '../common/GhostFacultyRadar';

export const CollegeDashboard = () => {
  const { showToast, openModal, refreshKey, navigateTo } = useApp();
  const [loading, setLoading] = useState(true);
  const [activeApp, setActiveApp] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [undertakings, setUndertakings] = useState([]);
  const [showWizard, setShowWizard] = useState(false);
  const [selectedUndertaking, setSelectedUndertaking] = useState(null);
  const [showFacultyModal, setShowFacultyModal] = useState(false);

  useEffect(() => {
    fetchCollegeData();
  }, [refreshKey]);

  const fetchCollegeData = async () => {
    try {
      setLoading(true);
      // Fetch active application for Apex Institute (or default first app)
      const appRes = await applicationAPI.getById('AICTE-2026-C-1042');
      if (appRes.data?.success) {
        setActiveApp(appRes.data.application);
        setDocuments(appRes.data.documents || []);
        setUndertakings(appRes.data.undertakings || []);
      }
    } catch (err) {
      console.warn('Fallback: loading via general applications list');
      try {
        const fallbackRes = await applicationAPI.getAll();
        if (fallbackRes.data?.applications?.length > 0) {
          setActiveApp(fallbackRes.data.applications[0]);
        }
      } catch (e) {
        showToast('Error loading college data', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateBreach = async () => {
    if (!activeApp) return;
    try {
      const res = await applicationAPI.simulateSlaBreach(activeApp.applicationId, 10);
      if (res.data?.success) {
        showToast('⚡ Live Demo: SLA aged by 10 days! Overdue breach triggered.', 'warning');
        setActiveApp(res.data.application);
      }
    } catch (err) {
      showToast(err.message || 'Error simulating SLA breach', 'error');
    }
  };

  const handleOpenAlertModal = (doc) => {
    openModal('alert', doc);
  };

  const handleOpenDocketModal = () => {
    openModal('docket', activeApp);
  };

  if (showWizard) {
    return (
      <ApplicationWizard
        onCreated={(newApp) => {
          setActiveApp(newApp);
          setShowWizard(false);
        }}
        onCancel={() => setShowWizard(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Clean Boxless Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2 text-xs sm:text-[13px] font-medium text-slate-600 mb-1">
            <span className="font-semibold text-slate-800">Institution Portal</span>
            <span className="text-slate-300">/</span>
            <span className="font-mono text-[#ea580c] font-bold">ID: 1-28140921</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600">Central Region (Bhopal)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
            Apex Institute of Technology, Bhopal
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Statutory Approval Tracking, Stage-wise SLA Monitoring & Automatic Lease Validity Radar.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setShowFacultyModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer"
          >
            <Users className="w-4 h-4 text-rose-600" />
            <span>Ghost Faculty Radar</span>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          </button>

          <button
            onClick={handleOpenDocketModal}
            className="flex items-center gap-2 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Approval Docket</span>
          </button>

          <button
            onClick={() => setShowWizard(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>File Application</span>
          </button>
        </div>
      </div>

      {/* KPI Ribbon (Unified Connected Surface) */}
      <div className="relative bg-white rounded-2xl border border-slate-200/90 shadow-sm divide-y sm:divide-y-0 sm:divide-x divide-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 overflow-hidden">
        <MetricCard
          title="Active Application"
          value={activeApp?.applicationId || 'AICTE-2026-C-1042'}
          subtitle={activeApp?.applicationType || 'Extension of Approval'}
          icon={FileText}
          variant="navy"
          badgeText={activeApp?.status || 'Under Scrutiny'}
          statusHint="Official institutional docket"
        />

        <MetricCard
          title="Current Stage SLA"
          value={
            activeApp?.sla?.isOverdue
              ? `${Math.abs(activeApp.sla.daysRemaining)} Days Overdue`
              : `${activeApp?.sla?.daysRemaining || 5} Days Left`
          }
          subtitle={`Allowed SLA: ${activeApp?.sla?.daysAllowed || 7} working days`}
          icon={Clock}
          variant={activeApp?.sla?.isOverdue ? 'danger' : 'success'}
          badgeText={activeApp?.sla?.isOverdue ? 'Overdue' : 'On Schedule'}
          statusHint={activeApp?.sla?.isOverdue ? 'Immediate attention needed' : 'Processing within SLA'}
        />

        <MetricCard
          title="Open Scrutiny Objections"
          value={activeApp?.deficiencies?.filter((d) => d.status === 'Open').length || 0}
          subtitle="Objections raised by Regional Officer"
          icon={AlertTriangle}
          variant={
            activeApp?.deficiencies?.some((d) => d.status === 'Open') ? 'warning' : 'success'
          }
          badgeText={
            activeApp?.deficiencies?.some((d) => d.status === 'Open') ? 'Action Needed' : 'Clean'
          }
          statusHint={
            activeApp?.deficiencies?.some((d) => d.status === 'Open')
              ? 'Upload clarifications below'
              : 'Zero objections found'
          }
        />

        <MetricCard
          title="Expiring Certificates"
          value={documents.filter((d) => d.validityStatus !== 'Valid').length || 1}
          subtitle="Land Lease & Fire NOC radar check"
          icon={ShieldCheck}
          variant="saffron"
          badgeText="Radar Alert"
          onClick={() => navigateTo('radar')}
          statusHint="Compliance watchdog active"
        />
      </div>

      {/* Live Pipeline Stepper */}
      {activeApp && (
        <WorkflowStepper
          currentStage={activeApp.stage}
          status={activeApp.status}
          sla={activeApp.sla}
        />
      )}

      {/* Regional Officer Deficiency Box (If Any Objections Open) */}
      {activeApp && (
        <DeficiencyBox
          applicationId={activeApp.applicationId}
          deficiencies={activeApp.deficiencies || []}
          onResolved={fetchCollegeData}
        />
      )}

      {/* Main Grid: Document Radar + Conditional Undertakings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Statutory Document Validity Radar */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-display">
                Institutional Lease & Document Validity Radar
              </h3>
              <p className="text-xs text-slate-500">
                Proactive tracking of land deeds, fire certificates, and structural stability.
              </p>
            </div>
            <button
              onClick={() => navigateTo('radar')}
              className="text-xs font-semibold text-[#ea580c] hover:underline flex items-center gap-1 font-sans"
            >
              Full Council Radar →
            </button>
          </div>

          {/* Unified Registry List View (Replaces Fragmented Boxes) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {documents.map((doc, idx) => {
                const isExpired = doc.daysUntilExpiry <= 0;
                const isExpiring = doc.daysUntilExpiry <= 60;
                return (
                  <div
                    key={doc._id || idx}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                          isExpired
                            ? 'bg-rose-50 text-rose-600 border-rose-200'
                            : isExpiring
                            ? 'bg-amber-50 text-amber-600 border-amber-200'
                            : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                        }`}
                      >
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 truncate font-display">
                            {doc.docType}
                          </h4>
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                              isExpired
                                ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                                : isExpiring
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isExpired ? 'bg-rose-500' : isExpiring ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                            />
                            {isExpired ? 'Expired' : `${doc.daysUntilExpiry}d Left`}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 font-medium">
                          {doc.issuingAuthority} •{' '}
                          <span className="font-semibold text-slate-600">
                            {doc.certificateNumber || 'CERT-STAMPED-2024'}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end shrink-0">
                      <div className="text-left sm:text-right">
                        <p className="text-xs text-slate-500 font-medium">Valid Until</p>
                        <p className="text-xs sm:text-[13px] font-bold text-slate-800 tabular-nums">
                          {new Date(doc.expiryDate).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>

                      <button
                        onClick={() => navigateTo('radar')}
                        className="px-3.5 py-1.5 bg-[#0c2340] hover:bg-[#163a66] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-orange-400" />
                        <span>Renew Deed</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Post-Approval Conditional Undertakings */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-display">Conditional Undertakings</h3>
              <p className="text-xs text-slate-500">Post-Approval Compliance Hub</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-800 border border-orange-200/80">
              {undertakings.length} Tracked
            </span>
          </div>

          <div className="space-y-3">
            {undertakings.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                No conditional undertakings assigned.
              </p>
            ) : (
              undertakings.map((und) => (
                <div
                  key={und._id || und.id}
                  className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/70 hover:bg-white hover:border-slate-300 transition"
                >
                  <div className="flex items-center justify-between mb-1.5 gap-2">
                    <span className="text-xs font-bold text-[#0c2340] line-clamp-1 font-display">
                      {und.title}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${
                        und.status === 'Proof Submitted'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : und.status === 'Verified & Cleared'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {und.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-2.5 leading-relaxed">{und.description}</p>
                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-200/60 text-[11px]">
                    <span className="text-slate-400 font-mono">
                      Due: {new Date(und.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    {und.status === 'Pending' && (
                      <button
                        onClick={() => setSelectedUndertaking(und)}
                        className="text-xs font-bold text-[#ea580c] hover:underline inline-flex items-center gap-1"
                      >
                        Upload Proof →
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Verified Campus Infrastructure Photo Gallery */}
      {activeApp?.campusPhotos && activeApp.campusPhotos.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#ea580c]" />
                Verified Campus Infrastructure & Facility Photographs
              </h3>
              <p className="text-xs text-slate-500">
                Official high-resolution photographic evidence of classrooms, computing labs, and academic blocks.
              </p>
            </div>
            <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2.5 py-1 rounded-full">
              {activeApp.campusPhotos.length} Verified Photos on Record
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {activeApp.campusPhotos.map((photo, i) => (
              <div
                key={i}
                className="group relative rounded-xl overflow-hidden border border-slate-200 shadow-sm aspect-video bg-slate-100"
              >
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex items-end p-3 text-white">
                  <p className="text-xs font-semibold">{photo.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Undertaking Modal */}
      {selectedUndertaking && (
        <UndertakingModal
          undertaking={selectedUndertaking}
          onClose={() => setSelectedUndertaking(null)}
          onSubmitted={fetchCollegeData}
        />
      )}

      {/* Ghost Faculty & Cadre Radar Modal */}
      {showFacultyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-6xl w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl relative">
            <button
              onClick={() => setShowFacultyModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition font-bold text-sm"
              title="Close"
            >
              ✕
            </button>
            <GhostFacultyRadar
              applicationId={activeApp?.applicationId}
              onDeficiencyRaised={fetchCollegeData}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeDashboard;
