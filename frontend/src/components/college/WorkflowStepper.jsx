import React from 'react';
import { Check, Clock, AlertTriangle, ShieldAlert } from 'lucide-react';

export const WorkflowStepper = ({ currentStage, status, sla }) => {
  const stages = [
    { id: 'Draft', label: '1. Draft Form', description: 'Application Prepared' },
    { id: 'Scrutiny', label: '2. Scrutiny Desk', description: 'APH 2024-27 Verification' },
    { id: 'EVC', label: '3. EVC Inspection', description: 'On-Site Geo Audit' },
    { id: 'Final Decision', label: '4. Final Approval', description: 'Council Clearance & Docket' },
  ];

  const getStageIndex = (stage) => {
    switch (stage) {
      case 'Draft':
        return 0;
      case 'Scrutiny':
        return 1;
      case 'EVC':
        return 2;
      case 'SAC_SHC':
      case 'Final Decision':
        return 3;
      default:
        return 1;
    }
  };

  const activeIndex = getStageIndex(currentStage);

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-5">
        <div>
          <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
            Live Statutory Approval Pipeline
          </h4>
          <p className="text-sm sm:text-base font-extrabold text-[#0c2340] font-display">
            Current Stage: <span className="text-[#ea580c]">{stages[activeIndex]?.label}</span>
          </p>
        </div>
        {sla && (
          <div className="text-right">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                sla.isOverdue
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              {sla.isOverdue
                ? `Overdue: ${Math.abs(sla.daysRemaining)} days`
                : `${sla.daysRemaining} days remaining in SLA`}
            </span>
          </div>
        )}
      </div>

      {/* Stepper Bar */}
      <div className="relative flex items-center justify-between px-2 sm:px-4">
        {/* Connecting Line */}
        <div className="absolute left-6 right-6 top-4 h-1 bg-slate-200 -z-0">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-[#ea580c] transition-all duration-500 rounded-full"
            style={{ width: `${(activeIndex / (stages.length - 1)) * 100}%` }}
          />
        </div>

        {stages.map((stage, idx) => {
          const isCompleted = idx < activeIndex || (status === 'Approved' && idx === 3);
          const isCurrent = idx === activeIndex && status !== 'Approved';

          return (
            <div
              key={stage.id}
              className="flex flex-col items-center text-center relative z-10 group"
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 shadow-sm ${
                  isCompleted
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                    : isCurrent
                    ? 'bg-[#ea580c] text-white ring-4 ring-orange-100 scale-105'
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
              </div>
              <span
                className={`mt-2 text-xs font-bold max-w-[100px] leading-tight ${
                  isCurrent
                    ? 'text-[#ea580c]'
                    : isCompleted
                    ? 'text-slate-800'
                    : 'text-slate-400'
                }`}
              >
                {stage.label}
              </span>
              <span className="text-[11px] text-slate-400 hidden md:block max-w-[95px] leading-tight mt-0.5">
                {stage.description}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkflowStepper;
