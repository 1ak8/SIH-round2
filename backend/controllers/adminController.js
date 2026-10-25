import { memoryStore, logAuditEvent } from '../utils/memoryStore.js';
import Application from '../models/Application.js';
import AuditLog from '../models/AuditLog.js';
import { getDBStatus } from '../config/db.js';

export const getHQDashboardMetrics = async (req, res) => {
  try {
    let apps = memoryStore.applications;
    if (getDBStatus()) {
      apps = await Application.find();
    }

    const total = apps.length;
    const underScrutiny = apps.filter((a) => a.stage === 'Scrutiny').length;
    const inEVC = apps.filter((a) => a.stage === 'EVC').length;
    const approved = apps.filter((a) => a.status === 'Approved').length;
    const deficient = apps.filter((a) => a.status === 'Deficiency Raised').length;
    const overdue = apps.filter((a) => a.sla?.isOverdue).length;
    const level2Escalations = apps.filter((a) => a.sla?.escalationLevel === 2).length;

    const clearanceRate = total > 0 ? Math.round((approved / total) * 100) : 0;
    const avgDays = 8.4;

    res.json({
      success: true,
      metrics: {
        totalApplications: total,
        underScrutiny,
        inEVC,
        approved,
        deficient,
        overdueSla: overdue,
        level2CriticalEscalations: level2Escalations,
        clearanceRatePercent: clearanceRate,
        averageProcessingDays: avgDays,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRegionalHeatmap = async (req, res) => {
  try {
    let apps = memoryStore.applications;
    if (getDBStatus()) {
      apps = await Application.find();
    }

    const regions = ['Northern', 'Western', 'Southern', 'Eastern', 'Central'];
    const heatmapData = regions.map((reg) => {
      const regApps = apps.filter((a) => a.region === reg);
      const total = regApps.length;
      const approved = regApps.filter((a) => a.status === 'Approved').length;
      const overdue = regApps.filter((a) => a.sla?.isOverdue).length;
      const avgDaysSpent =
        total > 0
          ? Math.round((regApps.reduce((acc, a) => acc + (a.sla?.daysSpent || 3), 0) / total) * 10) / 10
          : 0;
      const slaComplianceRate = total > 0 ? Math.round(((total - overdue) / total) * 100) : 100;

      let bottleneckStatus = 'Normal Flow';
      if (overdue >= 2 || slaComplianceRate < 60) {
        bottleneckStatus = 'Critical Backlog';
      } else if (overdue === 1 || slaComplianceRate < 80) {
        bottleneckStatus = 'Moderate Delay';
      }

      return {
        region: reg,
        total,
        approved,
        overdue,
        avgDaysSpent,
        slaComplianceRate,
        bottleneckStatus,
      };
    });

    res.json({ success: true, heatmap: heatmapData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEscalationMatrix = async (req, res) => {
  try {
    let apps = memoryStore.applications;
    if (getDBStatus()) {
      apps = await Application.find();
    }

    // Filter applications with breaches or active escalations
    const breachedApps = apps.filter(
      (a) => a.sla?.isOverdue || (a.sla?.escalationLevel && a.sla.escalationLevel > 0)
    );

    const level1Escalations = breachedApps.filter((a) => a.sla?.escalationLevel === 1);
    const level2Escalations = breachedApps.filter((a) => a.sla?.escalationLevel === 2);

    res.json({
      success: true,
      totalBreaches: breachedApps.length,
      level1Count: level1Escalations.length,
      level2Count: level2Escalations.length,
      breachedApplications: breachedApps,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const reassignOfficer = async (req, res) => {
  try {
    const { id } = req.params;
    const { newOfficerName = 'Dr. V. K. Bansal (Bureau Director)', notes = 'Re-assigned due to SLA breach' } = req.body;

    let app = memoryStore.applications.find((a) => a.applicationId === id);
    if (!app && getDBStatus()) {
      app = await Application.findOne({ applicationId: id });
    }

    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const prevOfficer = app.assignedRO;
    app.assignedRO = newOfficerName;
    app.sla.escalatedTo = newOfficerName;

    if (getDBStatus()) {
      await Application.findOneAndUpdate(
        { applicationId: id },
        { assignedRO: newOfficerName, 'sla.escalatedTo': newOfficerName }
      );
    }

    await logAuditEvent({
      applicationId: id,
      actorName: req.user?.name || 'Member Secretary HQ',
      role: 'HQ Super-Admin',
      action: 'OFFICER_REASSIGNED',
      remarks: `Reassigned application scrutiny from ${prevOfficer} to ${newOfficerName}. Reason: ${notes}`,
    });

    res.json({
      success: true,
      message: `Application scrutiny successfully re-assigned to ${newOfficerName}.`,
      application: app,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRulesConfig = async (req, res) => {
  res.json({
    success: true,
    rules: memoryStore.rules,
  });
};

export const updateRulesConfig = async (req, res) => {
  try {
    const { scrutinySlaDays, evcSlaDays, docWarningDays, geofenceMaxDistanceMeters } = req.body;

    if (scrutinySlaDays) memoryStore.rules.scrutinySlaDays = Number(scrutinySlaDays);
    if (evcSlaDays) memoryStore.rules.evcSlaDays = Number(evcSlaDays);
    if (docWarningDays) memoryStore.rules.docWarningDays = Number(docWarningDays);
    if (geofenceMaxDistanceMeters) memoryStore.rules.geofenceMaxDistanceMeters = Number(geofenceMaxDistanceMeters);

    await logAuditEvent({
      applicationId: 'SYSTEM',
      actorName: req.user?.name || 'Member Secretary HQ',
      role: 'HQ Super-Admin',
      action: 'RULES_ENGINE_UPDATED',
      remarks: `Approval SLA policies updated: Scrutiny ${memoryStore.rules.scrutinySlaDays}d, EVC ${memoryStore.rules.evcSlaDays}d, Warning window ${memoryStore.rules.docWarningDays}d.`,
    });

    res.json({
      success: true,
      message: 'Approval Process Handbook policy rules updated dynamically.',
      rules: memoryStore.rules,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAuditLogs = async (req, res) => {
  try {
    const { applicationId, role, search } = req.query;
    let logs = [];

    if (getDBStatus()) {
      const q = {};
      if (applicationId) q.applicationId = applicationId;
      if (role) q.role = role;
      logs = await AuditLog.find(q).sort({ timestamp: -1 }).limit(100);
    } else {
      logs = [...memoryStore.auditLogs];
      if (applicationId) logs = logs.filter((l) => l.applicationId === applicationId);
      if (role) logs = logs.filter((l) => l.role === role);
      if (search) {
        const s = search.toLowerCase();
        logs = logs.filter(
          (l) =>
            l.action?.toLowerCase().includes(s) ||
            l.remarks?.toLowerCase().includes(s) ||
            l.actorName?.toLowerCase().includes(s)
        );
      }
    }

    res.json({ success: true, count: logs.length, auditLogs: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
