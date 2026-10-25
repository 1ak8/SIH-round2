/**
 * AICTE Pravah SLA Engine
 * Calculates aging, breach detection, and auto-escalation across approval stages.
 */

export const calculateSLA = (stageStartedAt, daysAllowed = 7) => {
  const start = new Date(stageStartedAt || Date.now());
  const now = new Date();
  const diffTime = Math.abs(now - start);
  const daysSpent = Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
  const daysRemaining = daysAllowed - daysSpent;
  const isOverdue = daysRemaining < 0;

  let escalationLevel = 0;
  let escalatedTo = '';
  let escalationReason = '';

  if (daysSpent >= 12) {
    escalationLevel = 2;
    escalatedTo = 'AICTE Member Secretary (Apex HQ)';
    escalationReason = `Critical Breach: Stage overdue by ${Math.abs(daysRemaining)} days. Level 2 HQ Intervention Triggered.`;
  } else if (daysSpent >= 8) {
    escalationLevel = 1;
    escalatedTo = 'Regional Director / Bureau Head';
    escalationReason = `Regional Warning: Stage overdue by ${Math.abs(daysRemaining)} days. Level 1 Notice Dispatched.`;
  }

  return {
    stageStartedAt: start,
    daysAllowed,
    daysSpent,
    daysRemaining,
    isOverdue,
    escalationLevel,
    escalatedTo,
    escalationReason,
    escalatedAt: escalationLevel > 0 ? new Date() : null,
  };
};

/**
 * Live Differentiator: Artificially advances time by N days for live presentation.
 */
export const advanceSLABreach = (app, daysToAdvance = 10) => {
  const currentStart = new Date(app.sla?.stageStartedAt || Date.now());
  const newStart = new Date(currentStart.getTime() - daysToAdvance * 24 * 60 * 60 * 1000);
  
  const updatedSLA = calculateSLA(newStart, app.sla?.daysAllowed || 7);
  updatedSLA.escalationLevel = 2;
  updatedSLA.escalatedTo = 'AICTE Member Secretary (Apex HQ)';
  updatedSLA.escalationReason = `Simulated Demonstration: SLA aged by +${daysToAdvance} days. Auto-Escalation Level 2 Triggered.`;
  updatedSLA.isOverdue = true;

  return updatedSLA;
};
