import React from 'react';
import { Clock } from 'lucide-react';

export const SLATimerBadge = ({ sla }) => {
  if (!sla) return null;

  const { daysRemaining = 7, daysAllowed = 7, daysSpent = 1, isOverdue, escalationLevel = 0 } = sla;

  if (isOverdue || daysRemaining < 0) {
    const overdueDays = Math.abs(daysRemaining);
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
        <span>Overdue: {overdueDays}d {escalationLevel > 0 ? `(L${escalationLevel} HQ)` : ''}</span>
      </span>
    );
  }

  if (daysRemaining <= 2) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        <span>Urgent: {daysRemaining}d left ({daysSpent}/{daysAllowed}d)</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
      <Clock className="w-3.5 h-3.5 text-emerald-600" />
      <span>{daysRemaining}d left ({daysSpent}/{daysAllowed}d SLA)</span>
    </span>
  );
};

export default SLATimerBadge;
