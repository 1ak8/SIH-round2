// In-Memory Failover Repository for offline hackathon/demo environments
export const memoryStore = {
  users: [],
  applications: [],
  documents: [],
  inspections: [],
  undertakings: [],
  auditLogs: [],
  rules: {
    scrutinySlaDays: 7,
    evcSlaDays: 14,
    docWarningDays: 60,
    geofenceMaxDistanceMeters: 200,
    autoEscalateL1Days: 8,
    autoEscalateL2Days: 12,
  },
};

export const logAuditEvent = async ({
  applicationId = 'SYSTEM',
  actorName = 'System Engine',
  role = 'HQ Super-Admin',
  action,
  fromState = '',
  toState = '',
  remarks = '',
  ipAddress = '127.0.0.1',
  metadata = {},
}) => {
  const logItem = {
    _id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    applicationId,
    actorName,
    role,
    action,
    fromState,
    toState,
    remarks,
    ipAddress,
    metadata,
    timestamp: new Date(),
    createdAt: new Date(),
  };

  memoryStore.auditLogs.unshift(logItem);
  return logItem;
};
