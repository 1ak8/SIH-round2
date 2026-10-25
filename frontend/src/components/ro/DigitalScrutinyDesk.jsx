import React, { useState } from 'react';
import {
  X,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Building2,
  ExternalLink,
  Send,
  RotateCcw,
  Check,
  Clock,
  Layers,
} from 'lucide-react';
import { scrutinyAPI } from '../../services/api';
import { useApp } from '../../context/AppContext';
import SLATimerBadge from '../common/SLATimerBadge';
import GhostFacultyRadar from '../common/GhostFacultyRadar';

export const DigitalScrutinyDesk = ({ application, onClose, onActionCompleted }) => {
  const { showToast, triggerRefresh } = useApp();
  const [activeTab, setActiveTab] = useState('docs'); // 'docs', 'photos', 'deficiencies'
  const [raisingDeficiency, setRaisingDeficiency] = useState(false);
  const [defField, setDefField] = useState('Land Title & Lease Deed');
  const [defClause, setDefClause] = useState('Clause 1.4 (Land Contiguity)');
  const [defDesc, setDefDesc] = useState('');
  const [processing, setProcessing] = useState(false);

  // APH Checklist State
  const [checklist, setChecklist] = useState([
    { id: 1, title: 'Land Ownership / Registered Lease Deed (>30 Years)', checked: true, clause: 'APH 1.2' },
    { id: 2, title: 'Building Structural Stability Certificate by Competent PWD Engineer', checked: true, clause: 'APH 1.5' },
    { id: 3, title: 'Fire Safety NOC issued by Municipal Fire Directorate', checked: false, clause: 'APH 1.8' },
    { id: 4, title: 'Cadre Ratio (1:20 Faculty to Student & Professor/Assoc/Asst ratio)', checked: false, clause: 'APH 4.2' },
    { id: 5, title: 'Barrier-Free Access, Ramps and Lifts for Divyangjan Students', checked: true, clause: 'APH 2.6' },
  ]);

  const toggleCheck = (id) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handlePassToEVC = async () => {
    try {
      setProcessing(true);
      const res = await scrutinyAPI.passToEVC(application.applicationId, {
        assignedChairperson: 'Prof. S. N. Deshmukh (NIT Nominee)',
        remarks: 'Scrutiny verified against APH 2024-27 norms. Forwarded to EVC committee for physical audit.',
      });

      if (res.data?.success) {
        showToast(
          `Application ${application.applicationId} passed scrutiny! Assigned to EVC Committee.`,
          'success'
        );
        triggerRefresh();
        if (onActionCompleted) onActionCompleted();
        onClose();
      }
    } catch (err) {
      showToast(err.message || 'Failed to pass to EVC', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const handleRaiseDeficiency = async (e) => {
    e.preventDefault();
    if (!defDesc.trim()) {
      showToast('Please state the specific deficiency observation.', 'warning');
      return;
    }

    try {
      setProcessing(true);
      const res = await scrutinyAPI.raiseDeficiency(application.applicationId, {
        field: defField,
        aphClause: defClause,
        description: defDesc,
      });

      if (res.data?.success) {
        showToast(
          `Deficiency raised and formal regulatory notice dispatched to ${application.institutionName}`,
          'warning'
        );
        triggerRefresh();
        setRaisingDeficiency(false);
        setDefDesc('');
        if (onActionCompleted) onActionCompleted();
      }
    } catch (err) {
      showToast(err.message || 'Error raising deficiency', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const handleDirectApprove = async () => {
    try {
      setProcessing(true);
      const res = await scrutinyAPI.directApprove(application.applicationId, {
        approvalRemarks: 'Approved directly under APH Clause 3.4 for accredited top-tier institution.',
      });

      if (res.data?.success) {
        showToast('Direct council approval granted!', 'success');
        triggerRefresh();
        if (onActionCompleted) onActionCompleted();
        onClose();
      }
    } catch (err) {
      showToast(err.message || 'Error granting approval', 'error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-3 sm:p-4 overflow-hidden">
      <div className="bg-white rounded-2xl w-full max-w-[96vw] xl:max-w-[95vw] h-[94vh] flex flex-col shadow-2xl border border-slate-300 overflow-hidden">
        {/* Top Scrutiny Desk Toolbar */}
        <div className="bg-[#0c2340] text-white px-6 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-400/40 flex items-center justify-center text-orange-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">{application.applicationId}</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-orange-500 text-white">
                  Dual-Pane Scrutiny Desk
                </span>
                <SLATimerBadge sla={application.sla} />
              </div>
              <p className="text-xs text-slate-300 truncate max-w-md">
                {application.institutionName} • {application.region} Region
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dual-Pane Split Screen */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 overflow-hidden">
          {/* LEFT PANE: College Data, Documents & Photos */}
          <div className="flex flex-col h-full bg-slate-50/60 overflow-y-auto">
            {/* Left Header Tabs */}
            <div className="p-3 bg-white border-b border-slate-200 flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={() => setActiveTab('docs')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === 'docs'
                    ? 'bg-[#0c2340] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Statutory Documents ({application.documents?.length || 3})
              </button>
              <button
                onClick={() => setActiveTab('faculty')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'faculty'
                    ? 'bg-rose-700 text-white'
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                }`}
              >
                <span>Faculty & Ghost Radar</span>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              </button>
              <button
                onClick={() => setActiveTab('photos')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === 'photos'
                    ? 'bg-[#0c2340] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Campus Photos ({application.campusPhotos?.length || 0})
              </button>
            </div>

            {/* Left Body Content */}
            <div className="p-5 space-y-4">
              {/* Infrastructure Summary Strip */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm text-xs">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-xs mb-2 text-[#0c2340]">
                  Land & Facility Snapshot
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-600">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-xs text-slate-500 font-medium block">Land Area</span>
                    <span className="font-bold text-slate-800 text-xs sm:text-[13px]">
                      {application.infrastructureDetails?.landAreaAcres || 6.2} Acres
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-xs text-slate-500 font-medium block">Built-Up</span>
                    <span className="font-bold text-slate-800 text-xs sm:text-[13px]">
                      {application.infrastructureDetails?.builtUpAreaSqMtr || 14200} Sq.Mtr
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-xs text-slate-500 font-medium block">Classrooms</span>
                    <span className="font-bold text-slate-800 text-xs sm:text-[13px]">
                      {application.infrastructureDetails?.totalClassrooms || 36}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-xs text-slate-500 font-medium block">Labs</span>
                    <span className="font-bold text-slate-800 text-xs sm:text-[13px]">
                      {application.infrastructureDetails?.totalLabs || 22}
                    </span>
                  </div>
                </div>
              </div>

              {/* Documents View */}
              {activeTab === 'docs' && (
                <div className="space-y-3">
                  <h4 className="text-xs sm:text-[13px] font-bold text-slate-800">
                    Uploaded Certificates & Deeds for Verification
                  </h4>

                  {[
                    {
                      docType: 'Land Lease Deed (30-Year Registered)',
                      authority: 'Sub-Registrar Office, Bhopal',
                      validity: 'Valid (45d remaining in cycle)',
                      isExpiring: true,
                    },
                    {
                      docType: 'Fire Safety NOC',
                      authority: 'Chief Fire Directorate',
                      validity: 'Valid till 2027',
                      isExpiring: false,
                    },
                    {
                      docType: 'Building Structural Stability',
                      authority: 'Executive Engineer PWD',
                      validity: 'Valid till 2028',
                      isExpiring: false,
                    },
                  ].map((doc, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-orange-50 text-[#ea580c]">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-[13px] font-bold text-slate-800">{doc.docType}</p>
                          <p className="text-xs text-slate-500 font-medium">{doc.authority}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                            doc.isExpiring
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {doc.validity}
                        </span>
                        <a
                          href="https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=1000&q=80"
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
                          title="Preview full certificate"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Photos View */}
              {activeTab === 'photos' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {application.campusPhotos?.map((p, i) => (
                    <div key={i} className="rounded-xl overflow-hidden border border-slate-200 bg-white">
                      <img src={p.url} alt={p.caption} className="w-full h-32 object-cover" />
                      <p className="p-2 text-xs font-semibold text-slate-700">{p.caption}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Faculty & Ghost Radar View */}
              {activeTab === 'faculty' && (
                <GhostFacultyRadar
                  applicationId={application.applicationId}
                  onDeficiencyRaised={onActionCompleted}
                />
              )}
            </div>
          </div>

          {/* RIGHT PANE: APH Statutory Checklist & Action Controls */}
          <div className="flex flex-col h-full bg-white overflow-y-auto">
            <div className="p-5 flex-1 space-y-5">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0c2340] mb-1">
                  Approval Process Handbook (APH 2024-27) Scrutiny Checklist
                </h4>
                <p className="text-xs text-slate-500">
                  Verify each statutory clause before forwarding file to physical inspection or approval.
                </p>
              </div>

              {/* Checklist items */}
              <div className="space-y-2.5">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                      item.checked
                        ? 'bg-emerald-50/50 border-emerald-300'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border transition ${
                        item.checked
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-400 bg-white'
                      }`}
                    >
                      {item.checked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-800 leading-snug">
                        {item.title}
                      </p>
                      <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded mt-1 inline-block">
                        Clause: {item.clause}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Raise Deficiency Drawer */}
              {raisingDeficiency ? (
                <form
                  onSubmit={handleRaiseDeficiency}
                  className="bg-amber-50 border border-amber-300 rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-[13px] font-bold text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      Raise Scrutiny Objection
                    </span>
                    <button
                      type="button"
                      onClick={() => setRaisingDeficiency(false)}
                      className="text-xs font-medium text-slate-600 hover:text-slate-900"
                    >
                      Cancel
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Deficiency Category:
                    </label>
                    <select
                      value={defField}
                      onChange={(e) => setDefField(e.target.value)}
                      className="w-full text-xs sm:text-[13px] p-2 rounded-lg border border-slate-300 bg-white"
                    >
                      <option>Faculty Cadre Ratio & Ph.D. Shortfall</option>
                      <option>Land Title & Lease Deed Validity</option>
                      <option>Fire Safety NOC Renewal</option>
                      <option>Divyangjan Barrier-Free Access</option>
                      <option>Computer Center / Bandwidth Deficit</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Specific Observation Note for College:
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Specify discrepancy and required rectification document..."
                      value={defDesc}
                      onChange={(e) => setDefDesc(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow"
                  >
                    <Send className="w-3 h-3" />
                    {processing ? 'Dispatching...' : 'Dispatch Deficiency Notice to College'}
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setRaisingDeficiency(true)}
                  className="w-full py-2.5 border-2 border-dashed border-amber-300 text-amber-800 bg-amber-50/50 hover:bg-amber-50 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Raise APH Deficiency / Request Clarification
                </button>
              )}
            </div>

            {/* Bottom Final Decision Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <button
                type="button"
                onClick={handleDirectApprove}
                disabled={processing}
                className="px-3 py-2 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition"
              >
                Direct Approve (APH 3.4)
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handlePassToEVC}
                  disabled={processing}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#0c2340] hover:bg-[#163a66] rounded-lg shadow flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
                  Pass Scrutiny → Proceed to EVC
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalScrutinyDesk;
