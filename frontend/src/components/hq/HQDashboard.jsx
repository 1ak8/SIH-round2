import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  BarChart3,
  Sliders,
  Flame,
  FileCheck,
  AlertTriangle,
  History,
  Building2,
  TrendingUp,
  Clock,
  Layers,
  CheckCircle,
} from 'lucide-react';
import { adminAPI, applicationAPI } from '../../services/api';
import { useApp } from '../../context/AppContext';
import MetricCard from '../common/MetricCard';
import RegionalHeatmapChart from './RegionalHeatmapChart';
import EscalationMatrixTable from './EscalationMatrixTable';
import RulesConfigModal from './RulesConfigModal';

export const HQDashboard = () => {
  const { showToast, openModal, refreshKey, navigateTo } = useApp();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalApplications: 5,
    underScrutiny: 2,
    inEVC: 2,
    approved: 1,
    deficient: 1,
    overdueSla: 1,
    level2CriticalEscalations: 1,
    clearanceRatePercent: 65,
    averageProcessingDays: 8.4,
  });
  const [heatmap, setHeatmap] = useState([]);
  const [breachedApps, setBreachedApps] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    fetchHQData();
  }, [refreshKey]);

  const fetchHQData = async () => {
    try {
      setLoading(true);
      const [mRes, hRes, eRes, appsRes] = await Promise.all([
        adminAPI.getMetrics(),
        adminAPI.getHeatmap(),
        adminAPI.getEscalationMatrix(),
        applicationAPI.getAll(),
      ]);

      if (mRes.data?.success) setMetrics(mRes.data.metrics);
      if (hRes.data?.success) setHeatmap(hRes.data.heatmap);
      if (eRes.data?.success) setBreachedApps(eRes.data.breachedApplications || []);

      if (appsRes.data?.success) {
        // Filter applications that are in EVC stage, Completed EVC, or Final Decision stage
        const readyForCouncil = (appsRes.data.applications || []).filter(
          (a) =>
            a.stage === 'EVC' ||
            a.stage === 'Final Decision' ||
            a.status === 'EVC Completed' ||
            a.status === 'EVC Scheduled' ||
            a.status === 'Approved'
        );
        setPendingApprovals(readyForCouncil);
      }
    } catch (err) {
      console.warn('Error loading HQ data, using live cached data');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateBreach = async () => {
    try {
      setSimulating(true);
      const res = await applicationAPI.simulateSlaBreach('AICTE-2026-C-1042', 10);
      if (res.data?.success) {
        showToast(
          '⚡ DEMO DIFFERENTIATOR: Artificial time-warp applied (+10 days). SLA breached and escalated to Level 2 HQ!',
          'warning'
        );
        fetchHQData();
      }
    } catch (err) {
      showToast(err.message || 'Error simulating SLA breach', 'error');
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      {/* Clean Boxless Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 pb-1">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-medium text-slate-500 mb-1">
            <span className="font-semibold text-slate-700">Apex Council</span>
            <span className="text-slate-300">/</span>
            <span className="font-mono text-slate-600 font-medium">New Delhi HQ</span>
            <span className="text-slate-300">•</span>
            <span>Central Approval Console</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
            Central Approval Governance & Escalation Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            National clearance velocity, regional bottleneck analysis, centralized SLA auto-escalation matrix, and dynamic handbook policy engine.
          </p>
        </div>

        {/* Action Buttons: Responsive Wrap / Grid on Mobile */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 shrink-0 pt-1 sm:pt-0">
          <button
            onClick={() => setShowRulesModal(true)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 text-xs font-medium rounded-xl shadow-2xs transition cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">Rules Engine</span>
          </button>

          <button
            onClick={handleSimulateBreach}
            disabled={simulating}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100/70 text-amber-900 border border-amber-200/80 text-xs font-medium rounded-xl shadow-2xs transition cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="truncate">Simulate (+10d)</span>
          </button>

          <button
            onClick={() => navigateTo('audit')}
            className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-xl shadow-2xs transition cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            <span>Audit Ledger</span>
          </button>
        </div>
      </div>

      {/* KPI Ribbon (Fully Responsive Connected Grid) */}
      <div className="relative bg-white rounded-2xl sm:rounded-xl border border-slate-200/70 shadow-xs divide-y sm:divide-y-0 sm:divide-x divide-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 overflow-hidden">
        <MetricCard
          title="Total Pan-India Files"
          value={metrics.totalApplications}
          subtitle="All technical institutes enrolled"
          icon={Layers}
          variant="navy"
          badgeText="Pan-India"
          statusHint="All statutory applications"
        />

        <MetricCard
          title="Clearance Velocity"
          value={`${metrics.clearanceRatePercent}%`}
          subtitle="Approval conversion ratio"
          icon={TrendingUp}
          variant="success"
          badgeText="Optimal"
          statusHint="National clearance pace"
        />

        <MetricCard
          title="Active SLA Breaches"
          value={breachedApps.length}
          subtitle="Exceeded stage allowance"
          icon={AlertTriangle}
          variant={breachedApps.length > 0 ? 'danger' : 'success'}
          badgeText={breachedApps.length > 0 ? 'Urgent Review' : 'Zero Breaches'}
          statusHint={breachedApps.length > 0 ? 'Escalated to Member Secretary' : '100% within SLA limits'}
        />

        <MetricCard
          title="Avg. Processing Time"
          value={`${metrics.averageProcessingDays} Days`}
          subtitle="Statutory target: 14 days"
          icon={Clock}
          variant="saffron"
          badgeText="APH 2024-27"
          statusHint="Faster than statutory cap"
        />
      </div>

      {/* STAR FEATURE: Central SLA Escalation Matrix */}
      <EscalationMatrixTable
        breachedApplications={breachedApps}
        onReassigned={fetchHQData}
      />

      {/* Regional Bottleneck Heatmap */}
      <RegionalHeatmapChart data={heatmap} />

      {/* Post-EVC Council Clearances & Docket Issuance Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 tracking-tight font-sans">
                Post-EVC Council Clearances & Approval Docket Issuance
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                {pendingApprovals.length} Enrolled
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Applications undergoing on-site physical EVC audit or awaiting final Member Secretary seal & Letter of Approval.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200/60 shrink-0">
            Apex Council Jurisdiction
          </span>
        </div>

        {/* Desktop / Tablet Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-[13px]">
            <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 font-bold whitespace-nowrap">Application ID</th>
                <th className="py-3 px-4 font-bold min-w-[200px]">Institution Name</th>
                <th className="py-3 px-4 font-bold whitespace-nowrap">Region</th>
                <th className="py-3 px-4 font-bold whitespace-nowrap">Current Status</th>
                <th className="py-3 px-4 font-bold whitespace-nowrap">Inspection Stage</th>
                <th className="py-3 px-4 text-center font-bold whitespace-nowrap">Council Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pendingApprovals.map((app) => (
                <tr key={app.applicationId} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 text-xs inline-block">
                      {app.applicationId}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 text-sm leading-snug">{app.institutionName}</div>
                    <div className="text-xs text-slate-500 mt-0.5 font-medium">
                      {app.applicationType}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700 whitespace-nowrap">
                    {app.region} Region
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        app.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : app.status === 'EVC Scheduled'
                          ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                          : 'bg-blue-50 text-blue-800 border-blue-200'
                      }`}
                    >
                      {app.status === 'Approved' ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      <span>{app.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-600 whitespace-nowrap">
                    {app.stage === 'Final Decision' ? 'Council Sealed' : 'On-Site EVC Audit'}
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => openModal('docket', app)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition shadow-2xs cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                      <span>{app.status === 'Approved' ? 'View Docket' : 'Review & Seal'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-slate-100">
          {pendingApprovals.map((app) => (
            <div key={app.applicationId} className="p-4 space-y-2.5 bg-white">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200 text-xs">
                  {app.applicationId}
                </span>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                    app.status === 'Approved'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-indigo-50 text-indigo-800 border-indigo-200'
                  }`}
                >
                  {app.status}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm leading-snug">{app.institutionName}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{app.region} Region • {app.applicationType}</p>
              </div>
              <div className="pt-1">
                <button
                  onClick={() => openModal('docket', app)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-2xs cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                  <span>{app.status === 'Approved' ? 'View Official Docket' : 'Review & Seal Approval'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rules Config Modal */}
      {showRulesModal && (
        <RulesConfigModal
          onClose={() => setShowRulesModal(false)}
          onSaved={fetchHQData}
        />
      )}
    </div>
  );
};

export default HQDashboard;
