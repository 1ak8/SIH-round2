import React, { useState } from 'react';
import {
  ShieldAlert,
  UserCheck,
  AlertOctagon,
  Clock,
  ArrowRight,
  Send,
  Building2,
  CheckCircle,
} from 'lucide-react';
import { adminAPI } from '../../services/api';
import { useApp } from '../../context/AppContext';

export const EscalationMatrixTable = ({ breachedApplications = [], onReassigned }) => {
  const { showToast, triggerRefresh } = useApp();
  const [reassigningId, setReassigningId] = useState(null);
  const [newOfficer, setNewOfficer] = useState('Dr. V. K. Bansal (Bureau Director)');
  const [reassignReason, setReassignReason] = useState('Stalled scrutiny exceeding statutory SLA limit');
  const [processing, setProcessing] = useState(false);

  const handleReassign = async (appId) => {
    try {
      setProcessing(true);
      const res = await adminAPI.reassignOfficer(appId, {
        newOfficerName: newOfficer,
        notes: reassignReason,
      });

      if (res.data?.success) {
        showToast(
          `Application ${appId} successfully re-assigned to ${newOfficer}!`,
          'success'
        );
        triggerRefresh();
        setReassigningId(null);
        if (onReassigned) onReassigned();
      }
    } catch (err) {
      showToast(err.message || 'Re-assignment failed', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const handleDispatchShowCause = (appId, collegeName) => {
    showToast(
      `Central Statutory Show-Cause notice dispatched to Regional Desk & ${collegeName}!`,
      'warning'
    );
  };

  if (breachedApplications.length === 0) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center text-emerald-800">
        <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
        <h4 className="font-bold text-sm">Zero Pan-India SLA Breaches</h4>
        <p className="text-xs text-emerald-600 mt-1">
          All regional offices are operating within Approval Process Handbook statutory timelines.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-rose-200/90 shadow-xs overflow-hidden">
      {/* Table Header Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-rose-900 to-[#0c2340] text-white p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0">
            <ShieldAlert className="w-5 h-5 text-rose-300 animate-pulse" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base tracking-tight font-sans">
                Central AICTE SLA Escalation Matrix
              </h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/80 text-white">
                {breachedApplications.length} Breaches Active
              </span>
            </div>
            <p className="text-xs text-rose-200/90 mt-0.5 leading-snug">
              Level 1 (Regional Director) & Level 2 (Member Secretary HQ) Intervention Desk
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right text-[11px] sm:text-xs">
          <span className="text-rose-200">Enforcement Authority:</span>{' '}
          <strong className="text-white block sm:inline">AICTE HQ, New Delhi</strong>
        </div>
      </div>

      {/* Desktop / Tablet Table View (hidden on mobile) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-[13px]">
          <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-4 font-bold">Application ID</th>
              <th className="py-3 px-4 font-bold">Institution Name</th>
              <th className="py-3 px-4 font-bold">Current Desk</th>
              <th className="py-3 px-4 font-bold">Aging / Breach</th>
              <th className="py-3 px-4 font-bold">Escalation Status</th>
              <th className="py-3 px-4 text-center font-bold">Intervention Controls</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {breachedApplications.map((app) => {
              const overdueDays = Math.abs(app.sla?.daysRemaining || 3);
              const escLevel = app.sla?.escalationLevel || 1;
              const isReassigning = reassigningId === app.applicationId;

              return (
                <tr key={app.applicationId} className="hover:bg-rose-50/40 transition">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-rose-900 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200/90 text-xs">
                      {app.applicationId}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 text-sm">{app.institutionName}</div>
                    <div className="text-xs text-slate-500 mt-0.5 font-medium">
                      {app.region} Region • {app.stage} Stage
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">
                    {app.assignedRO || 'Regional Scrutiny Officer'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 font-medium text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 text-xs">
                      <Clock className="w-3.5 h-3.5 text-rose-500" />
                      <span>+{overdueDays}d Overdue ({app.sla?.daysSpent}d spent)</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {escLevel === 2 ? (
                      <span className="inline-flex items-center gap-1.5 font-semibold text-xs text-white bg-rose-600 px-3 py-1 rounded-full shadow-xs">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Level 2: Member Secretary HQ
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 font-medium text-xs text-amber-900 bg-amber-50 border border-amber-300 px-2.5 py-0.5 rounded-full">
                        Level 1: Regional Director
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setReassigningId(app.applicationId)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-white" />
                        Re-assign Desk
                      </button>
                      <button
                        onClick={() =>
                          handleDispatchShowCause(app.applicationId, app.institutionName)
                        }
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-300/80 text-rose-800 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5 text-rose-600" />
                        Show-Cause
                      </button>
                    </div>

                    {isReassigning && (
                      <div className="mt-2 text-left bg-white p-3.5 rounded-xl border border-slate-300 shadow-xl space-y-2 max-w-sm mx-auto">
                        <p className="font-bold text-slate-800 text-xs">
                          Reassign File to Senior Officer:
                        </p>
                        <select
                          value={newOfficer}
                          onChange={(e) => setNewOfficer(e.target.value)}
                          className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                        >
                          <option>Dr. V. K. Bansal (Bureau Director, HQ)</option>
                          <option>Dr. S. K. Goel (Director Approvals, Apex)</option>
                          <option>Special Appellate Officer (SAC Nominee)</option>
                        </select>
                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            onClick={() => setReassigningId(null)}
                            className="px-2.5 py-1 text-slate-500 text-xs hover:bg-slate-100 rounded-lg cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleReassign(app.applicationId)}
                            disabled={processing}
                            className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-2xs cursor-pointer"
                          >
                            {processing ? 'Reassigning...' : 'Confirm'}
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View (Optimized for small screens) */}
      <div className="md:hidden divide-y divide-slate-100">
        {breachedApplications.map((app) => {
          const overdueDays = Math.abs(app.sla?.daysRemaining || 3);
          const escLevel = app.sla?.escalationLevel || 1;
          const isReassigning = reassigningId === app.applicationId;

          return (
            <div key={app.applicationId} className="p-4 space-y-3 bg-white">
              {/* Top Row: App ID + Escalation Pill */}
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono font-bold text-rose-900 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200/90 text-xs">
                  {app.applicationId}
                </span>
                {escLevel === 2 ? (
                  <span className="inline-flex items-center gap-1 font-semibold text-[10px] text-white bg-rose-600 px-2.5 py-0.5 rounded-full shadow-2xs">
                    <ShieldAlert className="w-3 h-3" />
                    L2: Member Sec. HQ
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-medium text-[10px] text-amber-900 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-full">
                    L1: Regional Dir.
                  </span>
                )}
              </div>

              {/* Institution Details */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm leading-snug">
                  {app.institutionName}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {app.region} Region • {app.stage} Stage
                </p>
              </div>

              {/* SLA & Desk Info */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs">
                <div className="text-slate-600">
                  <span className="text-slate-400">Desk: </span>
                  <span className="font-medium text-slate-800">{app.assignedRO || 'RO Officer'}</span>
                </div>
                <span className="inline-flex items-center gap-1 font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 text-[11px]">
                  <Clock className="w-3 h-3 text-rose-500" />
                  +{overdueDays}d Overdue
                </span>
              </div>

              {/* Action Buttons for Mobile */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => setReassigningId(app.applicationId)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-2xs cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Re-assign</span>
                </button>
                <button
                  onClick={() => handleDispatchShowCause(app.applicationId, app.institutionName)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-rose-50 hover:bg-rose-100 border border-rose-300/80 text-rose-800 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-rose-600" />
                  <span>Show-Cause</span>
                </button>
              </div>

              {/* Reassign form for mobile */}
              {isReassigning && (
                <div className="mt-2 text-left bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                  <p className="font-semibold text-slate-800 text-xs">
                    Reassign to Senior Officer:
                  </p>
                  <select
                    value={newOfficer}
                    onChange={(e) => setNewOfficer(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option>Dr. V. K. Bansal (Bureau Director, HQ)</option>
                    <option>Dr. S. K. Goel (Director Approvals, Apex)</option>
                    <option>Special Appellate Officer (SAC Nominee)</option>
                  </select>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => setReassigningId(null)}
                      className="px-2.5 py-1 text-slate-500 text-xs hover:bg-slate-200 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleReassign(app.applicationId)}
                      disabled={processing}
                      className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg"
                    >
                      {processing ? 'Saving...' : 'Confirm'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EscalationMatrixTable;
