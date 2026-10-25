import React, { useState, useEffect } from 'react';
import {
  FileText,
  Building2,
  Clock,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Flame,
  Printer,
  Bell,
  ArrowLeft,
  Camera,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { applicationAPI } from '../services/api';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/common/StatusBadge';
import SLATimerBadge from '../components/common/SLATimerBadge';
import WorkflowStepper from '../components/college/WorkflowStepper';
import AuditTrailTimeline from '../components/common/AuditTrailTimeline';
import GhostFacultyRadar from '../components/common/GhostFacultyRadar';

export const ApplicationDetailPage = ({ applicationId, onBack }) => {
  const { showToast, openModal, refreshKey, navigateTo } = useApp();
  const { activeRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [appData, setAppData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'docs', 'evc', 'undertakings', 'audit'
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    fetchApplicationDetails();
  }, [applicationId, refreshKey]);

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      const res = await applicationAPI.getById(applicationId || 'AICTE-2026-C-1042');
      if (res.data?.success) {
        setAppData(res.data);
      }
    } catch (err) {
      showToast(err.message || 'Error loading application', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateBreach = async () => {
    try {
      setSimulating(true);
      const res = await applicationAPI.simulateSlaBreach(applicationId, 10);
      if (res.data?.success) {
        showToast(
          '⚡ DEMO DIFFERENTIATOR: Artificial time-warp applied (+10 days). SLA breached and escalated to Level 2 HQ!',
          'warning'
        );
        fetchApplicationDetails();
      }
    } catch (err) {
      showToast(err.message || 'Error simulating SLA breach', 'error');
    } finally {
      setSimulating(false);
    }
  };

  if (loading || !appData?.application) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs">
        Loading 360° application records...
      </div>
    );
  }

  const { application, documents = [], inspection, undertakings = [], auditHistory = [] } = appData;

  return (
    <div className="space-y-6">
      {/* Top Bar with Back Button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Portal
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {/* Universal Official Docket View */}
          <button
            onClick={() => openModal('docket', application)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Generate Council Docket</span>
          </button>

          {/* Role-Specific Action Buttons */}
          {activeRole === 'college' && (
            <button
              onClick={() => setActiveTab('undertakings')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Compliance Undertakings</span>
            </button>
          )}

          {activeRole === 'evc' && (
            <button
              onClick={() => setActiveTab('evc')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-50 hover:bg-teal-100 border border-teal-300 text-teal-800 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Inspection Geo-Evidence</span>
            </button>
          )}

          {(activeRole === 'hq' || activeRole === 'ro') && (
            <button
              onClick={handleSimulateBreach}
              disabled={simulating}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-800 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5 text-rose-600" />
              <span>Simulate SLA Breach (+10d)</span>
            </button>
          )}
        </div>
      </div>

      {/* Header Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-bold text-[#ea580c] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                {application.applicationId}
              </span>
              <StatusBadge status={application.status} />
              <SLATimerBadge sla={application.sla} />
            </div>
            <h1 className="text-xl font-extrabold text-[#0c2340]">
              {application.institutionName}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {application.applicationType} • Academic Year {application.academicYear} •{' '}
              {application.region} Regional Jurisdiction
            </p>
          </div>

          <div className="text-right text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Scrutiny Desk</span>
            <span className="font-bold text-slate-800">{application.assignedRO || 'Regional Officer'}</span>
          </div>
        </div>

        {/* Live Stepper */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <WorkflowStepper
            currentStage={application.stage}
            status={application.status}
            sla={application.sla}
          />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border border-slate-200/90 gap-1 bg-slate-100/90 p-1.5 rounded-2xl shadow-inner overflow-x-auto">
        {[
          { id: 'overview', label: '1. Campus & Courses' },
          { id: 'faculty', label: '2. Faculty & Ghost Radar' },
          { id: 'docs', label: `3. Statutory Docs (${documents.length})` },
          { id: 'evc', label: '4. EVC Inspection & Geo Evidence' },
          { id: 'undertakings', label: `5. Undertakings (${undertakings.length})` },
          { id: 'audit', label: `6. Audit Ledger (${auditHistory.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white text-[#0c2340] shadow-sm border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Campus & Courses Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Infrastructure Metrics Ribbon */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Campus Infrastructure Parameters
            </h3>
            <div className="bg-slate-50/70 rounded-xl border border-slate-200/80 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80 grid grid-cols-2 sm:grid-cols-4 overflow-hidden">
              <div className="p-4">
                <span className="text-slate-500 block text-[11px] font-medium">Land Area</span>
                <span className="text-base sm:text-lg font-bold text-[#0c2340] font-display">
                  {application.infrastructureDetails?.landAreaAcres} Acres
                </span>
              </div>
              <div className="p-4">
                <span className="text-slate-500 block text-[11px] font-medium">Built-Up Area</span>
                <span className="text-base sm:text-lg font-bold text-[#0c2340] font-display">
                  {application.infrastructureDetails?.builtUpAreaSqMtr} Sq.Mtr
                </span>
              </div>
              <div className="p-4">
                <span className="text-slate-500 block text-[11px] font-medium">Classrooms</span>
                <span className="text-base sm:text-lg font-bold text-[#0c2340] font-display tabular-nums">
                  {application.infrastructureDetails?.totalClassrooms}
                </span>
              </div>
              <div className="p-4">
                <span className="text-slate-500 block text-[11px] font-medium">High-Tech Labs</span>
                <span className="text-base sm:text-lg font-bold text-[#0c2340] font-display tabular-nums">
                  {application.infrastructureDetails?.totalLabs}
                </span>
              </div>
            </div>
          </div>

          {/* Courses Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Enrolled Technical Programs & Approved Intakes
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Program</th>
                    <th className="py-2.5 px-3">Specialization</th>
                    <th className="py-2.5 px-3">Level</th>
                    <th className="py-2.5 px-3 text-right">Approved Intake</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {application.courses?.map((c, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-slate-900">{c.courseName}</td>
                      <td className="py-2.5 px-3 text-slate-700">{c.branch}</td>
                      <td className="py-2.5 px-3 text-slate-600">{c.level}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-[#0c2340]">
                        {c.approvedIntake || c.proposedIntake}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Faculty & Ghost Radar */}
      {activeTab === 'faculty' && (
        <GhostFacultyRadar
          applicationId={application.applicationId}
          onDeficiencyRaised={fetchApplicationDetails}
        />
      )}

      {/* Tab 3: Statutory Documents */}
      {activeTab === 'docs' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{doc.docType}</h4>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Ref: {doc.certificateNumber || 'CERT-STAMPED'}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Authority: {doc.issuingAuthority}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      doc.validityStatus === 'Expired'
                        ? 'bg-rose-100 text-rose-800'
                        : doc.validityStatus === 'Expiring Soon'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {doc.validityStatus}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Expires: {new Date(doc.expiryDate).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: EVC Inspection & Geo Evidence */}
      {activeTab === 'evc' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                EVC On-Site Physical Inspection Audit
              </h3>
              <p className="text-xs text-slate-500">
                Inspection Verdict: <strong className="text-[#0c2340]">{inspection?.verdict || 'Pending Review'}</strong>
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Geofence Verified: {inspection?.distanceMeters || 28}m Distance
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {inspection?.photoEvidence?.map((p, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                <img src={p.url} alt={p.tag} className="w-full h-32 object-cover" />
                <div className="p-2 text-xs">
                  <p className="font-bold text-slate-800">{p.tag}</p>
                  <p className="text-[10px] text-slate-500">{p.notes}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Undertakings */}
      {activeTab === 'undertakings' && (
        <div className="space-y-3">
          {undertakings.map((u, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">{u.title}</h4>
                <p className="text-xs text-slate-600 mt-1">{u.description}</p>
                <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                  Ref: {u.clauseReference} • Due: {new Date(u.dueDate).toLocaleDateString('en-IN')}
                </span>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                {u.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: Audit Ledger */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <AuditTrailTimeline logs={auditHistory} />
        </div>
      )}
    </div>
  );
};

export default ApplicationDetailPage;
