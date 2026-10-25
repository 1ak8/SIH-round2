import React from 'react';
import {
  FileText,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Building2,
  CheckCircle,
  Inbox,
  ShieldCheck,
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import SLATimerBadge from '../common/SLATimerBadge';

export const RegionalInboxTable = ({ applications = [], onSelectApplication }) => {
  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <Inbox className="w-6 h-6 stroke-[1.8]" />
        </div>
        <h4 className="text-sm font-bold text-slate-800 font-display">No Applications in Queue</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          All pending files in this regional jurisdiction have been processed or moved to the next review stage.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Table Header Action Bar */}
      <div className="px-5 py-3.5 bg-slate-50/90 border-b border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-[13px]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#ea580c] animate-pulse" />
          <span className="font-bold text-slate-800 font-display">Active Regional Docket Queue</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-600 font-mono text-xs font-semibold">
            {applications.length} Records Loaded
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="hidden sm:inline">Dual-Pane Verification Ready</span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="font-medium text-slate-700">Click any row to open scrutiny desk</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-[13px]">
          <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-xs">
            <tr>
              <th className="py-3.5 px-4 font-bold">Application ID</th>
              <th className="py-3.5 px-4 font-bold">Institution Name</th>
              <th className="py-3.5 px-4 font-bold">Category</th>
              <th className="py-3.5 px-4 font-bold">Review Stage</th>
              <th className="py-3.5 px-4 font-bold">Statutory Status</th>
              <th className="py-3.5 px-4 font-bold">SLA Clock</th>
              <th className="py-3.5 px-4 text-center font-bold">Scrutiny Desk</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {applications.map((app) => (
              <tr
                key={app.applicationId}
                className="hover:bg-slate-50/90 transition-all duration-150 cursor-pointer group"
                onClick={() => onSelectApplication(app)}
              >
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-[#0c2340] bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 text-xs group-hover:border-[#0c2340]/30 transition">
                    <FileText className="w-3.5 h-3.5 text-[#ea580c]" />
                    <span>{app.applicationId}</span>
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-900 group-hover:text-[#0c2340] transition line-clamp-1 font-display text-sm">
                    {app.institutionName}
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5 flex items-center gap-1.5 font-medium">
                    <span className="text-slate-400">Jurisdiction:</span>
                    <span className="font-semibold text-slate-700">{app.region} Region</span>
                    <span>•</span>
                    <span className="text-slate-600">{app.academicYear}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-slate-800 font-medium">
                  {app.applicationType}
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                    {app.stage}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <StatusBadge status={app.status} size="sm" />
                </td>
                <td className="py-3.5 px-4">
                  <SLATimerBadge sla={app.sla} />
                </td>
                <td className="py-3.5 px-4 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectApplication(app);
                    }}
                    className="px-3.5 py-1.5 bg-[#0c2340] hover:bg-[#163a66] active:bg-[#071526] text-white rounded-xl text-xs sm:text-[13px] font-bold inline-flex items-center gap-1.5 shadow-xs transition-all group-hover:shadow-sm group-hover:translate-x-0.5 cursor-pointer"
                  >
                    <span>Open Desk</span>
                    <ChevronRight className="w-3.5 h-3.5 text-white transition-transform" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegionalInboxTable;
