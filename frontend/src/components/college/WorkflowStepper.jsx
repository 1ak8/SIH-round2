import React from 'react';
import { Check, Clock, AlertTriangle, ShieldAlert } from 'lucide-react';

export const WorkflowStepper = ({ currentStage, status, sla }) => {
  const stages = [
    { id: 'Submitted', label: '1. Form Submitted', description: 'Application Locked & Filed' },
    { id: 'Scrutiny', label: '2. RO Scrutiny Desk', description: 'Document & Faculty Audit' },
    { id: 'EVC', label: '3. EVC Inspection', description: '200m Geofenced Campus Visit' },
    { id: 'Final Decision', label: '4. Council Approval', description: 'Digital Docket Sealed' },
  ];

  // Accurate stage resolution: Never show EVC as active or completed if status is Under Scrutiny!
  const getStageIndex = (stage, appStatus) => {
    if (appStatus === 'Approved') return 3;
    if (appStatus === 'EVC Scheduled' || appStatus === 'EVC Completed' || stage === 'EVC') return 2;
    if (appStatus === 'Under Scrutiny' || appStatus === 'Deficiency Raised' || stage === 'Scrutiny') return 1;
    if (appStatus === 'Submitted' || stage === 'Submitted' || stage === 'Draft') return 0;
    return 1;
  };

  const activeIndex = getStageIndex(currentStage, status);

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200/70 p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
        <div>
          <span className="text-xs font-medium text-slate-400 block mb-0.5">
            Statutory Approval Pipeline
          </span>
          <p className="text-base font-semibold text-slate-900">
            Current Stage: <span className="text-slate-900 underline underline-offset-4 decoration-slate-300">{stages[activeIndex]?.label}</span>
          </p>
        </div>
        {sla && (
          <div className="text-right">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${
                sla.isOverdue
                  ? 'bg-rose-50 text-rose-700 border-rose-200/80'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
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
      <div className="relative flex items-center justify-between px-2 sm:px-6">
        {/* Connecting Line */}
        <div className="absolute left-8 right-8 top-4 h-[2px] bg-slate-100 -z-0">
          <div
            className="h-full bg-slate-900 transition-all duration-500 rounded-full"
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
                className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-xs transition-all duration-200 ${
                  isCompleted
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : isCurrent
                    ? 'bg-slate-900 text-white ring-4 ring-slate-100 shadow-2xs'
                    : 'bg-white border-2 border-slate-200 text-slate-400'
                }`}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : idx + 1}
              </div>
              <span
                className={`mt-2 text-xs font-medium max-w-[105px] leading-tight ${
                  isCurrent
                    ? 'text-slate-900 font-semibold'
                    : isCompleted
                    ? 'text-slate-700'
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
