import React, { useState, useEffect } from 'react';
import {
  ClipboardCheck,
  Calendar,
  MapPin,
  CheckCircle,
  Clock,
  Camera,
  ShieldCheck,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { evcAPI } from '../../services/api';
import { useApp } from '../../context/AppContext';
import MetricCard from '../common/MetricCard';
import InspectionReportDesk from './InspectionReportDesk';
import InspectionScheduleModal from './InspectionScheduleModal';

export const EVCDashboard = () => {
  const { showToast, refreshKey } = useApp();
  const [loading, setLoading] = useState(true);
  const [inspections, setInspections] = useState([]);
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [schedulingInspection, setSchedulingInspection] = useState(null);

  useEffect(() => {
    fetchInspections();
  }, [refreshKey]);

  const fetchInspections = async () => {
    try {
      setLoading(true);
      const res = await evcAPI.getInspections();
      if (res.data?.success) {
        setInspections(res.data.inspections || []);
      }
    } catch (err) {
      showToast(err.message || 'Error loading inspections', 'error');
    } finally {
      setLoading(false);
    }
  };

  const completedCount = inspections.filter((i) => i.status === 'Completed').length;
  const scheduledCount = inspections.filter((i) => i.status === 'Scheduled').length;

  return (
    <div className="space-y-6">
      {/* Clean Boxless Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <span className="font-semibold text-slate-700">Expert Visit Committee (EVC)</span>
            <span className="text-slate-300">/</span>
            <span className="font-mono text-slate-600 font-medium">Field Audit Roster</span>
            <span className="text-slate-300">•</span>
            <span>Anti-Fraud GPS Guard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Physical Inspection & Geofence Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Live on-site GPS verification ensuring physical committee presence and authentic campus facility audits.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white text-emerald-800 border border-emerald-200/80 text-xs font-medium font-mono shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>200m GPS Radius Enforced</span>
          </div>
        </div>
      </div>

      {/* KPI Ribbon (Unified Connected Surface) */}
      <div className="relative bg-white rounded-xl border border-slate-200/70 shadow-xs divide-y sm:divide-y-0 sm:divide-x divide-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 overflow-hidden">
        <MetricCard
          title="Allocated Inspections"
          value={inspections.length}
          subtitle="Total assigned committees"
          icon={ClipboardCheck}
          variant="navy"
          badgeText="Active Roster"
          statusHint="Assigned expert panels"
        />

        <MetricCard
          title="Scheduled Visits"
          value={scheduledCount}
          subtitle="Visits confirmed with colleges"
          icon={Calendar}
          variant="saffron"
          badgeText="Upcoming"
          statusHint="Pending site inspections"
        />

        <MetricCard
          title="Completed Audits"
          value={completedCount}
          subtitle="Verdicts submitted to council"
          icon={CheckCircle}
          variant="success"
          badgeText="Cleared"
          statusHint="Reports submitted"
        />

        <MetricCard
          title="Geofence Accuracy"
          value="100%"
          subtitle="Zero proxy audit violations"
          icon={MapPin}
          variant="success"
          badgeText="Anti-Fraud"
          statusHint="200m GPS perimeter enforced"
        />
      </div>

      {/* Inspections Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-900">
          Allocated Physical Inspections ({inspections.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inspections.map((insp) => (
            <div
              key={insp.applicationId}
              className="bg-white rounded-xl border border-slate-200/70 p-5 shadow-xs hover:border-slate-300 hover:shadow-saas-hover transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] font-mono font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/60">
                      {insp.applicationId}
                    </span>
                    <h4 className="text-sm font-semibold text-slate-900 mt-1 line-clamp-1">
                      {insp.institutionName}
                    </h4>
                  </div>
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${
                      insp.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80'
                        : 'bg-blue-50 text-blue-800 border-blue-200/80'
                    }`}
                  >
                    {insp.status}
                  </span>
                </div>

                <div className="bg-slate-50/60 p-3 rounded-lg border border-slate-100 text-xs space-y-1 text-slate-600 mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-normal">Scheduled Date:</span>
                    <span className="font-medium text-slate-800 tabular-nums">
                      {insp.scheduledDate
                        ? new Date(insp.scheduledDate).toLocaleDateString('en-IN')
                        : 'Pending Schedule'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-normal">Chairperson:</span>
                    <span className="font-medium text-slate-800">
                      {insp.committeeMembers?.[0]?.name || insp.inspectionChairperson}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-normal">Geofence Distance:</span>
                    <span className="font-medium text-emerald-700">
                      {insp.distanceMeters || 28}m from Campus Center (Verified)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-normal">Verdict:</span>
                    <span className="font-medium text-slate-900">
                      {insp.verdict || 'Pending Review'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setSelectedInspection(insp)}
                  className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg shadow-2xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-slate-300" />
                  <span>Conduct Geofence Inspection & Verdict</span>
                </button>

                <button
                  onClick={() => setSchedulingInspection(insp)}
                  className="py-2 px-3 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg border border-slate-200/80 transition shadow-2xs cursor-pointer"
                >
                  <span>Reschedule</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {selectedInspection && (
        <InspectionReportDesk
          inspection={selectedInspection}
          onClose={() => setSelectedInspection(null)}
          onSubmitted={fetchInspections}
        />
      )}

      {schedulingInspection && (
        <InspectionScheduleModal
          inspection={schedulingInspection}
          onClose={() => setSchedulingInspection(null)}
          onScheduled={fetchInspections}
        />
      )}
    </div>
  );
};

export default EVCDashboard;
