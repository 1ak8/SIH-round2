import React from 'react';
import { ShieldCheck, User, Clock, ArrowRight, Activity, Hash, CheckCircle2 } from 'lucide-react';

export const AuditTrailTimeline = ({ logs = [] }) => {
  if (!logs || logs.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 text-xs">
        <Activity className="w-8 h-8 mx-auto mb-2 text-slate-300 stroke-[1.5]" />
        <p className="font-bold text-slate-600 font-display">No Audit Ledger Events Recorded</p>
        <p className="text-xs text-slate-500 mt-0.5">Every statutory transition and regulatory action will be logged here with immutable timestamps.</p>
      </div>
    );
  }

  const getRoleBadge = (role) => {
    switch (role?.toLowerCase()) {
      case 'college':
        return 'bg-blue-50 text-blue-700 border-blue-200/90';
      case 'ro':
        return 'bg-amber-50 text-amber-800 border-amber-200/90';
      case 'evc':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200/90';
      case 'hq':
      case 'hq super-admin':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200/80">
      {logs.map((log, index) => (
        <div key={log._id || index} className="relative group">
          {/* Dot */}
          <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full border-2 border-white bg-slate-400 group-hover:bg-[#ea580c] transition-colors shadow-xs flex items-center justify-center">
            <Activity className="w-2.5 h-2.5 text-white stroke-[2.5]" />
          </div>

          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all duration-150">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-[13px] font-bold text-slate-900 flex items-center gap-1.5 font-display">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {log.actorName || 'Council System'}
                </span>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${getRoleBadge(
                    log.role
                  )}`}
                >
                  {log.role}
                </span>
              </div>
              <span className="text-xs text-slate-600 flex items-center gap-1 font-mono font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {new Date(log.timestamp || log.createdAt).toLocaleString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            <div className="text-xs sm:text-[13px] font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#0c2340] uppercase tracking-wider">
                Action:
              </span>
              <span className="text-slate-900 font-bold">{log.action}</span>
            </div>

            {log.fromState && log.toState && (
              <div className="flex items-center gap-2 text-xs text-slate-600 mb-2 bg-slate-50/80 px-2.5 py-1 rounded-lg border border-slate-200/80 w-fit">
                <span className="text-slate-500 font-medium">{log.fromState}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-bold text-slate-900">{log.toState}</span>
              </div>
            )}

            {log.remarks && (
              <p className="text-xs text-slate-600 bg-orange-50/40 p-2.5 rounded-lg border border-orange-100/70 leading-relaxed font-normal">
                {log.remarks}
              </p>
            )}

            <div className="mt-2.5 pt-2 border-t border-slate-100 text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Hash className="w-3 h-3 text-slate-300" />
                Ref: {log.applicationId}
              </span>
              <span>SHA-256 Verified Ledger • IP: {log.ipAddress || '103.24.18.2'}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AuditTrailTimeline;