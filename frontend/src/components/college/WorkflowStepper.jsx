import React from 'react';
import { Check, Clock, RotateCcw, Send } from 'lucide-react';

export const WorkflowStepper = ({
  currentStage,
  status,
  sla,
  applicationId,
  onReset,
  onForwardRO,
}) => {
  const stages = [
    { id: 'Submitted', label: '1. Form Submitted', description: 'Application Locked & Filed' },
    { id: 'Scrutiny', label: '2. RO Scrutiny Desk', description: 'Document & Faculty Audit' },
    { id: 'EVC', label: '3. EVC Inspection', description: '200m Geofenced Campus Visit' },
    { id: 'Final Decision', label: '4. Council Approval', description: 'Digital Docket Sealed' },
  ];

  // Accurate stage resolution:
  const isResetOrNotStarted = status === 'Not Started' || currentStage === 'Not Started' || !status;

  const getStageIndex = (stage, appStatus) => {
    if (appStatus === 'Not Started' || stage === 'Not Started') return -1;
    if (appStatus === 'Approved') return 3;
    if (appStatus === 'EVC Scheduled' || appStatus === 'EVC Completed' || stage === 'EVC') return 2;
    if (appStatus === 'Under Scrutiny' || appStatus === 'Deficiency Raised' || stage === 'Scrutiny') return 1;
    if (appStatus === 'Submitted' || stage === 'Submitted') return 0;
    return -1;
  };

  const activeIndex = getStageIndex(currentStage, status);

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200/70 p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Statutory Approval Pipeline
            </span>
            {applicationId && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md font-mono text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/80">
                File: {applicationId}
              </span>
            )}
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                isResetOrNotStarted
                  ? 'bg-slate-100 text-slate-500 border-slate-200'
                  : status === 'Approved'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : status === 'Submitted'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : status === 'Deficiency Raised'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              ● {isResetOrNotStarted ? 'Pipeline Reset / Empty' : status || 'Submitted'}
            </span>
          </div>
          <p className="text-sm sm:text-base font-semibold text-slate-900 flex flex-wrap items-center gap-2">
            <span>Current Stage:</span>
            <span className="text-slate-900 font-bold bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200/70">
              {isResetOrNotStarted ? 'Ready to File (No Active Application)' : stages[activeIndex]?.label}
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              — {isResetOrNotStarted ? 'All pipeline stages are reset. Click "File Application" above to begin.' : stages[activeIndex]?.description}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {sla && (
            <div className="shrink-0">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border ${
                  sla.isOverdue
                    ? 'bg-rose-50 text-rose-700 border-rose-200/80'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                {sla.isOverdue
                  ? `Overdue: ${Math.abs(sla.daysRemaining)}d`
                  : `${sla.daysRemaining}d SLA`}
              </span>
            </div>
          )}

          {/* Forward to RO button: Only visible when form is submitted (Stage 1) */}
          {(status === 'Submitted' || currentStage === 'Submitted') && onForwardRO && (
            <button
              type="button"
              onClick={onForwardRO}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0c2340] hover:bg-[#163a66] text-white text-xs font-semibold rounded-xl transition shadow-2xs cursor-pointer active:scale-95"
              title="Forward submitted application to Regional Officer Scrutiny Desk"
            >
              <Send className="w-3.5 h-3.5 text-orange-400" />
              <span>Forward to RO</span>
            </button>
          )}

          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-300 transition shadow-2xs cursor-pointer active:scale-95"
              title="Reset Statutory Approval Pipeline to fresh Stage 1 state"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
              <span>Reset Pipeline</span>
            </button>
          )}
        </div>
      </div>

      {/* Stepper Bar */}
      <div className="relative flex items-center justify-between px-2 sm:px-6">
        {/* Connecting Line */}
        <div className="absolute left-8 right-8 top-4 h-[2px] bg-slate-100 -z-0">
          <div
            className="h-full bg-slate-900 transition-all duration-500 rounded-full"
            style={{ width: `${activeIndex >= 0 ? (activeIndex / (stages.length - 1)) * 100 : 0}%` }}
          />
        </div>

        {stages.map((stage, idx) => {
          const isCompleted = activeIndex >= 0 && (idx < activeIndex || (status === 'Approved' && idx === 3));
          const isCurrent = activeIndex >= 0 && idx === activeIndex && status !== 'Approved';

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