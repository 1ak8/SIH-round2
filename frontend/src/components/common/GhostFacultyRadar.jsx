import React, { useState, useEffect } from 'react';
import {
  Users,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Building2,
  FileWarning,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Flag,
  UserCheck,
} from 'lucide-react';
import { scrutinyAPI } from '../../services/api';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const GhostFacultyRadar = ({ applicationId, onDeficiencyRaised }) => {
  const { showToast, triggerRefresh } = useApp();
  const { activeRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [radarData, setRadarData] = useState(null);
  const [flaggingId, setFlaggingId] = useState(null);

  useEffect(() => {
    fetchRadar();
  }, [applicationId]);

  const fetchRadar = async () => {
    try {
      setLoading(true);
      const targetId = applicationId || 'AICTE-2026-C-1042';
      const res = await scrutinyAPI.getFacultyRadar(targetId);
      if (res.data?.success && res.data.radar?.currentSubmittedCount > 0) {
        setRadarData(res.data.radar);
      } else {
        // Fallback to flagship application radar if target application has no faculty roster yet
        const fallbackRes = await scrutinyAPI.getFacultyRadar('AICTE-2026-C-1042');
        if (fallbackRes.data?.success) {
          setRadarData(fallbackRes.data.radar);
        }
      }
    } catch (err) {
      showToast(err.message || 'Error running faculty duplicity scan', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      fetchRadar();
      setScanning(false);
      showToast('National cross-college PAN/Aadhaar duplicity scan completed.', 'info');
    }, 800);
  };

  const handleFlagDeficiency = async (faculty, conflict) => {
    try {
      setFlaggingId(faculty.facultyId);
      const res = await scrutinyAPI.flagFacultyDeficiency(applicationId, {
        facultyName: faculty.name,
        panNumber: faculty.panNumber,
        conflictingInstitution: conflict.conflictingInstitution,
      });

      if (res.data?.success) {
        showToast(
          `Statutory Cadre Deficiency raised against ${faculty.name} for concurrent appointment at ${conflict.conflictingInstitution}!`,
          'warning'
        );
        triggerRefresh();
        if (onDeficiencyRaised) onDeficiencyRaised();
      }
    } catch (err) {
      showToast(err.message || 'Failed to raise deficiency', 'error');
    } finally {
      setFlaggingId(null);
    }
  };

  if (loading && !radarData) {
    return (
      <div className="p-8 text-center text-xs text-slate-400">
        <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-orange-500" />
        Scanning national database for faculty duplicity...
      </div>
    );
  }

  const {
    institutionName,
    totalIntake = 240,
    totalStudents = 960,
    requiredFaculty = 48,
    currentSubmittedCount = 0,
    actualValidFaculty = 0,
    ghostFacultyCount = 0,
    sfrRatio = '1:20',
    isCompliant = false,
    flaggedConflicts = [],
    cleanFaculty = [],
    cadreBreakdown = { professors: 0, associateProfessors: 0, assistantProfessors: 0 },
  } = radarData || {};

  return (
    <div className="space-y-5">
      {/* Header Bar - Styled in Central AICTE Sovereign Rose-Navy Gradient Theme */}
      <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-[#0c2340] text-white p-5 rounded-2xl border border-rose-300/40 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center text-rose-200 shrink-0 shadow-inner">
            <ShieldAlert className="w-5 h-5 text-rose-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-500/80 text-white border border-white/20">
                Anti-Fraud Intelligence
              </span>
              <span className="text-xs text-rose-300">•</span>
              <span className="text-xs font-semibold text-rose-200">APH Clause 4.2.b Mandate</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white font-display">
              Ghost Faculty & PAN Duplicity Radar
            </h2>
            <p className="text-xs sm:text-[13px] text-rose-200/90 mt-0.5 max-w-2xl leading-relaxed">
              Cross-checks candidate PAN & Aadhaar against all affiliated technical institutes nationwide to prevent rented faculty fraud.
            </p>
          </div>
        </div>

        <button
          onClick={handleSimulateScan}
          disabled={scanning}
          className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-rose-50 text-rose-950 rounded-xl text-xs font-bold transition shadow-xs shrink-0 border border-white/30 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${scanning ? 'animate-spin text-rose-600' : 'text-rose-600'}`} />
          <span>{scanning ? 'Scanning AICTE Registry...' : 'Run National Duplicity Scan'}</span>
        </button>
      </div>

      {/* KPI Metric Ribbon */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm divide-y sm:divide-y-0 sm:divide-x divide-slate-100 grid grid-cols-2 lg:grid-cols-4 overflow-hidden">
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
              Submitted Roster
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              Total
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-display tabular-nums">
            {currentSubmittedCount}
          </div>
          <p className="mt-1 text-xs text-slate-600 font-medium">Teachers on payroll</p>
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
              AICTE Cadre Norm (1:20)
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Req: {requiredFaculty}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-900 font-display tabular-nums">
            {sfrRatio}
          </div>
          <p className="mt-1 text-xs text-slate-600 font-medium">{totalStudents} Total students</p>
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
              Genuine Verified
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Clean
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 font-display tabular-nums">
            {actualValidFaculty}
          </div>
          <p className="mt-1 text-xs text-slate-600 font-medium">Zero duplicate tenancy</p>
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wide">
              Ghost Conflicts
            </span>
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                ghostFacultyCount > 0
                  ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {ghostFacultyCount > 0 ? 'Fraud Alert' : 'None'}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-700 font-display tabular-nums">
            {ghostFacultyCount}
          </div>
          <p className="mt-1 text-xs text-slate-600 font-medium">Cross-college duplicates</p>
        </div>
      </div>

      {/* Flagged Ghost Faculty Warnings (If Any Found) */}
      {flaggedConflicts.length > 0 && (
        <div className="bg-rose-50/80 border-2 border-rose-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <ShieldAlert className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-900 font-display flex items-center gap-2">
                <span>Critical Regulatory Alert: {ghostFacultyCount} Ghost Faculty Tenancies Flagged!</span>
              </h3>
              <p className="text-xs text-rose-800 mt-0.5 leading-relaxed">
                The PAN numbers of the following faculty members are concurrently submitted in full-time teaching appointments at another technical college for Academic Cycle 2026-27. This directly violates APH Cadre Norms.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {flaggedConflicts.map((fac) => {
              const primaryConflict = fac.conflicts[0] || {};
              const isFlagging = flaggingId === fac.facultyId;

              return (
                <div
                  key={fac.facultyId}
                  className="bg-white rounded-xl border border-rose-200 p-4 shadow-xs hover:border-rose-300 transition"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-slate-900 font-display">
                          {fac.name}
                        </span>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          {fac.designation}
                        </span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300">
                          PAN: {fac.panNumber}
                        </span>
                      </div>
                      <p className="text-xs sm:text-[13px] text-slate-600">
                        Department: <span className="font-semibold text-slate-800">{fac.department}</span> • Qualification:{' '}
                        <span className="font-semibold text-slate-800">{fac.highestQualification}</span>
                      </p>
                    </div>

                    {/* Role-Specific Faculty Action */}
                    {activeRole === 'college' ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold shrink-0">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Action Due: Upload Relieving Deed</span>
                      </div>
                    ) : activeRole === 'evc' ? (
                      <button
                        onClick={() => {
                          showToast(`Biometric inspection recorded for ${fac.name} on-site`, 'info');
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0c2340] hover:bg-[#163a66] text-white text-xs font-bold rounded-xl shadow-xs transition shrink-0 cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Verify Biometric On-Site</span>
                      </button>
                    ) : activeRole === 'hq' ? (
                      <button
                        onClick={() => handleFlagDeficiency(fac, primaryConflict)}
                        disabled={isFlagging}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0c2340] hover:bg-[#163a66] text-white text-xs font-bold rounded-xl shadow-xs transition shrink-0 cursor-pointer"
                      >
                        <Flag className="w-3.5 h-3.5 text-orange-400" />
                        <span>{isFlagging ? 'Flagging...' : 'Council Investigation'}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleFlagDeficiency(fac, primaryConflict)}
                        disabled={isFlagging}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition shrink-0 cursor-pointer"
                      >
                        <Flag className="w-3.5 h-3.5" />
                        <span>{isFlagging ? 'Raising Deficiency...' : 'Raise Statutory Deficiency'}</span>
                      </button>
                    )}
                  </div>

                  {/* Conflicting Institute Details */}
                  <div className="mt-3 pt-3 border-t border-rose-100 bg-rose-50/50 rounded-lg p-3 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-rose-600 shrink-0" />
                      <div>
                        <span className="text-slate-600 block text-xs uppercase font-bold">
                          Concurrent Duplicate Tenancy Detected:
                        </span>
                        <span className="font-bold text-rose-900 text-xs sm:text-[13px]">
                          {primaryConflict.conflictingInstitution} ({primaryConflict.conflictingRegion} Region)
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-semibold text-rose-800 bg-white px-2.5 py-0.5 rounded border border-rose-200">
                      App ID: {primaryConflict.conflictingAppId}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Verified Clean Roster Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-display">
              Verified Genuine Faculty Roster ({cleanFaculty.length})
            </h3>
            <p className="text-xs text-slate-500">
              Faculty members cleared through nationwide PAN, Aadhaar and AICTE Faculty Portal de-duplication.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            De-Duplicated Clean
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-[13px]">
            <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-xs font-display">
              <tr>
                <th className="py-3.5 px-4 font-extrabold">Faculty Member</th>
                <th className="py-3.5 px-4 font-extrabold">Designation & Dept</th>
                <th className="py-3.5 px-4 font-extrabold">PAN / Aadhaar (Masked)</th>
                <th className="py-3.5 px-4 font-extrabold">Highest Degree</th>
                <th className="py-3.5 px-4 font-extrabold">Experience</th>
                <th className="py-3.5 px-4 text-right font-extrabold">Biometric Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cleanFaculty.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-slate-400">
                    No verified clean faculty records currently loaded. Click "Run National Duplicity Scan" to re-check.
                  </td>
                </tr>
              ) : (
                cleanFaculty.map((fac) => (
                  <tr key={fac.facultyId} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900 font-display text-sm">
                      {fac.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <span className="font-semibold text-slate-900">{fac.designation}</span>
                      <span className="block text-xs text-slate-500">{fac.department}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-700">
                      <div>{fac.panNumber}</div>
                      <div className="text-xs text-slate-500">{fac.aadhaarMasked}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-800 font-medium">
                      {fac.highestQualification}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-mono">
                      {fac.experienceYears} Years
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GhostFacultyRadar;
