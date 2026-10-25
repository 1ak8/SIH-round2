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
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    fetchHQData();
  }, [refreshKey]);

  const fetchHQData = async () => {
    try {
      setLoading(true);
      const [mRes, hRes, eRes] = await Promise.all([
        adminAPI.getMetrics(),
        adminAPI.getHeatmap(),
        adminAPI.getEscalationMatrix(),
      ]);

      if (mRes.data?.success) setMetrics(mRes.data.metrics);
      if (hRes.data?.success) setHeatmap(hRes.data.heatmap);
      if (eRes.data?.success) setBreachedApps(eRes.data.breachedApplications || []);
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
    <div className="space-y-6">
      {/* Clean Boxless Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <span className="font-semibold text-slate-700">Apex Council</span>
            <span className="text-slate-300">/</span>
            <span className="font-mono text-slate-600 font-medium">New Delhi HQ</span>
            <span className="text-slate-300">•</span>
            <span>Central Approval Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Central Approval Governance & Escalation Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            National clearance velocity, regional bottleneck analysis, centralized SLA auto-escalation matrix, and dynamic handbook policy engine.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setShowRulesModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 text-xs font-medium rounded-xl shadow-2xs transition cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span>Rules Engine</span>
          </button>

          <button
            onClick={handleSimulateBreach}
            disabled={simulating}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100/70 text-amber-900 border border-amber-200/80 text-xs font-medium rounded-xl shadow-2xs transition cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            <span>Simulate Breach (+10d)</span>
          </button>

          <button
            onClick={() => navigateTo('audit')}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-xl shadow-2xs transition cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-slate-300" />
            <span>Audit Ledger</span>
          </button>
        </div>
      </div>

      {/* KPI Ribbon (Unified Connected Surface) */}
      <div className="relative bg-white rounded-xl border border-slate-200/70 shadow-xs divide-y sm:divide-y-0 sm:divide-x divide-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 overflow-hidden">
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
